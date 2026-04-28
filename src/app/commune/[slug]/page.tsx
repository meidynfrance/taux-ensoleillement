import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import sql from '@/lib/db';
import Breadcrumb from '@/components/Breadcrumb';
import MonthlyChart from '@/components/MonthlyChart';
import CommuneCard from '@/components/CommuneCard';
import AdBanner from '@/components/AdBanner';
import type { CommuneWithDepartement, Commune } from '@/types';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCommune(slug: string): Promise<CommuneWithDepartement | null> {
  try {
    const rows = await sql`
      SELECT
        c.*,
        d.code  AS dept_code,
        d.nom   AS dept_nom,
        d.slug  AS dept_slug,
        d.region_code         AS dept_region_code,
        d.ensoleillement_moyen AS dept_ensoleillement_moyen,
        r.code  AS rg_code,
        r.nom   AS rg_nom,
        r.slug  AS rg_slug
      FROM communes c
      LEFT JOIN departements d ON c.departement_code = d.code
      LEFT JOIN regions r ON d.region_code = r.code
      WHERE c.slug = ${slug}
      LIMIT 1
    `;
    if (!rows.length) return null;
    const row = rows[0];

    const dept = row.dept_code ? {
      code:                 row.dept_code,
      nom:                  row.dept_nom,
      slug:                 row.dept_slug,
      region_code:          row.dept_region_code,
      ensoleillement_moyen: row.dept_ensoleillement_moyen,
      latitude:             null,
      longitude:            null,
      regions: row.rg_code ? {
        code:                 row.rg_code,
        nom:                  row.rg_nom,
        slug:                 row.rg_slug,
        ensoleillement_moyen: null,
      } : undefined,
    } : undefined;

    return {
      id:                          row.id,
      code_insee:                  row.code_insee,
      nom:                         row.nom,
      slug:                        row.slug,
      code_postal:                 row.code_postal,
      departement_code:            row.departement_code,
      population:                  row.population,
      latitude:                    row.latitude,
      longitude:                   row.longitude,
      ensoleillement_annuel:       row.ensoleillement_annuel,
      ensoleillement_janvier:      row.ensoleillement_janvier,
      ensoleillement_fevrier:      row.ensoleillement_fevrier,
      ensoleillement_mars:         row.ensoleillement_mars,
      ensoleillement_avril:        row.ensoleillement_avril,
      ensoleillement_mai:          row.ensoleillement_mai,
      ensoleillement_juin:         row.ensoleillement_juin,
      ensoleillement_juillet:      row.ensoleillement_juillet,
      ensoleillement_aout:         row.ensoleillement_aout,
      ensoleillement_septembre:    row.ensoleillement_septembre,
      ensoleillement_octobre:      row.ensoleillement_octobre,
      ensoleillement_novembre:     row.ensoleillement_novembre,
      ensoleillement_decembre:     row.ensoleillement_decembre,
      departements:                dept,
    } as CommuneWithDepartement;
  } catch {
    return null;
  }
}

async function getCommunesVoisines(deptCode: string, currentSlug: string): Promise<Commune[]> {
  try {
    return await sql<Commune[]>`
      SELECT code_insee, nom, slug, code_postal, departement_code, ensoleillement_annuel
      FROM communes
      WHERE departement_code = ${deptCode}
        AND slug != ${currentSlug}
        AND ensoleillement_annuel IS NOT NULL
      ORDER BY ensoleillement_annuel DESC
      LIMIT 8
    `;
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const commune = await getCommune(slug);

  if (!commune) {
    return { title: 'Commune non trouvée' };
  }

  const deptNom = commune.departements?.nom || '';
  const ensoleillement = commune.ensoleillement_annuel
    ? `${commune.ensoleillement_annuel.toLocaleString('fr-FR')} heures`
    : '';

  return {
    title: `Ensoleillement à ${commune.nom} (${deptNom}) - ${ensoleillement} de soleil par an`,
    description: `Découvrez le taux d'ensoleillement à ${commune.nom} (${deptNom}). ${ensoleillement ? `${ensoleillement} de soleil par an.` : ''} Données mensuelles, comparaison avec la moyenne nationale et départementale.`,
    alternates: {
      canonical: `https://taux-ensoleillement.fr/commune/${slug}`,
    },
    openGraph: {
      title: `Ensoleillement à ${commune.nom}`,
      description: `${ensoleillement ? `${ensoleillement} de soleil par an à ${commune.nom}.` : `Données d'ensoleillement pour ${commune.nom}.`} Consultez les données mensuelles détaillées.`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const rows = await sql<{ slug: string }[]>`
      SELECT slug FROM communes
      WHERE ensoleillement_annuel IS NOT NULL
      ORDER BY population DESC
      LIMIT 1000
    `;
    return rows.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export default async function CommunePage({ params }: PageProps) {
  const { slug } = await params;
  const commune = await getCommune(slug);

  if (!commune) {
    notFound();
  }

  const communesVoisines = await getCommunesVoisines(commune.departement_code, slug);

  const dept = commune.departements;
  const region = dept?.regions;
  const moyenneNationale = 1950;

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: commune.nom,
    description: `Données d'ensoleillement pour ${commune.nom}${dept ? `, ${dept.nom}` : ''}`,
    geo: commune.latitude && commune.longitude ? {
      '@type': 'GeoCoordinates',
      latitude: commune.latitude,
      longitude: commune.longitude,
    } : undefined,
    containedInPlace: dept ? {
      '@type': 'AdministrativeArea',
      name: dept.nom,
    } : undefined,
  };

  const comparaisonNationale = commune.ensoleillement_annuel
    ? commune.ensoleillement_annuel - moyenneNationale
    : null;

  const comparaisonDept = commune.ensoleillement_annuel && dept?.ensoleillement_moyen
    ? commune.ensoleillement_annuel - dept.ensoleillement_moyen
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: 'Accueil', href: '/' },
            ...(region ? [{ label: region.nom, href: `/region/${region.slug}` }] : []),
            ...(dept ? [{ label: dept.nom, href: `/departement/${dept.slug}` }] : []),
            { label: commune.nom },
          ]}
        />

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Taux d&apos;ensoleillement à {commune.nom}
            {dept && (
              <span className="text-gray-500 font-normal text-xl md:text-2xl block mt-1">
                {dept.nom}
                {commune.code_postal && ` - ${commune.code_postal}`}
              </span>
            )}
          </h1>

          {commune.ensoleillement_annuel !== null && (
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl px-6 py-4 shadow-sm">
                <p className="text-sm font-medium text-amber-100">Ensoleillement annuel</p>
                <p className="text-3xl font-extrabold">
                  {commune.ensoleillement_annuel.toLocaleString('fr-FR')} <span className="text-lg font-medium">h/an</span>
                </p>
              </div>

              {comparaisonNationale !== null && (
                <div className={`rounded-xl px-6 py-4 border ${comparaisonNationale >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-sm font-medium text-gray-600">vs. moyenne nationale</p>
                  <p className={`text-2xl font-bold ${comparaisonNationale >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparaisonNationale >= 0 ? '+' : ''}{comparaisonNationale.toLocaleString('fr-FR')} h
                  </p>
                </div>
              )}

              {comparaisonDept !== null && (
                <div className={`rounded-xl px-6 py-4 border ${comparaisonDept >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-sm font-medium text-gray-600">vs. moyenne {dept?.nom}</p>
                  <p className={`text-2xl font-bold ${comparaisonDept >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {comparaisonDept >= 0 ? '+' : ''}{comparaisonDept.toLocaleString('fr-FR')} h
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Monthly chart */}
        <div className="mb-12">
          <MonthlyChart commune={commune} />
        </div>

        {/* Pub 300×250 — après le graphique mensuel */}
        <div className="flex justify-center mb-12">
          <AdBanner size="300x250" />
        </div>

        {/* Info commune */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Informations sur {commune.nom}
            </h2>
            <dl className="space-y-3">
              {commune.code_postal && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Code postal</dt>
                  <dd className="font-semibold text-gray-900">{commune.code_postal}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-gray-600">Code INSEE</dt>
                <dd className="font-semibold text-gray-900">{commune.code_insee}</dd>
              </div>
              {dept && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Département</dt>
                  <dd>
                    <Link href={`/departement/${dept.slug}`} className="font-semibold text-amber-600 hover:text-amber-700">
                      {dept.nom} ({dept.code})
                    </Link>
                  </dd>
                </div>
              )}
              {region && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Région</dt>
                  <dd>
                    <Link href={`/region/${region.slug}`} className="font-semibold text-amber-600 hover:text-amber-700">
                      {region.nom}
                    </Link>
                  </dd>
                </div>
              )}
              {commune.population && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Population</dt>
                  <dd className="font-semibold text-gray-900">{commune.population.toLocaleString('fr-FR')} hab.</dd>
                </div>
              )}
              {commune.latitude && commune.longitude && (
                <div className="flex justify-between">
                  <dt className="text-gray-600">Coordonnées</dt>
                  <dd className="font-semibold text-gray-900 text-sm">
                    {commune.latitude.toFixed(4)}, {commune.longitude.toFixed(4)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              À propos de l&apos;ensoleillement à {commune.nom}
            </h2>
            <div className="text-gray-700 leading-relaxed space-y-3 text-sm">
              {commune.ensoleillement_annuel !== null ? (
                <>
                  <p>
                    La commune de {commune.nom} bénéficie de{' '}
                    <strong>{commune.ensoleillement_annuel.toLocaleString('fr-FR')} heures d&apos;ensoleillement par an</strong>, ce qui la place{' '}
                    {comparaisonNationale !== null && comparaisonNationale > 200
                      ? 'nettement au-dessus'
                      : comparaisonNationale !== null && comparaisonNationale > 0
                        ? 'au-dessus'
                        : comparaisonNationale !== null && comparaisonNationale > -200
                          ? 'légèrement en dessous'
                          : 'en dessous'}{' '}
                    de la moyenne nationale de {moyenneNationale.toLocaleString('fr-FR')} heures.
                  </p>
                  <p>
                    Les mois les plus ensoleillés à {commune.nom}{' '}sont généralement juin, juillet et août, tandis que les mois d&apos;hiver (décembre, janvier) sont les moins lumineux.
                  </p>
                  {dept?.ensoleillement_moyen && (
                    <p>
                      Par rapport à la moyenne du département {dept.nom} ({dept.ensoleillement_moyen.toLocaleString('fr-FR')} h/an),{' '}
                      {commune.nom}{' '}{comparaisonDept !== null && comparaisonDept >= 0 ? 'profite de davantage' : 'reçoit moins'}{' '}d&apos;heures de soleil.
                    </p>
                  )}
                </>
              ) : (
                <p>Les données d&apos;ensoleillement pour {commune.nom} ne sont pas encore disponibles. Elles seront ajoutées prochainement.</p>
              )}
            </div>
          </div>
        </div>

        {/* Pub 300×250 — avant les communes voisines */}
        <div className="flex justify-center mb-12">
          <AdBanner size="300x250" />
        </div>

        {/* Communes voisines */}
        {communesVoisines.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Autres communes dans le {dept?.nom || 'département'}
            </h2>
            <p className="text-gray-600 mb-6">
              Comparez l&apos;ensoleillement de {commune.nom} avec les autres communes du département.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {communesVoisines.map((c) => (
                <CommuneCard
                  key={c.code_insee}
                  nom={c.nom}
                  slug={c.slug}
                  ensoleillement={c.ensoleillement_annuel}
                  codePostal={c.code_postal}
                />
              ))}
            </div>
            {dept && (
              <div className="mt-6 text-center">
                <Link
                  href={`/departement/${dept.slug}`}
                  className="text-amber-600 hover:text-amber-700 font-semibold"
                >
                  Voir toutes les communes du {dept.nom} &rarr;
                </Link>
              </div>
            )}
          </section>
        )}
      </div>
    </>
  );
}
