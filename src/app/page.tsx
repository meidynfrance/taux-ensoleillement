import Link from 'next/link';
import sql from '@/lib/db';
import SearchBar from '@/components/SearchBar';
import CommuneCard from '@/components/CommuneCard';
import SunshineMapLoader from '@/components/SunshineMapLoader';
import CompareCommunes from '@/components/CompareCommunes';
import type { Commune, Departement } from '@/types';

export const revalidate = 86400;

async function getTopCommunes(): Promise<Commune[]> {
  try {
    const rows = await sql<Commune[]>`
      SELECT * FROM communes
      WHERE ensoleillement_annuel IS NOT NULL
      ORDER BY ensoleillement_annuel DESC
      LIMIT 12
    `;
    return rows;
  } catch {
    return [];
  }
}

async function getTopDepartements(): Promise<Departement[]> {
  try {
    const rows = await sql<Departement[]>`
      SELECT * FROM departements
      WHERE ensoleillement_moyen IS NOT NULL
      ORDER BY ensoleillement_moyen DESC
      LIMIT 10
    `;
    return rows;
  } catch {
    return [];
  }
}

async function getDepartementsForMap(): Promise<Departement[]> {
  try {
    const rows = await sql<Departement[]>`
      SELECT code, nom, slug, ensoleillement_moyen, latitude, longitude
      FROM departements
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    `;
    return rows;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [topCommunes, topDepartements, departementsMap] = await Promise.all([
    getTopCommunes(),
    getTopDepartements(),
    getDepartementsForMap(),
  ]);

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-amber-400 via-amber-500 to-orange-500 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZoLTJ2LTRoMnY0em0tNiA2aC0ydi00aDJ2NHptMC02aC0ydi00aDJ2NHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative">
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-6 max-w-4xl">
            Taux d&apos;ensoleillement en France
            <span className="block text-amber-100 text-xl md:text-2xl font-medium mt-3">
              Carte et données par commune, département et région
            </span>
          </h1>
          <p className="text-lg md:text-xl text-amber-50 max-w-2xl mb-10 leading-relaxed">
            Comparez les heures de soleil de plus de 36 000 communes. Trouvez les villes
            les plus ensoleillées de France et consultez les données mensuelles détaillées.
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Map Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          Carte de l&apos;ensoleillement en France par département
        </h2>
        <p className="text-gray-600 mb-8 max-w-3xl">
          Cette carte interactive affiche les heures d&apos;ensoleillement annuelles moyennes pour chaque
          département français. Cliquez sur un département pour voir le détail.
        </p>
        <SunshineMapLoader departements={departementsMap} />
      </section>

      {/* Compare */}
      <CompareCommunes />

      {/* Top Communes */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Les communes les plus ensoleillées de France
        </h2>
        <p className="text-gray-600 mb-8">
          Classement des villes avec le plus grand nombre d&apos;heures de soleil par an.
        </p>

        {topCommunes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {topCommunes.map((commune, index) => (
              <CommuneCard
                key={commune.code_insee}
                nom={commune.nom}
                slug={commune.slug}
                ensoleillement={commune.ensoleillement_annuel}
                codePostal={commune.code_postal}
                rank={index + 1}
              />
            ))}
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
            <p className="text-amber-700">Les données d&apos;ensoleillement sont en cours de chargement. Revenez bientôt !</p>
          </div>
        )}
      </section>

      {/* Top Départements */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Les départements les plus ensoleillés
          </h2>
          <p className="text-gray-600 mb-8">
            Découvrez quels départements profitent du meilleur ensoleillement en France.
          </p>

          {topDepartements.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-3 px-4 text-gray-600 font-semibold">#</th>
                    <th className="py-3 px-4 text-gray-600 font-semibold">Département</th>
                    <th className="py-3 px-4 text-gray-600 font-semibold">Code</th>
                    <th className="py-3 px-4 text-right text-gray-600 font-semibold">Ensoleillement moyen</th>
                  </tr>
                </thead>
                <tbody>
                  {topDepartements.map((dept, index) => (
                    <tr key={dept.code} className="border-b border-gray-100 hover:bg-amber-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-amber-500">{index + 1}</td>
                      <td className="py-3 px-4">
                        <Link href={`/departement/${dept.slug}`} className="text-gray-900 font-medium hover:text-amber-600 transition-colors">
                          {dept.nom}
                        </Link>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{dept.code}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {dept.ensoleillement_moyen?.toLocaleString('fr-FR')} h/an
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
              <p className="text-amber-700">Les données des départements sont en cours de chargement.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link
              href="/departement"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-full transition-colors shadow-sm"
            >
              Voir tous les départements
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Navigation rapide */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
          Explorer par région
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[
            'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Bretagne',
            'Centre-Val de Loire', 'Corse', 'Grand Est',
            'Hauts-de-France', 'Île-de-France', 'Normandie',
            'Nouvelle-Aquitaine', 'Occitanie', 'Pays de la Loire',
            'Provence-Alpes-Côte d\'Azur',
          ].map((region) => {
            const slug = region
              .toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-|-$/g, '');
            return (
              <Link
                key={region}
                href={`/region/${slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center font-medium text-gray-700 hover:text-amber-600 hover:border-amber-300 hover:shadow-md transition-all"
              >
                {region}
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO Content */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Comprendre l&apos;ensoleillement en France
          </h2>

          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              L&apos;ensoleillement en France varie considérablement d&apos;une région à l&apos;autre, allant d&apos;environ
              1 500 heures de soleil par an dans le nord du pays à plus de 2 800 heures sur le littoral
              méditerranéen. Cette disparité s&apos;explique par la position géographique de la France, à cheval
              entre les influences océaniques, continentales et méditerranéennes.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              Qu&apos;est-ce que le taux d&apos;ensoleillement ?
            </h3>
            <p>
              Le taux d&apos;ensoleillement, ou durée d&apos;insolation, correspond au nombre d&apos;heures pendant
              lesquelles le rayonnement solaire direct atteint la surface du sol. Il est mesuré en heures
              par an et constitue un indicateur clé pour évaluer le climat d&apos;une région. En France,
              Météo-France utilise des héliographes et des pyranomètres pour mesurer précisément cette donnée
              dans ses stations météorologiques réparties sur l&apos;ensemble du territoire.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              Les zones les plus ensoleillées de France
            </h3>
            <p>
              Sans surprise, le sud-est de la France domine le classement de l&apos;ensoleillement. Le département
              des Bouches-du-Rhône, avec Marseille en tête, bénéficie régulièrement de plus de 2 800 heures
              de soleil par an. La Corse, le Var, les Alpes-Maritimes et les Pyrénées-Orientales figurent
              également parmi les territoires les plus ensoleillés. Le littoral méditerranéen profite d&apos;un
              climat caractérisé par des étés secs et très ensoleillés, et des hivers doux avec un ensoleillement
              supérieur à la moyenne nationale.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              L&apos;ensoleillement dans le nord et l&apos;ouest de la France
            </h3>
            <p>
              Les régions du nord de la France, comme les Hauts-de-France et la Normandie, reçoivent en
              moyenne entre 1 500 et 1 700 heures de soleil par an. La Bretagne et les Pays de la Loire
              se situent dans une fourchette intermédiaire, entre 1 700 et 1 900 heures. L&apos;influence
              océanique apporte davantage de nébulosité, réduisant le nombre d&apos;heures d&apos;ensoleillement
              direct, mais offrant en contrepartie des températures plus douces en hiver.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              Variations saisonnières de l&apos;ensoleillement
            </h3>
            <p>
              L&apos;ensoleillement en France suit un cycle saisonnier marqué. Les mois de juin, juillet et
              août concentrent la majeure partie des heures de soleil, avec des journées pouvant dépasser
              15 heures de luminosité dans le sud. En revanche, les mois de novembre, décembre et janvier
              sont les moins ensoleillés, avec parfois moins de 50 heures de soleil dans les régions les
              plus septentrionales. Cette variation saisonnière influence directement l&apos;agriculture, le
              tourisme, la production d&apos;énergie solaire et le bien-être des habitants.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              Impact de l&apos;ensoleillement sur la vie quotidienne
            </h3>
            <p>
              Le nombre d&apos;heures de soleil a un impact significatif sur de nombreux aspects de la vie
              quotidienne. Du point de vue de la santé, l&apos;ensoleillement favorise la synthèse de vitamine D,
              essentielle pour la solidité des os et le système immunitaire. Il influence également l&apos;humeur
              et le moral des populations, le manque de lumière étant associé à la dépression saisonnière.
              Sur le plan économique, l&apos;ensoleillement est déterminant pour le secteur agricole
              (viticulture, arboriculture), le tourisme balnéaire et de montagne, ainsi que pour le
              développement des énergies renouvelables, notamment le photovoltaïque. Les régions les plus
              ensoleillées présentent un potentiel solaire pouvant produire jusqu&apos;à 1 500 kWh par kWc
              installé, soit 50% de plus que dans le nord du pays.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8">
              Choisir sa ville en fonction de l&apos;ensoleillement
            </h3>
            <p>
              De plus en plus de Français prennent en compte l&apos;ensoleillement dans leur choix de lieu de
              vie. Que ce soit pour un projet immobilier, une installation de panneaux solaires, ou
              simplement pour profiter d&apos;un cadre de vie agréable, connaître le taux d&apos;ensoleillement
              de sa commune est essentiel. Notre site vous permet de comparer facilement l&apos;ensoleillement
              de toutes les communes de France, avec des données mensuelles détaillées et des comparaisons
              avec les moyennes départementales, régionales et nationales.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
