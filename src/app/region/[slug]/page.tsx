import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Breadcrumb from '@/components/Breadcrumb';
import type { Region, Departement } from '@/types';

export const revalidate = 86400;

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRegion(slug: string): Promise<Region | null> {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data as Region;
  } catch {
    return null;
  }
}

async function getDepartements(regionCode: string): Promise<Departement[]> {
  try {
    const { data, error } = await supabase
      .from('departements')
      .select('*')
      .eq('region_code', regionCode)
      .order('ensoleillement_moyen', { ascending: false, nullsFirst: false });

    if (error) throw error;
    return (data as Departement[]) || [];
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegion(slug);

  if (!region) {
    return { title: 'Région non trouvée' };
  }

  return {
    title: `Ensoleillement en ${region.nom} - Classement des départements`,
    description: `Découvrez l'ensoleillement en ${region.nom}. ${region.ensoleillement_moyen ? `${region.ensoleillement_moyen.toLocaleString('fr-FR')} heures de soleil par an en moyenne.` : ''} Classement des départements de la région par heures d'ensoleillement.`,
    alternates: {
      canonical: `https://taux-ensoleillement.fr/region/${slug}`,
    },
  };
}

export async function generateStaticParams() {
  try {
    const { data, error } = await supabase
      .from('regions')
      .select('slug');

    if (error) return [];
    return (data || []).map((r) => ({ slug: r.slug }));
  } catch {
    return [];
  }
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const region = await getRegion(slug);

  if (!region) {
    notFound();
  }

  const departements = await getDepartements(region.code);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AdministrativeArea',
    name: region.nom,
    description: `Données d'ensoleillement de la région ${region.nom}`,
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
            { label: 'Régions', href: '/region' },
            { label: region.nom },
          ]}
        />

        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
          Ensoleillement en {region.nom}
        </h1>

        {/* Stats */}
        <div className="flex flex-wrap gap-4 mt-6 mb-10">
          {region.ensoleillement_moyen !== null && (
            <div className="bg-gradient-to-br from-amber-400 to-amber-500 text-white rounded-xl px-6 py-4 shadow-sm">
              <p className="text-sm font-medium text-amber-100">Ensoleillement moyen</p>
              <p className="text-3xl font-extrabold">
                {region.ensoleillement_moyen.toLocaleString('fr-FR')} <span className="text-lg font-medium">h/an</span>
              </p>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded-xl px-6 py-4">
            <p className="text-sm font-medium text-gray-500">Départements</p>
            <p className="text-3xl font-extrabold text-gray-900">{departements.length}</p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            L&apos;ensoleillement en {region.nom}
          </h2>
          <p className="text-gray-700 leading-relaxed">
            La région {region.nom} {region.ensoleillement_moyen
              ? `bénéficie en moyenne de ${region.ensoleillement_moyen.toLocaleString('fr-FR')} heures d'ensoleillement par an`
              : 'dispose de données d\'ensoleillement en cours de collecte'}.
            {departements.length > 0 && (
              <> Elle regroupe {departements.length} départements aux profils d&apos;ensoleillement variés. Retrouvez ci-dessous le classement complet.</>
            )}
          </p>
        </div>

        {/* Départements */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Départements de {region.nom} par ensoleillement
        </h2>

        {departements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departements.map((dept, index) => (
              <Link
                key={dept.code}
                href={`/departement/${dept.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg hover:border-amber-300 transition-all group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full mb-2">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                      {dept.nom}
                    </h3>
                    <p className="text-sm text-gray-500">Département {dept.code}</p>
                  </div>
                  <div className="text-right shrink-0">
                    {dept.ensoleillement_moyen !== null ? (
                      <>
                        <p className="text-2xl font-bold text-amber-500">
                          {dept.ensoleillement_moyen.toLocaleString('fr-FR')}
                        </p>
                        <p className="text-xs text-gray-500">h/an</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">--</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
            <p className="text-amber-700">Les données des départements de cette région sont en cours de chargement.</p>
          </div>
        )}
      </div>
    </>
  );
}
