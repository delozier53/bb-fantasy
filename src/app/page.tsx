import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Big Brother Fantasy
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pick your 5 houseguests and compete in the ultimate Big Brother Season 27 fantasy league!
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Houseguests</CardTitle>
              <CardDescription>View all contestants and their stats</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/houseguests">
                <Button className="w-full">Browse Houseguests</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboard</CardTitle>
              <CardDescription>See who&apos;s winning the fantasy league</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/leaderboard">
                <Button className="w-full">View Rankings</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Week-by-week competition results</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/history">
                <Button className="w-full">View History</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Join Now</CardTitle>
              <CardDescription>Create your team and start competing</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/welcome">
                <Button className="w-full" variant="default">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mt-16 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold mb-2">Pick Your Team</h3>
              <p className="text-gray-600">
                Select exactly 5 houseguests from the Season 27 cast
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold mb-2">Earn Points</h3>
              <p className="text-gray-600">
                Get 2 points for each HOH, POV, or Blockbuster win
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold mb-2">Compete</h3>
              <p className="text-gray-600">
                Climb the leaderboard as the season progresses
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
