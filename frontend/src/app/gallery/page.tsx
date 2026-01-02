import { Navbar, ChainGuard, NFTGallery } from "@/components";

export default function GalleryPage() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">My NFT Receipts</h1>
            <p className="text-gray-400">
              View all your tip receipt NFTs
            </p>
          </div>

          <NFTGallery />
        </main>
      </ChainGuard>
    </>
  );
}
