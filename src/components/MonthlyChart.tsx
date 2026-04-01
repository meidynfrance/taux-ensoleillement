'use client';

import { MOIS, MOIS_LABELS, type Commune } from '@/types';

interface MonthlyChartProps {
  commune: Commune;
}

export default function MonthlyChart({ commune }: MonthlyChartProps) {
  const data = MOIS.map((mois) => ({
    mois,
    label: MOIS_LABELS[mois],
    value: commune[`ensoleillement_${mois}` as keyof Commune] as number | null,
  }));

  const maxValue = Math.max(...data.map((d) => d.value ?? 0), 1);
  const chartHeight = 240;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        Ensoleillement mensuel à {commune.nom}
      </h2>

      {/* Bar chart */}
      <div className="flex items-end gap-2 sm:gap-3 mb-4" style={{ height: `${chartHeight}px` }}>
        {data.map((d) => {
          const barHeight = d.value !== null ? Math.max((d.value / maxValue) * chartHeight, 4) : 0;
          return (
            <div key={d.mois} className="flex-1 flex flex-col items-center justify-end h-full">
              <span className="text-xs font-semibold text-gray-700 mb-1">
                {d.value !== null ? d.value : '--'}
              </span>
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${barHeight}px`,
                  background: 'linear-gradient(to top, #F59E0B, #FBBF24)',
                }}
                title={`${d.label} : ${d.value ?? 'N/A'} heures`}
              />
              <span className="text-xs text-gray-500 mt-2 hidden sm:block">
                {d.label.slice(0, 3)}
              </span>
              <span className="text-xs text-gray-500 mt-2 sm:hidden">
                {d.label.charAt(0)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <details className="mt-6">
        <summary className="cursor-pointer text-sm font-medium text-amber-600 hover:text-amber-700">
          Voir le détail mensuel en tableau
        </summary>
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600 font-medium">Mois</th>
                <th className="text-right py-2 text-gray-600 font-medium">Heures d&apos;ensoleillement</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.mois} className="border-b border-gray-100">
                  <td className="py-2 text-gray-800">{d.label}</td>
                  <td className="py-2 text-right font-semibold text-gray-900">
                    {d.value !== null ? `${d.value} h` : '--'}
                  </td>
                </tr>
              ))}
              <tr className="border-t-2 border-gray-300">
                <td className="py-2 font-bold text-gray-900">Total annuel</td>
                <td className="py-2 text-right font-bold text-amber-600">
                  {commune.ensoleillement_annuel !== null
                    ? `${commune.ensoleillement_annuel.toLocaleString('fr-FR')} h`
                    : '--'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
