# Debug Guide for Big Brother Fantasy League

## Using CodeRabbit for Debugging

### 1. GitHub Integration
1. Go to your GitHub repository
2. Install the CodeRabbit GitHub App from [here](https://github.com/apps/coderabbit)
3. Select your repository and grant permissions
4. CodeRabbit will automatically review your code and provide debugging insights

### 2. Web Interface
1. Visit [CodeRabbit.ai](https://coderabbit.ai)
2. Connect your GitHub repository
3. Upload specific files or entire codebase for analysis

## Local Debugging Setup

### VS Code Debugging
1. Open VS Code in your project directory
2. Go to the Debug panel (Ctrl/Cmd + Shift + D)
3. Select one of the debug configurations:
   - **Next.js: debug server-side** - Debug API routes and server-side code
   - **Next.js: debug client-side** - Debug React components in Chrome
   - **Next.js: debug full stack** - Debug both client and server

### Command Line Debugging
```bash
# Debug with Node.js inspector
npm run debug

# Debug client-side only
npm run debug:client

# Run with additional debugging
NODE_OPTIONS='--inspect --inspect-brk' npm run dev
```

## Common Debugging Scenarios

### 1. API Route Debugging
- Set breakpoints in `src/app/api/**/*.ts` files
- Use `console.log()` for request/response logging
- Check Prisma query logs with `DEBUG=prisma:* npm run dev`

### 2. Authentication Issues
- Debug NextAuth configuration in `src/lib/auth.ts`
- Check session handling in components
- Verify environment variables

### 3. Database Issues
- Use Prisma Studio: `npx prisma studio`
- Check database connection in `src/lib/prisma.ts`
- Verify schema migrations

### 4. TypeScript Errors
- Run `npm run lint` to check for type issues
- Use VS Code TypeScript language server
- Check type definitions in `src/types/index.ts`

## Debug Tools and Extensions

### Recommended VS Code Extensions
- **Prisma** - Database schema highlighting
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Thunder Client** - API testing
- **Error Lens** - Inline error display

### Browser Extensions
- **React Developer Tools** - Component debugging
- **Redux DevTools** - State management (if using Redux)

## Performance Debugging

### 1. Next.js Performance
```bash
# Build with performance analysis
npm run build
# Check bundle analyzer
ANALYZE=true npm run build
```

### 2. Database Performance
```bash
# Enable Prisma query logging
DEBUG=prisma:* npm run dev
```

### 3. Memory Leaks
```bash
# Run with memory profiling
NODE_OPTIONS='--inspect --inspect-brk --max-old-space-size=4096' npm run dev
```

## Error Handling Debugging

### 1. API Error Logging
Add to your API routes:
```typescript
try {
  // Your code
} catch (error) {
  console.error('API Error:', error);
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}
```

### 2. Client Error Boundary
Create error boundaries for React components to catch and log errors.

### 3. Global Error Handler
Set up global error handling in `src/app/globals.css` or custom error pages.

## Security Debugging

### 1. Authentication Flow
- Test magic link generation
- Verify session management
- Check role-based access control

### 2. Input Validation
- Test API endpoints with invalid data
- Verify Zod schema validation
- Check SQL injection prevention

### 3. Rate Limiting
- Test rate limiting on API endpoints
- Verify IP-based restrictions

## CodeRabbit Integration Tips

### 1. Custom Instructions
The `.coderabbit.yaml` file contains custom instructions for:
- Security vulnerability detection
- TypeScript type safety
- Database query optimization
- Authentication flow security

### 2. Focus Areas
CodeRabbit will prioritize:
- API endpoints and data validation
- Authentication and security
- Database queries and Prisma usage
- React components and state management

### 3. Review Process
1. Push changes to GitHub
2. CodeRabbit will automatically review
3. Check the generated report for:
   - Security issues
   - Performance problems
   - Code quality suggestions
   - Type safety issues

## Troubleshooting Common Issues

### 1. Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build
```

### 2. Database Connection Issues
```bash
# Reset database
npx prisma db push --force-reset
npm run db:seed
```

### 3. TypeScript Errors
```bash
# Regenerate Prisma client
npx prisma generate
# Check types
npx tsc --noEmit
```

### 4. Authentication Issues
- Verify environment variables
- Check email provider configuration
- Test magic link flow

## Getting Help

1. **CodeRabbit Reports** - Check automated code reviews
2. **GitHub Issues** - Create issues for bugs
3. **Stack Overflow** - Search for Next.js/Prisma issues
4. **Discord/Community** - Join Next.js community

## Best Practices

1. **Always use TypeScript** - Catch errors at compile time
2. **Write tests** - Prevent regressions
3. **Use ESLint** - Maintain code quality
4. **Monitor performance** - Use Next.js analytics
5. **Log errors** - Implement proper error logging
6. **Security first** - Validate all inputs
