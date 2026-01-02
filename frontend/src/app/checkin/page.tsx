import { Navbar, ChainGuard, DailyCheckInCard, Footer } from "@/components";

export default function CheckInPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="min-h-[calc(100vh-200px)]">
          <div className="max-w-md mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">🔥 Daily Check-In</h1>
              <p className="text-gray-400">
                Build your streak and earn rewards
              </p>
            </div>

            <DailyCheckInCard />

            <div className="mt-8 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6">
              <h3 className="font-bold text-white mb-4">🎯 Streak Benefits</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li className="flex items-center gap-2">
                  <span className="text-orange-400">🥉</span> 7 days: Bronze Badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gray-300">🥈</span> 30 days: Silver Badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-yellow-400">🥇</span> 100 days: Gold Badge
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">💎</span> 365 days: Diamond Badge
                </li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </ChainGuard>
    </>
  );
}
