'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Commune } from '@/types';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Commune[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const searchCommunes = useCallback(async (search: string) => {
    if (search.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('communes')
        .select('code_insee, nom, slug, code_postal, departement_code, ensoleillement_annuel')
        .ilike('nom', `${search}%`)
        .order('population', { ascending: false })
        .limit(8);

      if (error) throw error;
      setResults((data as Commune[]) || []);
      setIsOpen(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchCommunes(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, searchCommunes]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (commune: Commune) => {
    setQuery('');
    setIsOpen(false);
    router.push(`/commune/${commune.slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Rechercher une commune... (ex: Marseille, Nice, Lyon)"
          className="w-full px-5 py-3.5 pl-12 bg-white border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100 transition-all text-base shadow-sm"
          aria-label="Rechercher une commune"
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />
        <svg
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        {loading && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="h-5 w-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
          role="listbox"
        >
          {results.map((commune, index) => (
            <li key={commune.code_insee}>
              <button
                type="button"
                className={`w-full px-5 py-3 text-left flex justify-between items-center transition-colors ${
                  index === selectedIndex ? 'bg-amber-50' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(commune)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div>
                  <span className="font-medium text-gray-900">{commune.nom}</span>
                  {commune.code_postal && (
                    <span className="text-sm text-gray-500 ml-2">({commune.code_postal})</span>
                  )}
                  <span className="text-sm text-gray-400 ml-2">- {commune.departement_code}</span>
                </div>
                {commune.ensoleillement_annuel && (
                  <span className="text-amber-500 font-semibold text-sm shrink-0 ml-3">
                    {commune.ensoleillement_annuel.toLocaleString('fr-FR')} h/an
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-xl p-5 text-center text-gray-500">
          Aucune commune trouvée pour &laquo;&nbsp;{query}&nbsp;&raquo;
        </div>
      )}
    </div>
  );
}
