import { Navbar, ChainGuard, Footer } from "@/components";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="min-h-[calc(100vh-200px)]">
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">About TipStream Pro</h1>
              <p className="text-gray-400 text-lg">
                The next-generation micro-tipping platform for Farcaster creators
              </p>
            </div>

            <div className="space-y-8">
              <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">🎯 Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  TipStream Pro is built to empower content creators in the Farcaster ecosystem. 
                  We believe in direct creator-to-supporter relationships without intermediaries 
                  taking large cuts. Our platform enables micro-tips with just 0.0001 ETH flat fee, 
                  making it accessible for everyone.
                </p>
              </section>

              <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">⚡ Why Base Chain?</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We chose Base Chain for its:
                </p>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Ultra-low transaction fees
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Fast block times (~2 seconds)
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Ethereum security via L2
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-purple-400">•</span> Growing Farcaster community
                  </li>
                </ul>
              </section>

              <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">🔐 Security</h2>
                <p className="text-gray-300 leading-relaxed">
                  All smart contracts are deployed on Base mainnet and are fully transparent. 
                  Tips go directly from sender to recipient with no custody period. 
                  NFT receipts are minted on-chain as proof of your support.
                </p>
              </section>

              <section className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-4">📊 Features</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">💸 Micro-Tipping</h3>
                    <p className="text-gray-400 text-sm">Instant tips with optional NFT receipts</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">⭐ Subscriptions</h3>
                    <p className="text-gray-400 text-sm">Monthly recurring support for creators</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">🔥 Daily Streaks</h3>
                    <p className="text-gray-400 text-sm">Build engagement with daily check-ins</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-xl p-4">
                    <h3 className="font-bold text-white mb-2">🎨 NFT Gallery</h3>
                    <p className="text-gray-400 text-sm">Collect and showcase your tip receipts</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
        <Footer />
      </ChainGuard>
    </>
  );
}
