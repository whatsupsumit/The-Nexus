// src/components/Footer.js
import React from "react";

export default function Footer() {
  return (
    <footer className="w-full relative z-50 bg-black/95 border-t border-gray-800 text-gray-300 text-sm py-8 select-none">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-center md:text-left">
          <h2 className="text-red-500 text-lg font-semibold tracking-wider">NEXUS</h2>
          <p className="text-gray-400">The Entertainment Matrix That Actually Works</p>
          <p className="text-xs text-gray-500 mt-1">Built with love and too much coffee</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3 text-center md:text-right">
          <a href="/" className="hover:text-red-500 transition">Home</a>
          <a href="https://github.com/whatsupsumit/The-Nexus" target="_blank" rel="noreferrer" className="hover:text-red-500 transition">GitHub</a>
          <a href="mailto:sksumitboss123@gmail.com" className="hover:text-red-500 transition">Contact</a>
          <a href="/privacy" className="hover:text-red-500 transition">Privacy</a>
        </div>
      </div>

      <div className="text-center text-gray-400 text-xs mt-6 tracking-wide">
        <p>© {new Date().getFullYear()} NEXUS v2.1.0 | VidSrc Integration Enabled</p>
      </div>
    </footer>
  );
}
