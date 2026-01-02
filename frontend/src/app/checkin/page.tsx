import { Navbar, ChainGuard, DailyCheckInCard } from "@/components";

export default function CheckInPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="max-w-md mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Daily Check-In</h1>
            <p className="text-gray-400">
              Build your streak and earn rewards
            </p>
          </div>

          <DailyCheckInCard />

          <div className="mt-8 bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <h3 className="font-bold text-white mb-4">🎯 Streak Benefits</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>🔥 7 days: Bronze Badge</li>
              <li>🔥 30 days: Silver Badge</li>
              <li>🔥 100 days: Gold Badge</li>
              <li>🔥 365 days: Diamond Badge</li>
            </ul>
          </div>
        </main>
      </ChainGuard>
    </>
  );
}
