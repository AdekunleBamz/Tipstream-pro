import { Navbar, HeroSection, ChainGuard, StatsCards, FeaturesSection, Footer } from "@/components";

export default function Home() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main>
          <HeroSection />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StatsCards />
          </div>
          <FeaturesSection />
          <Footer />
        </main>
      </ChainGuard>
    </>
  );
}
