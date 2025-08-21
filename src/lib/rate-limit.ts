import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory rate limiter
// In production, you'd want to use Redis or a similar solution
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (request: NextRequest, limit: number, token: string) => {
      const now = Date.now()
      const tokenData = rateLimitMap.get(token)

      // Clean up expired entries periodically
      if (Math.random() < 0.01) {
        for (const [key, data] of rateLimitMap.entries()) {
          if (now > data.resetTime) {
            rateLimitMap.delete(key)
          }
        }
      }

      if (!tokenData || now > tokenData.resetTime) {
        // First request or window has expired
        rateLimitMap.set(token, {
          count: 1,
          resetTime: now + config.interval,
        })
        return { success: true, limit, remaining: limit - 1, reset: now + config.interval }
      }

      if (tokenData.count >= limit) {
        // Rate limit exceeded
        return { 
          success: false, 
          limit, 
          remaining: 0, 
          reset: tokenData.resetTime,
          error: 'Rate limit exceeded'
        }
      }

      // Increment counter
      tokenData.count += 1
      rateLimitMap.set(token, tokenData)

      return { 
        success: true, 
        limit, 
        remaining: limit - tokenData.count, 
        reset: tokenData.resetTime 
      }
    },
  }
}

// Get client identifier (IP address + user agent hash)
export function getClientIdentifier(request: NextRequest): string {
  const ip = request.ip || 
    request.headers.get('x-forwarded-for')?.split(',')[0] || 
    request.headers.get('x-real-ip') || 
    'unknown'
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  
  // Simple hash function for user agent
  let hash = 0
  for (let i = 0; i < userAgent.length; i++) {
    const char = userAgent.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return `${ip}-${hash}`
}

// Middleware function to apply rate limiting
export async function withRateLimit(
  request: NextRequest,
  handler: (request: NextRequest) => Promise<NextResponse>,
  config: { 
    limit: number
    window: number // in seconds
    skipSuccessfulGET?: boolean
  } = { limit: 10, window: 60 }
): Promise<NextResponse> {
  const limiter = rateLimit({
    interval: config.window * 1000, // Convert to milliseconds
    uniqueTokenPerInterval: 500, // Max unique tokens to track
  })

  const identifier = getClientIdentifier(request)
  const result = limiter.check(request, config.limit, identifier)

  if (!result.success) {
    return NextResponse.json(
      { error: result.error },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': result.limit.toString(),
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.reset).toISOString(),
          'Retry-After': Math.ceil((result.reset - Date.now()) / 1000).toString(),
        }
      }
    )
  }

  const response = await handler(request)

  // Add rate limit headers to successful responses
  response.headers.set('X-RateLimit-Limit', result.limit.toString())
  response.headers.set('X-RateLimit-Remaining', result.remaining.toString())
  response.headers.set('X-RateLimit-Reset', new Date(result.reset).toISOString())

  return response
}
