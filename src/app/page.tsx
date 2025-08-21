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
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6">
              <span className="text-2xl sm:text-3xl">🏠</span>
            </div>
            
            {/* App Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4 tracking-tight">
              Big Brother
              <span className="block gold-gradient bg-clip-text text-transparent">
                Fantasy League
              </span>
            </h1>
            
            {/* App Description */}
            <p className="text-base sm:text-lg text-white/90 mb-6 sm:mb-8 leading-relaxed">
              Pick your 5 houseguests and compete in the ultimate Big Brother Season 27 fantasy league!
            </p>
            
            {/* Primary CTA */}
            <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
              <Link href="/welcome" className="block sm:inline-block">
                <Button className="w-full sm:w-auto gold-accent hover:scale-105 transition-transform px-6 py-3 text-base font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link href="/houseguests" className="block sm:inline-block">
                <Button variant="outline" className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 py-3 text-base">
                  View Houseguests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Main Content */}
      <div className="px-4 py-6 sm:py-8">
        {/* Quick Actions - Mobile Grid */}
        <div className="space-y-4 mb-8 sm:mb-12">
          <Link href="/houseguests">
            <Card className="navy-card group active:scale-95 transition-all duration-200">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">👥</span>
                </div>
                <CardTitle className="navy-text text-lg">Houseguests</CardTitle>
                <CardDescription className="text-sm">View all contestants and their stats</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/leaderboard">
            <Card className="navy-card group active:scale-95 transition-all duration-200">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">🏆</span>
                </div>
                <CardTitle className="navy-text text-lg">Leaderboard</CardTitle>
                <CardDescription className="text-sm">See who&apos;s winning the fantasy league</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/history">
            <Card className="navy-card group active:scale-95 transition-all duration-200">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">📊</span>
                </div>
                <CardTitle className="navy-text text-lg">History</CardTitle>
                <CardDescription className="text-sm">Week-by-week competition results</CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/welcome">
            <Card className="navy-card group active:scale-95 transition-all duration-200">
              <CardHeader className="text-center pb-3">
                <div className="w-12 h-12 gold-gradient rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-lg">⚡</span>
                </div>
                <CardTitle className="navy-text text-lg">Join Now</CardTitle>
                <CardDescription className="text-sm">Create your team and start competing</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* How It Works - Mobile Stack */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold navy-text mb-6 sm:mb-8">
            How It Works
          </h2>
          <div className="space-y-6 sm:space-y-8">
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-lg navy-text mb-2">Pick Your Team</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Select exactly 5 houseguests from the Season 27 cast
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-lg navy-text mb-2">Earn Points</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Get 2 points for each HOH, POV, or Blockbuster win
              </p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-lg navy-text mb-2">Compete</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Climb the leaderboard as the season progresses
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section - Mobile Grid */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold gold-text mb-1">27</div>
            <div className="text-xs sm:text-sm text-slate-600">Season</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold gold-text mb-1">5</div>
            <div className="text-xs sm:text-sm text-slate-600">Houseguests</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold gold-text mb-1">2</div>
            <div className="text-xs sm:text-sm text-slate-600">Points per Win</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold gold-text mb-1">∞</div>
            <div className="text-xs sm:text-sm text-slate-600">Fun</div>
          </div>
        </div>
      </div>
    </div>
  )
}
