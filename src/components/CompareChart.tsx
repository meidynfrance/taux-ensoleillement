'use client';

import { MOIS, MOIS_LABELS, type Commune } from '@/types';

interface CompareChartProps {
  communeA: Commune;
  communeB: Commune;
}

export default function CompareChart({ communeA, communeB }: CompareChartProps) {
  const data = MOIS.map((mois) => ({
    mois,
    label: MOIS_LABELS[mois],
    valueA: communeA[`ensoleillement_${mois}` as keyof Commune] as number | null,
    valueB: communeB[`ensoleillement_${mois}` as keyof Commune] as number | null,
  }));

  const allValues = data.flatMap((d) => [d.valueA ?? 0, d.valueB ?? 0]);
  const maxValue = Math.max(...allValues, 1);
  const chartHeight = 220;

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4">Comparaison mensuelle</h3>

      {/* Legend */}
      <div className="flex items-center gap-6 mb-4 text-sm">
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-t from-amber-500 to-amber-400" />
          <span className="text-gray-700 font-medium">{communeA.nom}</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-sm bg-gradient-to-t from-sky-500 to-sky-400" />
          <span className="text-gray-700 font-medium">{communeB.nom}</span>
        </span>
      </div>

      {/* Dual bar chart */}
      <div className="flex items-end gap-1 sm:gap-2" style={{ height: `${chartHeight}px` }}>
        {data.map((d) => {
          const heightA = d.valueA !== null ? Math.max((d.valueA / maxValue) * chartHeight, 3) : 0;
          const heightB = d.valueB !== null ? Math.max((d.valueB / maxValue) * chartHeight, 3) : 0;

          return (
            <div key={d.mois} className="flex-1 flex flex-col items-center justify-end h-full">
              {/* Values */}
              <div className="flex gap-0.5 mb-1 text-center">
                <span className="text-[10px] font-semibold text-amber-600 leading-none">
                  {d.valueA ?? '--'}
                </span>
                <span className="text-[10px] text-gray-300 leading-none">/</span>
                <span className="text-[10px] font-semibold text-sky-600 leading-none">
                  {d.valueB ?? '--'}
                </span>
              </div>
              {/* Bars */}
              <div className="flex gap-0.5 w-full items-end">
                <div
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${heightA}px`,
                    background: 'linear-gradient(to top, #F59E0B, #FBBF24)',
                  }}
                  title={`${communeA.nom} - ${d.label} : ${d.valueA ?? 'N/A'} h`}
                />
                <div
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${heightB}px`,
                    background: 'linear-gradient(to top, #0EA5E9, #38BDF8)',
                  }}
                  title={`${communeB.nom} - ${d.label} : ${d.valueB ?? 'N/A'} h`}
                />
              </div>
              {/* Month label */}
              <span className="text-[10px] text-gray-500 mt-1 hidden sm:block">
                {d.label.slice(0, 3)}
              </span>
              <span className="text-[10px] text-gray-500 mt-1 sm:hidden">
                {d.label.charAt(0)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
