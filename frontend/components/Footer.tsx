"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white">
                QH
              </span>
              <span className="text-lg font-semibold text-gray-900">QuietHelp</span>
            </div>
            <p className="text-gray-600 text-sm max-w-md mb-4">
              Anonymous peer support when you need it most. No logins, no judgment, just real human connection.
            </p>
            <p className="text-gray-500 text-xs">
              QuietHelp is not a replacement for professional therapy or medical care.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  Helplines
                </Link>
              </li>
              <li>
                <Link href="/ai-chat" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
                  AI Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Crisis Support */}
          <div>
            <h4 className="text-gray-900 font-semibold mb-4">Crisis Support</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:988" className="text-gray-600 hover:text-gray-900 transition-colors">
                  USA: Call or text 988
                </a>
              </li>
              <li>
                <a href="tel:116123" className="text-gray-600 hover:text-gray-900 transition-colors">
                  UK: 116 123
                </a>
              </li>
              <li>
                <a
                  href="https://findahelpline.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Find local helplines →
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} QuietHelp. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-gray-500 text-sm">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> for those who need it
          </p>
        </div>
      </div>
    </footer>
  );
}
