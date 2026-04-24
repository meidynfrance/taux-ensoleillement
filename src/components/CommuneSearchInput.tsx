'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { Commune } from '@/types';

interface CommuneSearchInputProps {
  label: string;
  selectedCommune: Commune | null;
  onSelect: (commune: Commune) => void;
  onClear: () => void;
  placeholder?: string;
  accentColor?: 'amber' | 'sky';
}

export default function CommuneSearchInput({
  label,
  selectedCommune,
  onSelect,
  onClear,
  placeholder = 'Rechercher une commune...',
  accentColor = 'amber',
}: CommuneSearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Commune[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchCommunes = useCallback(async (search: string) => {
    if (search.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(search)}`);
      if (!res.ok) throw new Error('Search failed');
      const data: Commune[] = await res.json();
      setResults(data);
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
    onSelect(commune);
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

  const focusClasses = accentColor === 'sky'
    ? 'focus:border-sky-400 focus:ring-sky-100'
    : 'focus:border-amber-400 focus:ring-amber-100';

  const chipBg = accentColor === 'sky' ? 'bg-sky-50 border-sky-200' : 'bg-amber-50 border-amber-200';
  const chipText = accentColor === 'sky' ? 'text-sky-700' : 'text-amber-700';
  const chipHours = accentColor === 'sky' ? 'text-sky-500' : 'text-amber-500';
  const hoverBg = accentColor === 'sky' ? 'bg-sky-50' : 'bg-amber-50';

  if (selectedCommune) {
    return (
      <div>
        <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
        <div className={`flex items-center justify-between gap-3 px-4 py-3 border rounded-xl ${chipBg}`}>
          <div className="min-w-0">
            <span className={`font-semibold ${chipText}`}>{selectedCommune.nom}</span>
            {selectedCommune.code_postal && (
              <span className="text-gray-500 text-sm ml-2">({selectedCommune.code_postal})</span>
            )}
            {selectedCommune.ensoleillement_annuel && (
              <span className={`text-sm font-semibold ml-3 ${chipHours}`}>
                {selectedCommune.ensoleillement_annuel.toLocaleString('fr-FR')} h/an
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 p-1 rounded-full hover:bg-white/60 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Changer de commune"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>
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
          placeholder={placeholder}
          className={`w-full px-4 py-3 pl-10 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 transition-all text-sm ${focusClasses}`}
          aria-label={label}
          aria-expanded={isOpen}
          role="combobox"
          aria-autocomplete="list"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className={`h-4 w-4 border-2 ${accentColor === 'sky' ? 'border-sky-400' : 'border-amber-400'} border-t-transparent rounded-full animate-spin`} />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden" role="listbox">
          {results.map((commune, index) => (
            <li key={commune.code_insee}>
              <button
                type="button"
                className={`w-full px-4 py-2.5 text-left flex justify-between items-center transition-colors text-sm ${
                  index === selectedIndex ? hoverBg : 'hover:bg-gray-50'
                }`}
                onClick={() => handleSelect(commune)}
                role="option"
                aria-selected={index === selectedIndex}
              >
                <div>
                  <span className="font-medium text-gray-900">{commune.nom}</span>
                  {commune.code_postal && (
                    <span className="text-gray-500 text-xs ml-1.5">({commune.code_postal})</span>
                  )}
                </div>
                {commune.ensoleillement_annuel && (
                  <span className={`font-semibold text-xs shrink-0 ml-2 ${chipHours}`}>
                    {commune.ensoleillement_annuel.toLocaleString('fr-FR')} h
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !loading && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-4 text-center text-gray-500 text-sm">
          Aucune commune trouvée pour &laquo;&nbsp;{query}&nbsp;&raquo;
        </div>
      )}
    </div>
  );
}
