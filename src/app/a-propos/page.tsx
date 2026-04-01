import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'À propos - Ensoleillement en France',
  description: 'En savoir plus sur Taux-ensoleillement.fr, le site de référence pour consulter les données d\'ensoleillement de toutes les communes de France.',
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/a-propos',
  },
};

export default function APropos() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'À propos' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        À propos de Taux-ensoleillement.fr
      </h1>

      <div className="prose prose-gray max-w-none space-y-6">
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6 mb-8">
          <p className="text-lg text-gray-800 leading-relaxed">
            <strong>Taux-ensoleillement.fr</strong> est le site de référence pour consulter les données
            d&apos;ensoleillement de toutes les communes de France. Notre mission : vous fournir des
            informations précises et détaillées sur le nombre d&apos;heures de soleil dans chaque ville,
            département et région de France.
          </p>
        </div>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Notre mission</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous croyons que l&apos;accès aux données climatiques devrait être simple et gratuit pour tous.
            Que vous cherchiez une ville ensoleillée pour vous installer, que vous planifiiez l&apos;installation
            de panneaux solaires, ou que vous soyez simplement curieux de connaître l&apos;ensoleillement de
            votre commune, notre site est fait pour vous.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nos données</h2>
          <p className="text-gray-700 leading-relaxed">
            Les données d&apos;ensoleillement présentées sur ce site sont issues de sources officielles et
            publiques, notamment les données de Météo-France et les statistiques de l&apos;INSEE. Nous
            compilons et présentons ces données de manière claire et accessible pour vous permettre
            de comparer facilement l&apos;ensoleillement entre différentes communes et territoires.
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Pour chaque commune, vous trouverez :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
            <li>Le nombre total d&apos;heures d&apos;ensoleillement par an</li>
            <li>La répartition mensuelle détaillée (de janvier à décembre)</li>
            <li>La comparaison avec les moyennes départementales et nationales</li>
            <li>Le classement par rapport aux autres communes du département</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ce que vous pouvez faire sur notre site</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Rechercher une commune</h3>
              <p className="text-gray-600 text-sm">
                Trouvez instantanément les données d&apos;ensoleillement de n&apos;importe quelle commune française.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Explorer la carte</h3>
              <p className="text-gray-600 text-sm">
                Visualisez l&apos;ensoleillement sur une carte interactive de France.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Comparer les régions</h3>
              <p className="text-gray-600 text-sm">
                Découvrez les classements par <Link href="/region" className="text-amber-600 hover:text-amber-700">région</Link> et
                par <Link href="/departement" className="text-amber-600 hover:text-amber-700">département</Link>.
              </p>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Données mensuelles</h3>
              <p className="text-gray-600 text-sm">
                Consultez les heures de soleil mois par mois pour chaque commune.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Nous contacter</h2>
          <p className="text-gray-700 leading-relaxed">
            Vous avez une question, une suggestion ou vous souhaitez signaler une erreur ? N&apos;hésitez pas
            à nous <Link href="/contact" className="text-amber-600 hover:text-amber-700 font-medium">contacter</Link>.
            Nous nous efforçons de répondre à toutes les demandes dans les meilleurs délais.
          </p>
        </section>
      </div>
    </div>
  );
}
