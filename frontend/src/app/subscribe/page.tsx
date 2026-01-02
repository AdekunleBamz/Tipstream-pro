import { Navbar, ChainGuard, SubscriptionForm } from "@/components";

export default function SubscribePage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Subscribe to Creators</h1>
            <p className="text-gray-400">
              Support creators with monthly recurring payments
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6">
            <SubscriptionForm />
          </div>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>🔄 Subscriptions auto-renew. Cancel anytime.</p>
          </div>
        </main>
      </ChainGuard>
    </>
  );
}
