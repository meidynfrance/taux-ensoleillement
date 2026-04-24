'use client';

import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import type { Departement } from '@/types';
import Link from 'next/link';

import 'leaflet/dist/leaflet.css';

function getColor(ensoleillement: number | null): string {
  if (ensoleillement === null) return '#CBD5E1';
  if (ensoleillement >= 2600) return '#DC2626';
  if (ensoleillement >= 2300) return '#EA580C';
  if (ensoleillement >= 2100) return '#F59E0B';
  if (ensoleillement >= 1900) return '#FBBF24';
  if (ensoleillement >= 1700) return '#84CC16';
  if (ensoleillement >= 1500) return '#22D3EE';
  return '#60A5FA';
}

function getRadius(ensoleillement: number | null): number {
  if (ensoleillement === null) return 8;
  if (ensoleillement >= 2500) return 16;
  if (ensoleillement >= 2000) return 13;
  if (ensoleillement >= 1700) return 11;
  return 9;
}

interface Props {
  departements: Departement[];
}

export default function SunshineMap({ departements }: Props) {
  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={6}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {departements.map((dept) => (
          <CircleMarker
            key={dept.code}
            center={[dept.latitude!, dept.longitude!]}
            radius={getRadius(dept.ensoleillement_moyen)}
            pathOptions={{
              color: '#fff',
              weight: 2,
              fillColor: getColor(dept.ensoleillement_moyen),
              fillOpacity: 0.85,
            }}
          >
            <Popup>
              <div className="text-center p-1">
                <p className="font-bold text-gray-900">{dept.nom} ({dept.code})</p>
                <p className="text-amber-600 font-semibold">
                  {dept.ensoleillement_moyen
                    ? `${dept.ensoleillement_moyen.toLocaleString('fr-FR')} h/an`
                    : 'Données non disponibles'}
                </p>
                <Link href={`/departement/${dept.slug}`} className="text-blue-600 text-sm underline">
                  Voir le détail
                </Link>
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 py-3 px-4 bg-white border-t border-gray-200 text-xs">
        {[
          { color: '#60A5FA', label: '< 1 500 h' },
          { color: '#22D3EE', label: '1 500-1 700 h' },
          { color: '#84CC16', label: '1 700-1 900 h' },
          { color: '#FBBF24', label: '1 900-2 100 h' },
          { color: '#F59E0B', label: '2 100-2 300 h' },
          { color: '#EA580C', label: '2 300-2 600 h' },
          { color: '#DC2626', label: '> 2 600 h' },
        ].map((item) => (
          <span key={item.label} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
