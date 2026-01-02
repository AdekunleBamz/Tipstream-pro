import { Navbar, ChainGuard, TipForm, Footer } from "@/components";

export default function TipPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="min-h-[calc(100vh-200px)]">
          <div className="max-w-2xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">💸 Send a Tip</h1>
              <p className="text-gray-400">
                Support your favorite creators with micro-tips on Base Chain
              </p>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 glow-pulse">
              <TipForm />
            </div>

            <div className="mt-8 text-center text-sm text-gray-500">
              <p>💡 Tips go directly to creators. Only 0.0001 ETH platform fee.</p>
            </div>
          </div>
        </main>
        <Footer />
      </ChainGuard>
    </>
  );
}
