import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

/**
 * Privacy Policy Page
 * 
 * Privacy policy and data handling information for TipStream Pro.
 */

export const metadata = {
  title: 'Privacy Policy | TipStream Pro',
  description: 'Privacy policy and data handling practices for TipStream Pro platform.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="text-sm text-zinc-500 mb-8">
            Last updated: January 2024
          </div>
          
          <div className="prose prose-invert prose-zinc max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                TipStream Pro ("we", "our", or "us") respects your privacy and is committed 
                to protecting your personal data. This privacy policy explains how we collect, 
                use, and safeguard your information when you use our platform.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-medium mb-3 text-zinc-200">
                Blockchain Data (Public)
              </h3>
              <p className="text-zinc-300 leading-relaxed mb-4">
                All transactions on TipStream Pro are recorded on the Base blockchain. This 
                includes:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Wallet addresses</li>
                <li>Transaction history (tips, subscriptions, NFT mints)</li>
                <li>Smart contract interactions</li>
                <li>Token balances and transfers</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed mb-4">
                This data is publicly accessible on the blockchain and is not controlled by us.
              </p>
              
              <h3 className="text-xl font-medium mb-3 text-zinc-200">
                Data We Collect Directly
              </h3>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Profile information you provide (display name, bio, avatar)</li>
                <li>Creator page customizations</li>
                <li>Subscription tier configurations</li>
                <li>Check-in activity and streaks</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 text-zinc-200">
                Automatically Collected Data
              </h3>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Device information and browser type</li>
                <li>IP address (anonymized)</li>
                <li>Usage patterns and feature interactions</li>
                <li>Error logs and performance data</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We use collected information to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Provide and maintain the Platform</li>
                <li>Process transactions and manage subscriptions</li>
                <li>Display leaderboards and public statistics</li>
                <li>Send notifications about your activity</li>
                <li>Improve and optimize the user experience</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Data Storage and Security</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Encryption in transit (TLS/SSL)</li>
                <li>Secure cloud infrastructure</li>
                <li>Regular security audits</li>
                <li>Access controls and authentication</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                However, no method of transmission over the internet is 100% secure.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Third-Party Services</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We integrate with third-party services including:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Wallet providers (MetaMask, Coinbase Wallet, Rainbow)</li>
                <li>Farcaster social protocol</li>
                <li>Base blockchain network</li>
                <li>Analytics services (anonymized data only)</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                Each third party has their own privacy policies governing their data practices.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of off-chain data</li>
                <li>Object to certain data processing</li>
                <li>Export your data</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                Note: Blockchain data cannot be deleted or modified due to its immutable nature.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We use essential cookies to:
              </p>
              <ul className="list-disc pl-6 text-zinc-300 space-y-2 mb-4">
                <li>Maintain session state</li>
                <li>Remember your preferences</li>
                <li>Ensure security</li>
              </ul>
              <p className="text-zinc-300 leading-relaxed">
                You can control cookies through your browser settings.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                TipStream Pro is not intended for users under 18 years of age. We do not 
                knowingly collect information from children.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">International Data Transfers</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                Your data may be processed in countries outside your residence. We ensure 
                appropriate safeguards are in place for such transfers.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                We may update this privacy policy from time to time. We will notify you of 
                significant changes through the Platform or via email.
              </p>
            </section>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-zinc-300 leading-relaxed mb-4">
                For privacy-related questions or to exercise your rights, contact us at:
              </p>
              <p className="text-zinc-300">
                Email: privacy@tipstream.pro
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
