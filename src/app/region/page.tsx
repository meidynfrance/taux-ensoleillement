import type { Metadata } from 'next';
import Link from 'next/link';
import sql from '@/lib/db';
import Breadcrumb from '@/components/Breadcrumb';
import type { Region } from '@/types';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Ensoleillement par région - Toutes les régions de France',
  description: "Comparez l'ensoleillement de toutes les régions de France. Classement par heures de soleil annuelles et accès aux données par département.",
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/region',
  },
};

async function getRegions(): Promise<Region[]> {
  try {
    return await sql<Region[]>`
      SELECT * FROM regions
      ORDER BY ensoleillement_moyen DESC NULLS LAST
    `;
  } catch {
    return [];
  }
}

export default async function RegionsPage() {
  const regions = await getRegions();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Régions' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
        Ensoleillement par région en France
      </h1>
      <p className="text-gray-600 mb-10 max-w-3xl text-lg">
        Comparez l&apos;ensoleillement moyen de toutes les régions françaises et accédez au détail par département.
      </p>

      {regions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {regions.map((region, index) => (
            <Link
              key={region.code}
              href={`/region/${region.slug}`}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg hover:border-amber-300 transition-all group"
            >
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full mb-3">
                #{index + 1}
              </span>
              <h2 className="text-lg font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2">
                {region.nom}
              </h2>
              {region.ensoleillement_moyen !== null ? (
                <p className="text-2xl font-bold text-amber-500">
                  {region.ensoleillement_moyen.toLocaleString('fr-FR')} <span className="text-sm text-gray-500 font-normal">h/an</span>
                </p>
              ) : (
                <p className="text-gray-400">Données en cours</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-amber-700">Les données des régions sont en cours de chargement.</p>
        </div>
      )}
    </div>
  );
}
