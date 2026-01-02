import { Navbar, ChainGuard, TipForm } from "@/components";

export default function TipPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Send a Tip</h1>
            <p className="text-gray-400">
              Support your favorite creators with micro-tips on Base Chain
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <TipForm />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>💡 Tips go directly to creators. Only 0.0001 ETH platform fee.</p>
          </div>
        </main>
      </ChainGuard>
    </>
  );
}
