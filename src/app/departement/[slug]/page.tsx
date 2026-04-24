import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import sql from '@/lib/db';
import Breadcrumb from '@/components/Breadcrumb';
import type { DepartementWithRegion, Commune } from '@/types';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getDepartement(slug: string): Promise<DepartementWithRegion | null> {
  try {
    const rows = await sql`
      SELECT
        d.id, d.code, d.nom, d.slug, d.region_code, d.ensoleillement_moyen,
        d.latitude, d.longitude, d.description,
        r.code  AS rg_code,
        r.nom   AS rg_nom,
        r.slug  AS rg_slug
      FROM departements d
      LEFT JOIN regions r ON d.region_code = r.code
      WHERE d.slug = ${slug}
      LIMIT 1
    `;
    if (!rows.length) return null;
    const row = rows[0];
    return {
      id:                  row.id,
      code:                row.code,
      nom:                 row.nom,
      slug:                row.slug,
      region_code:         row.region_code,
      ensoleillement_moyen: row.ensoleillement_moyen,
      latitude:            row.latitude,
      longitude:           row.longitude,
      description:         row.description,
      regions: row.rg_code
        ? { code: row.rg_code, nom: row.rg_nom, slug: row.rg_slug, ensoleillement_moyen: null }
        : undefined,
    } as DepartementWithRegion;
  } catch {
    return null;
  }
}

async function getCommunes(deptCode: string): Promise<Commune[]> {
  try {
    return await sql<Commune[]>`
      SELECT code_insee, nom, slug, code_postal, departement_code, population, ensoleillement_annuel
      FROM communes
      WHERE departement_code = ${deptCode}
      ORDER BY ensoleillement_annuel DESC NULLS LAST
    `;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dept = await getDepartement(slug);

  if (!dept) {
    return { title: 'Département non trouvé' };
  }

  return {
    title: `Ensoleillement dans le ${dept.nom} (${dept.code}) - Classement des communes`,
    description: `Découvrez l'ensoleillement dans le ${dept.nom} (${dept.code}). ${dept.ensoleillement_moyen ? `${dept.ensoleillement_moyen.toLocaleString('fr-FR')} heures de soleil par an en moyenne.` : ''} Classement de toutes les communes par heures de soleil.`,
    alternates: {
      canonical: `https://taux-ensoleillement.fr/departement/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const rows = await sql<{ slug: string }[]>`SELECT slug FROM departements`;
    return rows.map((d) => ({ slug: d.slug }));
  } catch {
    return [];
  }
}

export default async function DepartementPage({ params }: PageProps) {
  const { slug } = await params;
  const dept = await getDepartement(slug);

  if (!dept) {
    notFound();
  }

  const communes = await getCommunes(dept.code);
  const region = dept.regions;

  const communesAvecDonnees = communes.filter((c) => c.ensoleillement_annuel !== null);
  const maxEnsoleillement = communesAvecDonnees.length > 0
    ? Math.max(...communesAvecDonnees.map((c) => c.ensoleillement_annuel!))
    : null;
  const minEnsoleillement = communesAvecDonnees.length > 0
    ? Math.min(...communesAvecDonnees.map((c) => c.ensoleillement_annuel!))
    : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: `${dept.nom} (${dept.code})`,
    description: `Données d'ensoleillement du département ${dept.nom}`,
    containedInPlace: region ? {
      '@type': 'AdministrativeArea',
      name: region.nom,
    } : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            ...(region ? [{ label: region.nom, href: `/region/${region.slug}` }] : []),
            { label: `${dept.nom} (${dept.code})` },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Ensoleillement dans le {dept.nom}
          <span className="text-gray-500 font-normal text-xl md:text-2xl block mt-1">
            Département {dept.code}
            {region && <> &mdash; {region.nom}</>}
          </span>
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-6 mb-10">
          {dept.ensoleillement_moyen !== null && (
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl px-6 py-4 shadow-sm">
              <p className="text-sm font-medium text-amber-100">Ensoleillement moyen</p>
              <p className="text-3xl font-extrabold">
                {dept.ensoleillement_moyen.toLocaleString('fr-FR')} <span className="text-lg font-medium">h/an</span>
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl px-6 py-4">
            <p className="text-sm font-medium text-gray-500">Communes</p>
            <p className="text-3xl font-extrabold text-gray-900">{communes.length.toLocaleString('fr-FR')}</p>
          </div>

          {maxEnsoleillement !== null && (
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-4">
              <p className="text-sm font-medium text-gray-500">Maximum</p>
              <p className="text-3xl font-extrabold text-green-600">{maxEnsoleillement.toLocaleString('fr-FR')} <span className="text-lg font-medium text-gray-500">h</span></p>
            </div>
          )}

          {minEnsoleillement !== null && (
            <div className="bg-white border border-gray-200 rounded-xl px-6 py-4">
              <p className="text-sm font-medium text-gray-500">Minimum</p>
              <p className="text-3xl font-extrabold text-blue-600">{minEnsoleillement.toLocaleString('fr-FR')} <span className="text-lg font-medium text-gray-500">h</span></p>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            L&apos;ensoleillement dans le {dept.nom}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            Le département du {dept.nom} ({dept.code}) {dept.ensoleillement_moyen
              ? `bénéficie en moyenne de ${dept.ensoleillement_moyen.toLocaleString('fr-FR')} heures d'ensoleillement par an`
              : 'dispose de données d\'ensoleillement en cours de collecte'}.
            {region && (
              <> Il fait partie de la région <Link href={`/region/${region.slug}`} className="text-amber-600 hover:text-amber-700 font-medium">{region.nom}</Link>.</>
            )}
            {communes.length > 0 && (
              <> Retrouvez ci-dessous le classement des {communes.length.toLocaleString('fr-FR')} communes du département classées par heures d&apos;ensoleillement annuel.</>
            )}
          </p>
        </div>

        {/* Communes table */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Toutes les communes du {dept.nom} par ensoleillement
        </h2>

        {communes.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm">#</th>
                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm">Commune</th>
                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm">Code postal</th>
                    <th className="py-3 px-4 text-gray-600 font-semibold text-sm hidden sm:table-cell">Population</th>
                    <th className="py-3 px-4 text-right text-gray-600 font-semibold text-sm">Ensoleillement</th>
                  </tr>
                </thead>
                <tbody>
                  {communes.map((commune, index) => (
                    <tr key={commune.code_insee} className="border-b border-gray-100 hover:bg-amber-50 transition-colors">
                      <td className="py-3 px-4 text-gray-500 text-sm">{index + 1}</td>
                      <td className="py-3 px-4">
                        <Link href={`/commune/${commune.slug}`} className="text-gray-900 font-medium hover:text-amber-600 transition-colors">
                          {commune.nom}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">{commune.code_postal || '--'}</td>
                      <td className="py-3 px-4 text-gray-500 text-sm hidden sm:table-cell">
                        {commune.population ? commune.population.toLocaleString('fr-FR') : '--'}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {commune.ensoleillement_annuel !== null ? (
                          <span className="text-amber-600">{commune.ensoleillement_annuel.toLocaleString('fr-FR')} h</span>
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
            <p className="text-amber-700">Les données des communes de ce département sont en cours de chargement.</p>
          </div>
        )}
      </div>
    </>
  );
}
