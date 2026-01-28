"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tip", label: "Tip" },
  { href: "/subscribe", label: "Subscribe" },
  { href: "/creator", label: "Creator" },
  { href: "/checkin", label: "Check-In" },
  { href: "/gallery", label: "My NFTs" },
];

export function Navbar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const navRef = useRef<HTMLDivElement>(null);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Keyboard navigation for desktop nav
  const handleNavKeyDown = useCallback((e: React.KeyboardEvent) => {
    const links = navLinks.length;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        setFocusedIndex((prev) => (prev + 1) % links);
        break;
      case "ArrowLeft":
        e.preventDefault();
        setFocusedIndex((prev) => (prev - 1 + links) % links);
        break;
      case "Home":
        e.preventDefault();
        setFocusedIndex(0);
        break;
      case "End":
        e.preventDefault();
        setFocusedIndex(links - 1);
        break;
    }
  }, []);

  // Focus management for keyboard nav
  useEffect(() => {
    if (focusedIndex >= 0 && navRef.current) {
      const links = navRef.current.querySelectorAll('a[data-nav-link]');
      (links[focusedIndex] as HTMLElement)?.focus();
    }
  }, [focusedIndex]);

  // Close menu on escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isMenuOpen, handleKeyDown]);

  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo with hover animation */}
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-purple-500/30">
                <span className="text-white font-bold text-xl">Ξ</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 group-hover:from-purple-300 group-hover:to-pink-300">
                TipStream Pro
              </span>
            </Link>

            {/* Desktop Nav Links with keyboard navigation */}
            <div
              ref={navRef}
              className="hidden md:flex items-center space-x-1"
              role="navigation"
              aria-label="Main navigation"
              onKeyDown={handleNavKeyDown}
            >
              {navLinks.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  data-nav-link
                  onFocus={() => setFocusedIndex(index)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${pathname === link.href
                      ? "text-purple-300"
                      : "text-gray-300 hover:text-white hover:bg-gray-800"
                    }`}
                >
                  {link.label}
                  {/* Active link indicator with animation */}
                  {pathname === link.href && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-scale-in" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-3">
              {/* Wallet Connect */}
              <div className="hidden sm:block">
                <ConnectButton />
              </div>

              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                <svg
                  className="w-6 h-6 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  {isMenuOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-gray-900 border-l border-purple-500/20 z-50 transform transition-transform duration-300 ease-out md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <span className="text-lg font-bold text-white">Menu</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <div className="p-4 space-y-2">
          {navLinks.map((link, index) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${pathname === link.href
                  ? "bg-purple-500/20 text-purple-300 border-l-2 border-purple-500"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile Wallet Connect */}
        <div className="p-4 border-t border-gray-800 sm:hidden">
          <ConnectButton />
        </div>
      </div>
    </>
  );
}
