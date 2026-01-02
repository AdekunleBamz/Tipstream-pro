import { Navbar, HeroSection, ChainGuard, StatsCards } from "@/components";

export default function Home() {
  return (
    <>
      <Navbar />
      <ChainGuard>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection />
          <StatsCards />
        </main>
      </ChainGuard>
    </>
  );
}
