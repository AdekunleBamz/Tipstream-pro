import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Terms of Service Page
 * 
 * Legal terms and conditions for using TipStream Pro.
 */

export const metadata = {
  title: 'Terms of Service | TipStream Pro',
  description: 'Terms and conditions for using TipStream Pro platform.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="text-sm text-zinc-500 mb-8">
            Last updated: January 2024
          </div>
          
          <div className="prose prose-invert prose-zinc max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                By accessing or using TipStream Pro ("the Platform"), you agree to be bound by 
                these Terms of Service and all applicable laws and regulations. If you do not 
                agree with any of these terms, you are prohibited from using or accessing this 
                Platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Platform Description</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                TipStream Pro is a decentralized tipping and creator support platform built on 
                the Base blockchain. The Platform enables users to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Send and receive cryptocurrency tips</li>
                <li>Create and manage subscription tiers</li>
                <li>Mint and collect supporter NFTs</li>
                <li>Participate in daily check-in rewards</li>
                <li>Engage with the Farcaster social protocol</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Eligibility</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                You must be at least 18 years old and capable of forming a binding contract 
                to use this Platform. By using TipStream Pro, you represent and warrant that 
                you meet all eligibility requirements.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Wallet and Account</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Access to TipStream Pro requires a compatible cryptocurrency wallet (e.g., 
                MetaMask, Coinbase Wallet, Rainbow). You are solely responsible for:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Maintaining the security of your wallet and private keys</li>
                <li>All activities that occur through your wallet on the Platform</li>
                <li>Any losses resulting from unauthorized access to your wallet</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Transactions</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                All transactions on TipStream Pro are executed on the Base blockchain and are:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Irreversible once confirmed on-chain</li>
                <li>Subject to network gas fees</li>
                <li>Your sole responsibility to verify before confirming</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                The Platform is not responsible for any losses due to incorrect addresses, 
                failed transactions, or blockchain network issues.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Platform Fees</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                TipStream Pro may charge platform fees on certain transactions. Current fee 
                structure:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Tips: 2.5% platform fee</li>
                <li>Subscriptions: 5% platform fee</li>
                <li>NFT minting: Gas fees only</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Prohibited Activities</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Use the Platform for money laundering or illegal activities</li>
                <li>Attempt to exploit or compromise smart contracts</li>
                <li>Engage in fraudulent or deceptive practices</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Harass or harm other users</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Intellectual Property</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                The Platform and its original content, features, and functionality are owned 
                by TipStream Pro and are protected by international copyright, trademark, and 
                other intellectual property laws.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                THE PLATFORM IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT 
                GUARANTEE UNINTERRUPTED OR ERROR-FREE OPERATION. CRYPTOCURRENCY INVESTMENTS 
                ARE VOLATILE AND YOU MAY LOSE YOUR ENTIRE INVESTMENT.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                In no event shall TipStream Pro be liable for any indirect, incidental, 
                special, consequential, or punitive damages resulting from your use of the 
                Platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. Continued use of the 
                Platform after changes constitutes acceptance of the new terms.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Contact</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                For questions about these Terms, please contact us at legal@tipstream.pro
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
