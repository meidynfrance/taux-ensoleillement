'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import type { Departement } from '@/types';
import { useRouter } from 'next/navigation';
import type { Feature, FeatureCollection, Geometry } from 'geojson';
import type { Layer, Path, PathOptions } from 'leaflet';

import 'leaflet/dist/leaflet.css';

interface DeptProperties {
  code: string;
  nom: string;
}

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

function lightenColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const lighten = (c: number) => Math.min(255, c + 40);
  return `#${lighten(r).toString(16).padStart(2, '0')}${lighten(g).toString(16).padStart(2, '0')}${lighten(b).toString(16).padStart(2, '0')}`;
}

interface Props {
  departements: Departement[];
}

export default function SunshineMap({ departements }: Props) {
  const [geojson, setGeojson] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const deptMapRef = useRef<Map<string, Departement>>(new Map());

  useEffect(() => {
    // Build lookup map from props (server-fetched, no client DB call needed)
    const map = new Map<string, Departement>();
    departements.forEach((d) => map.set(d.code, d));
    deptMapRef.current = map;

    // Only fetch the GeoJSON boundaries (static public file)
    fetch('/data/departements.geojson')
      .then((r) => r.json())
      .then((geo) => setGeojson(geo as FeatureCollection))
      .catch(() => setGeojson(null))
      .finally(() => setLoading(false));
  }, [departements]);

  const style = useCallback(
    (feature: Feature<Geometry, DeptProperties> | undefined): PathOptions => {
      if (!feature) return {};
      const code = feature.properties?.code;
      const dept = code ? deptMapRef.current.get(code) : undefined;
      const ensoleillement = dept?.ensoleillement_moyen ?? null;
      return {
        fillColor: getColor(ensoleillement),
        fillOpacity: 0.8,
        color: '#ffffff',
        weight: 1,
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departements],
  );

  const onEachFeature = useCallback(
    (feature: Feature<Geometry, DeptProperties>, layer: Layer) => {
      const code = feature.properties?.code;
      const dept = code ? deptMapRef.current.get(code) : undefined;
      const nom = dept?.nom ?? feature.properties?.nom ?? '';
      const ensoleillement = dept?.ensoleillement_moyen;

      const tooltipContent = `
        <div style="text-align:center;font-family:system-ui,sans-serif;">
          <strong>${nom}</strong> (${code})<br/>
          <span style="color:#d97706;font-weight:600;">
            ${ensoleillement != null ? `${ensoleillement.toLocaleString('fr-FR')} h/an` : 'Données non disponibles'}
          </span>
        </div>
      `;
      (layer as Path).bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'top',
        className: 'dept-tooltip',
      });

      layer.on({
        mouseover: (e) => {
          const target = e.target;
          const currentColor = getColor(dept?.ensoleillement_moyen ?? null);
          target.setStyle({
            weight: 3,
            color: '#374151',
            fillColor: lightenColor(currentColor),
            fillOpacity: 0.9,
          });
          target.bringToFront();
        },
        mouseout: (e) => {
          const target = e.target;
          target.setStyle({
            weight: 1,
            color: '#ffffff',
            fillColor: getColor(dept?.ensoleillement_moyen ?? null),
            fillOpacity: 0.8,
          });
        },
        click: () => {
          if (dept?.slug) {
            router.push(`/departement/${dept.slug}`);
          }
        },
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [departements, router],
  );

  if (loading) {
    return (
      <div className="w-full h-[500px] bg-gray-100 rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="h-10 w-10 border-4 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500">Chargement de la carte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      <MapContainer
        center={[46.603354, 1.888334]}
        zoom={6}
        className="h-full w-full"
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {geojson && (
          <GeoJSON
            key={departements.length}
            data={geojson}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
      </MapContainer>

      {/* Légende */}
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
