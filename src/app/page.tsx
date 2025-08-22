import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen navy-gradient">
      {/* Mobile-First Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative px-4 py-8 sm:py-12">
          <div className="text-center max-w-md mx-auto">
            {/* App Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <img 
                src="/logo.svg" 
                alt="Big Brother Fantasy League Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16"
              />
            </div>
            
            {/* App Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              BB Fantasy League
            </h1>
            
            {/* App Description */}
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Join other BB fans, pick your favorite houseguests, earn points and climb the leaderboard
            </p>
            
            {/* Primary CTA */}
            <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
              <Link href="/welcome" className="block sm:inline-block">
                <Button className="w-full sm:w-auto gold-accent hover:scale-105 transition-transform px-6 py-3 text-base font-semibold">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Main Content */}
      <div className="px-4 py-6 sm:py-8">
        {/* How It Works - Mobile Stack */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8">
            How It Works
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Pick Your Team</h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Build your fantasy BB team of 5 houseguests
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Earn Points</h3>
              <div className="text-white/80 text-sm sm:text-base leading-relaxed space-y-1">
                <p>Winning HOH: 5pts</p>
                <p>Winning POV: 3pts</p>
                <p>Winning Block Buster: 3pts</p>
                <p>Surviving the Block: 1pt</p>
                <p>Weekly Survival: 1-15pts</p>
                <p>Runner Up: 10pts</p>
                <p>Winner: 25pts</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg text-white mb-2">Compete</h3>
              <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                Climb the leaderboard as the season progresses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
