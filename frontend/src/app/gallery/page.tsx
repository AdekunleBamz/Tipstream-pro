import { Navbar, ChainGuard, NFTGallery, Footer } from "@/components";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="min-h-[calc(100vh-200px)]">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">🎨 My NFT Receipts</h1>
              <p className="text-gray-400">
                View all your tip receipt NFTs
              </p>
            </div>

            <NFTGallery />
          </div>
        </main>
        <Footer />
      </ChainGuard>
    </>
  );
}
