'use client';

import { useState } from 'react';
import Link from 'next/link';
import CommuneSearchInput from './CommuneSearchInput';
import CompareChart from './CompareChart';
import { MOIS, MOIS_LABELS, MOYENNE_NATIONALE, type Commune } from '@/types';

export default function CompareCommunes() {
  const [communeA, setCommuneA] = useState<Commune | null>(null);
  const [communeB, setCommuneB] = useState<Commune | null>(null);
  const [sameError, setSameError] = useState(false);

  const handleSelectA = (commune: Commune) => {
    if (communeB && commune.code_insee === communeB.code_insee) {
      setSameError(true);
      setTimeout(() => setSameError(false), 3000);
      return;
    }
    setSameError(false);
    setCommuneA(commune);
  };

  const handleSelectB = (commune: Commune) => {
    if (communeA && commune.code_insee === communeA.code_insee) {
      setSameError(true);
      setTimeout(() => setSameError(false), 3000);
      return;
    }
    setSameError(false);
    setCommuneB(commune);
  };

  const bothSelected = communeA && communeB;

  const diffAnnuel = bothSelected && communeA.ensoleillement_annuel !== null && communeB.ensoleillement_annuel !== null
    ? communeA.ensoleillement_annuel - communeB.ensoleillement_annuel
    : null;

  const diffNatA = communeA?.ensoleillement_annuel !== null && communeA?.ensoleillement_annuel !== undefined
    ? communeA.ensoleillement_annuel - MOYENNE_NATIONALE
    : null;

  const diffNatB = communeB?.ensoleillement_annuel !== null && communeB?.ensoleillement_annuel !== undefined
    ? communeB.ensoleillement_annuel - MOYENNE_NATIONALE
    : null;

  return (
    <section id="comparer" className="bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Comparer deux communes
        </h2>
        <p className="text-gray-600 mb-8 max-w-2xl">
          Sélectionnez deux communes pour comparer leur ensoleillement sur tous les critères :
          heures de soleil annuelles, données mensuelles, population et plus encore.
        </p>

        {/* Search inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
          <CommuneSearchInput
            label="Commune 1"
            selectedCommune={communeA}
            onSelect={handleSelectA}
            onClear={() => setCommuneA(null)}
            placeholder="Ex : Paris, Lyon, Nice..."
            accentColor="amber"
          />
          <CommuneSearchInput
            label="Commune 2"
            selectedCommune={communeB}
            onSelect={handleSelectB}
            onClear={() => setCommuneB(null)}
            placeholder="Ex : Marseille, Bordeaux, Toulouse..."
            accentColor="sky"
          />
        </div>

        {sameError && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
            Veuillez choisir deux communes différentes.
          </div>
        )}

        {/* Comparison results */}
        {bothSelected && (
          <div className="space-y-8 mt-8">
            {/* Annual comparison cards */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              {/* Commune A */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-5 text-center">
                <Link href={`/commune/${communeA.slug}`} className="text-lg font-bold text-amber-800 hover:text-amber-900 transition-colors">
                  {communeA.nom}
                </Link>
                {communeA.code_postal && (
                  <p className="text-amber-600 text-sm">{communeA.code_postal} - Dép. {communeA.departement_code}</p>
                )}
                <p className="text-3xl md:text-4xl font-extrabold text-amber-600 mt-2">
                  {communeA.ensoleillement_annuel !== null
                    ? communeA.ensoleillement_annuel.toLocaleString('fr-FR')
                    : '--'}
                </p>
                <p className="text-amber-500 text-sm font-medium">heures/an</p>
              </div>

              {/* VS badge */}
              <div className="flex flex-col items-center gap-1 py-2">
                <span className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">VS</span>
                {diffAnnuel !== null && (
                  <span className={`text-sm font-bold ${diffAnnuel > 0 ? 'text-amber-600' : diffAnnuel < 0 ? 'text-sky-600' : 'text-gray-500'}`}>
                    {diffAnnuel > 0 ? `+${diffAnnuel.toLocaleString('fr-FR')}` : diffAnnuel.toLocaleString('fr-FR')} h
                  </span>
                )}
              </div>

              {/* Commune B */}
              <div className="bg-gradient-to-br from-sky-50 to-sky-100 border border-sky-200 rounded-xl p-5 text-center">
                <Link href={`/commune/${communeB.slug}`} className="text-lg font-bold text-sky-800 hover:text-sky-900 transition-colors">
                  {communeB.nom}
                </Link>
                {communeB.code_postal && (
                  <p className="text-sky-600 text-sm">{communeB.code_postal} - Dép. {communeB.departement_code}</p>
                )}
                <p className="text-3xl md:text-4xl font-extrabold text-sky-600 mt-2">
                  {communeB.ensoleillement_annuel !== null
                    ? communeB.ensoleillement_annuel.toLocaleString('fr-FR')
                    : '--'}
                </p>
                <p className="text-sky-500 text-sm font-medium">heures/an</p>
              </div>
            </div>

            {/* Vs national average */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`rounded-xl px-5 py-4 border ${diffNatA !== null && diffNatA >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-600 font-medium">{communeA.nom} vs. moyenne nationale ({MOYENNE_NATIONALE.toLocaleString('fr-FR')} h)</p>
                <p className={`text-xl font-bold ${diffNatA !== null && diffNatA >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {diffNatA !== null ? `${diffNatA >= 0 ? '+' : ''}${diffNatA.toLocaleString('fr-FR')} h` : '--'}
                </p>
              </div>
              <div className={`rounded-xl px-5 py-4 border ${diffNatB !== null && diffNatB >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm text-gray-600 font-medium">{communeB.nom} vs. moyenne nationale ({MOYENNE_NATIONALE.toLocaleString('fr-FR')} h)</p>
                <p className={`text-xl font-bold ${diffNatB !== null && diffNatB >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {diffNatB !== null ? `${diffNatB >= 0 ? '+' : ''}${diffNatB.toLocaleString('fr-FR')} h` : '--'}
                </p>
              </div>
            </div>

            {/* Monthly chart */}
            <div className="bg-gray-50 rounded-xl border border-gray-200 p-5">
              <CompareChart communeA={communeA} communeB={communeB} />
            </div>

            {/* Detail table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-3 text-gray-600 font-semibold">Critère</th>
                    <th className="text-right py-3 px-3 text-amber-600 font-semibold">{communeA.nom}</th>
                    <th className="text-right py-3 px-3 text-sky-600 font-semibold">{communeB.nom}</th>
                    <th className="text-right py-3 px-3 text-gray-500 font-semibold">Différence</th>
                  </tr>
                </thead>
                <tbody>
                  <CompareRow
                    label="Ensoleillement annuel"
                    valueA={communeA.ensoleillement_annuel}
                    valueB={communeB.ensoleillement_annuel}
                    suffix=" h"
                    bold
                  />
                  <CompareRow
                    label="Population"
                    valueA={communeA.population}
                    valueB={communeB.population}
                    suffix=" hab."
                  />
                  {MOIS.map((mois) => (
                    <CompareRow
                      key={mois}
                      label={MOIS_LABELS[mois]}
                      valueA={communeA[`ensoleillement_${mois}` as keyof Commune] as number | null}
                      valueB={communeB[`ensoleillement_${mois}` as keyof Commune] as number | null}
                      suffix=" h"
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!bothSelected && (communeA || communeB) && (
          <div className="mt-6 bg-gray-50 border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            <p>Sélectionnez une deuxième commune pour lancer la comparaison.</p>
          </div>
        )}
      </div>
    </section>
  );
}

function CompareRow({
  label,
  valueA,
  valueB,
  suffix = '',
  bold = false,
}: {
  label: string;
  valueA: number | null;
  valueB: number | null;
  suffix?: string;
  bold?: boolean;
}) {
  const diff = valueA !== null && valueB !== null ? valueA - valueB : null;
  const aWins = diff !== null && diff > 0;
  const bWins = diff !== null && diff < 0;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className={`py-2.5 px-3 text-gray-700 ${bold ? 'font-bold' : ''}`}>{label}</td>
      <td className={`py-2.5 px-3 text-right ${bold ? 'font-bold' : 'font-semibold'} ${aWins ? 'text-amber-600' : 'text-gray-900'}`}>
        {valueA !== null ? `${valueA.toLocaleString('fr-FR')}${suffix}` : '--'}
      </td>
      <td className={`py-2.5 px-3 text-right ${bold ? 'font-bold' : 'font-semibold'} ${bWins ? 'text-sky-600' : 'text-gray-900'}`}>
        {valueB !== null ? `${valueB.toLocaleString('fr-FR')}${suffix}` : '--'}
      </td>
      <td className={`py-2.5 px-3 text-right text-sm ${diff !== null && diff > 0 ? 'text-amber-600' : diff !== null && diff < 0 ? 'text-sky-600' : 'text-gray-400'}`}>
        {diff !== null ? `${diff > 0 ? '+' : ''}${diff.toLocaleString('fr-FR')}${suffix}` : '--'}
      </td>
    </tr>
  );
}
