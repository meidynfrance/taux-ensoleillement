'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.svg" alt="Taux-ensoleillement.fr" width={32} height={32} className="w-8 h-8" />
            <span className="text-lg font-bold text-gray-900 hidden sm:inline">
              Taux-ensoleillement<span className="text-amber-500">.fr</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Accueil
            </Link>
            <Link href="/region" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Régions
            </Link>
            <Link href="/departement" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              Départements
            </Link>
            <Link href="/a-propos" className="text-gray-700 hover:text-amber-600 font-medium transition-colors">
              À propos
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-100">
            <div className="flex flex-col gap-2 pt-3">
              <Link href="/" className="px-3 py-2 rounded-md text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium" onClick={() => setMenuOpen(false)}>
                Accueil
              </Link>
              <Link href="/region" className="px-3 py-2 rounded-md text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium" onClick={() => setMenuOpen(false)}>
                Régions
              </Link>
              <Link href="/departement" className="px-3 py-2 rounded-md text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium" onClick={() => setMenuOpen(false)}>
                Départements
              </Link>
              <Link href="/a-propos" className="px-3 py-2 rounded-md text-gray-700 hover:bg-amber-50 hover:text-amber-700 font-medium" onClick={() => setMenuOpen(false)}>
                À propos
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
