"use client";

export function Footer() {
  return (
    <footer className="bg-gray-900/80 border-t border-purple-500/20 py-8 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Ξ</span>
              </div>
              <span className="text-lg font-bold text-white">TipStream Pro</span>
            </div>
            <p className="text-gray-400 text-sm">
              Stream Tips, Stack Stats, Surge Rankings
            </p>
          </div>

          {/* Contracts */}
          <div>
            <h3 className="font-bold text-white mb-4">Contracts</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://basescan.org/address/0x9FB4486fD78aB583f091958E331b7A805c5775d4"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  TipStream ↗
                </a>
              </li>
              <li>
                <a
                  href="https://basescan.org/address/0x47b1E98c56A2a3Cd95722e25A118654Ddf93FED0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  TipNFT ↗
                </a>
              </li>
              <li>
                <a
                  href="https://basescan.org/address/0xde57810A28652745446E4f188D30076c57D8C4d2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  SubscriptionManager ↗
                </a>
              </li>
              <li>
                <a
                  href="https://basescan.org/address/0x30fa4DE1205AFDe0F00Cee051c5c3dA8Dc3C7Ef8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  DailyCheckIn ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/AdekunleBamz/Tipstream-pro"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  GitHub ↗
                </a>
              </li>
              <li>
                <a
                  href="https://base.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-400 transition"
                >
                  Base Chain ↗
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
          © 2026 TipStream Pro. Built on Base Chain.
        </div>
      </div>
    </footer>
  );
}
