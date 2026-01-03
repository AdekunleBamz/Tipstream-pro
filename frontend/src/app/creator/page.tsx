"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CreatorDashboard } from "@/components/CreatorDashboard";

export default function CreatorPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Creator Dashboard</h1>
          <p className="text-gray-400 mb-8">
            Set up your subscription plans so fans can subscribe to your content.
          </p>
          <CreatorDashboard />
        </div>
      </div>
      <Footer />
    </main>
  );
}
