import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité d\'Ensoleillement.fr - RGPD, cookies, données personnelles et droits des utilisateurs.',
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/politique-de-confidentialite',
  },
  robots: { index: true, follow: true },
};

export default function PolitiqueConfidentialite() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Politique de confidentialité' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        Politique de confidentialité
      </h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <p className="text-gray-600 text-sm">Dernière mise à jour : avril 2026</p>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p className="text-gray-700 leading-relaxed">
            La présente politique de confidentialité décrit comment le site <strong>taux-ensoleillement.fr</strong> collecte,
            utilise et protège les données personnelles de ses utilisateurs, conformément au Règlement Général
            sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Responsable du traitement</h2>
          <p className="text-gray-700 leading-relaxed">
            Le responsable du traitement des données est l&apos;éditeur du site taux-ensoleillement.fr,
            tel que défini dans les <a href="/mentions-legales" className="text-amber-600 hover:text-amber-700">mentions légales</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Données collectées</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Nous pouvons collecter les types de données suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Données de navigation</strong> : adresse IP, type de navigateur, pages visitées, durée de visite, provenance géographique approximative.</li>
            <li><strong>Cookies</strong> : cookies techniques nécessaires au fonctionnement du site, cookies analytiques et cookies publicitaires (voir section dédiée).</li>
            <li><strong>Données de contact</strong> : si vous nous contactez via le formulaire de contact, nous collectons votre adresse email et le contenu de votre message.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Utilisation des cookies</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Notre site utilise différents types de cookies :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Cookies essentiels</strong> : nécessaires au bon fonctionnement du site. Ils ne peuvent pas être désactivés.</li>
            <li><strong>Cookies analytiques</strong> : nous permettent de mesurer l&apos;audience du site et d&apos;améliorer son contenu (Google Analytics ou équivalent).</li>
            <li><strong>Cookies publicitaires</strong> : utilisés par Google AdSense pour afficher des publicités personnalisées en fonction de vos centres d&apos;intérêt. Ces cookies sont déposés par Google et ses partenaires publicitaires.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Vous pouvez à tout moment modifier vos préférences en matière de cookies via les paramètres
            de votre navigateur. La désactivation de certains cookies peut affecter votre expérience
            de navigation sur le site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Google AdSense</h2>
          <p className="text-gray-700 leading-relaxed">
            Ce site utilise Google AdSense, un service de publicité fourni par Google LLC. Google AdSense
            utilise des cookies pour afficher des annonces pertinentes en fonction de vos visites sur ce
            site et d&apos;autres sites sur Internet. Google utilise le cookie DART pour diffuser des annonces
            aux utilisateurs en fonction de leur visite sur nos sites et d&apos;autres sites Web. Les utilisateurs
            peuvent désactiver l&apos;utilisation du cookie DART en consultant la page de désactivation des
            annonces Google à l&apos;adresse{' '}
            <a href="https://adssettings.google.com" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">
              adssettings.google.com
            </a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Finalités du traitement</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Fournir et améliorer nos services d&apos;information sur l&apos;ensoleillement</li>
            <li>Analyser l&apos;utilisation du site pour en améliorer le contenu et l&apos;ergonomie</li>
            <li>Afficher des publicités pertinentes via Google AdSense</li>
            <li>Répondre à vos demandes de contact</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Durée de conservation</h2>
          <p className="text-gray-700 leading-relaxed">
            Les données de navigation sont conservées pour une durée maximale de 13 mois conformément
            aux recommandations de la CNIL. Les données de contact sont conservées pour une durée de
            3 ans à compter du dernier contact.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Vos droits (RGPD)</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Conformément au RGPD, vous disposez des droits suivants :
          </p>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li><strong>Droit d&apos;accès</strong> : obtenir la confirmation que des données vous concernant sont traitées et en obtenir une copie.</li>
            <li><strong>Droit de rectification</strong> : demander la correction de données inexactes ou incomplètes.</li>
            <li><strong>Droit à l&apos;effacement</strong> : demander la suppression de vos données personnelles.</li>
            <li><strong>Droit à la limitation</strong> : demander la limitation du traitement de vos données.</li>
            <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et couramment utilisé.</li>
            <li><strong>Droit d&apos;opposition</strong> : vous opposer au traitement de vos données pour des motifs légitimes.</li>
          </ul>
          <p className="text-gray-700 leading-relaxed mt-4">
            Pour exercer ces droits, vous pouvez nous contacter à l&apos;adresse : <strong>contact@taux-ensoleillement.fr</strong>.
            Vous disposez également du droit d&apos;introduire une réclamation auprès de la CNIL
            (<a href="https://www.cnil.fr" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Sécurité</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour protéger
            vos données personnelles contre la destruction accidentelle ou illicite, la perte, l&apos;altération,
            la divulgation non autorisée ou l&apos;accès non autorisé. Le site utilise le protocole HTTPS pour
            sécuriser les échanges de données.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Modifications</h2>
          <p className="text-gray-700 leading-relaxed">
            Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment.
            Les modifications prennent effet dès leur publication sur cette page. Nous vous encourageons
            à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
          </p>
        </section>
      </div>
    </div>
  );
}
