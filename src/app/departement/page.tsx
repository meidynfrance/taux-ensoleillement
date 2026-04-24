import type { Metadata } from 'next';
import Link from 'next/link';
import sql from '@/lib/db';
import Breadcrumb from '@/components/Breadcrumb';
import type { Departement } from '@/types';

export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Ensoleillement par département - Tous les départements de France',
  description: "Classement de tous les départements français par heures d'ensoleillement. Comparez l'ensoleillement moyen et accédez aux données par commune.",
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/departement',
  },
};

async function getDepartements(): Promise<Departement[]> {
  try {
    return await sql<Departement[]>`
      SELECT * FROM departements
      ORDER BY ensoleillement_moyen DESC NULLS LAST
    `;
  } catch {
    return [];
  }
}

export default async function DepartementsPage() {
  const departements = await getDepartements();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Départements' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
        Ensoleillement par département en France
      </h1>
      <p className="text-gray-600 mb-10 max-w-3xl text-lg">
        Classement complet des {departements.length > 0 ? departements.length : '101'} départements
        français par nombre d&apos;heures d&apos;ensoleillement annuel.
      </p>

      {departements.length > 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="py-3 px-4 text-gray-600 font-semibold text-sm">#</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold text-sm">Département</th>
                  <th className="py-3 px-4 text-gray-600 font-semibold text-sm">Code</th>
                  <th className="py-3 px-4 text-right text-gray-600 font-semibold text-sm">Ensoleillement moyen</th>
                </tr>
              </thead>
              <tbody>
                {departements.map((dept, index) => (
                  <tr key={dept.code} className="border-b border-gray-100 hover:bg-amber-50 transition-colors">
                    <td className="py-3 px-4 text-gray-500 text-sm font-bold">{index + 1}</td>
                    <td className="py-3 px-4">
                      <Link href={`/departement/${dept.slug}`} className="text-gray-900 font-medium hover:text-amber-600 transition-colors">
                        {dept.nom}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-gray-500 text-sm">{dept.code}</td>
                    <td className="py-3 px-4 text-right font-semibold">
                      {dept.ensoleillement_moyen !== null ? (
                        <span className="text-amber-600">{dept.ensoleillement_moyen.toLocaleString('fr-FR')} h/an</span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
          <p className="text-amber-700">Les données des départements sont en cours de chargement.</p>
        </div>
      )}
    </div>
  );
}
