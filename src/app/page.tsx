import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen navy-gradient">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto mobile-container py-12 sm:py-20">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full mb-6">
              <span className="text-3xl sm:text-4xl">🏠</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Big Brother
              <span className="block gold-gradient bg-clip-text text-transparent">
                Fantasy League
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Pick your 5 houseguests and compete in the ultimate Big Brother Season 27 fantasy league!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/welcome">
                <Button className="gold-accent hover:scale-105 transition-transform px-8 py-3 text-lg font-semibold">
                  Get Started
                </Button>
              </Link>
              <Link href="/houseguests">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                  View Houseguests
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto mobile-container py-12 sm:py-20">
        {/* Quick Actions */}
        <div className="mobile-grid max-w-6xl mx-auto mb-16 sm:mb-24">
          <Card className="navy-card group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">👥</span>
              </div>
              <CardTitle className="navy-text">Houseguests</CardTitle>
              <CardDescription>View all contestants and their stats</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/houseguests">
                <Button className="w-full gold-accent hover:scale-105 transition-transform">
                  Browse Houseguests
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="navy-card group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">🏆</span>
              </div>
              <CardTitle className="navy-text">Leaderboard</CardTitle>
              <CardDescription>See who&apos;s winning the fantasy league</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/leaderboard">
                <Button className="w-full gold-accent hover:scale-105 transition-transform">
                  View Rankings
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="navy-card group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">📊</span>
              </div>
              <CardTitle className="navy-text">History</CardTitle>
              <CardDescription>Week-by-week competition results</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/history">
                <Button className="w-full gold-accent hover:scale-105 transition-transform">
                  View History
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="navy-card group hover:scale-105 transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 gold-gradient rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">⚡</span>
              </div>
              <CardTitle className="navy-text">Join Now</CardTitle>
              <CardDescription>Create your team and start competing</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/welcome">
                <Button className="w-full gold-accent hover:scale-105 transition-transform">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* How It Works Section */}
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold navy-text mb-4 sm:mb-8">
            How It Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="font-bold text-xl navy-text mb-3">Pick Your Team</h3>
              <p className="text-slate-600 leading-relaxed">
                Select exactly 5 houseguests from the Season 27 cast
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="font-bold text-xl navy-text mb-3">Earn Points</h3>
              <p className="text-slate-600 leading-relaxed">
                Get 2 points for each HOH, POV, or Blockbuster win
              </p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 sm:w-20 sm:h-20 gold-gradient rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="font-bold text-xl navy-text mb-3">Compete</h3>
              <p className="text-slate-600 leading-relaxed">
                Climb the leaderboard as the season progresses
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 sm:mt-32">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gold-text mb-2">27</div>
              <div className="text-sm sm:text-base text-slate-600">Season</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gold-text mb-2">5</div>
              <div className="text-sm sm:text-base text-slate-600">Houseguests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gold-text mb-2">2</div>
              <div className="text-sm sm:text-base text-slate-600">Points per Win</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gold-text mb-2">∞</div>
              <div className="text-sm sm:text-base text-slate-600">Fun</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
