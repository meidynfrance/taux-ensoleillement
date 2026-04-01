import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Ensoleillement.fr - Informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/mentions-legales',
  },
  robots: { index: true, follow: true },
};

export default function MentionsLegales() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Mentions légales' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        Mentions légales
      </h1>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Éditeur du site</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site <strong>taux-ensoleillement.fr</strong> est édité par :<br />
            Nom : [Nom de l&apos;éditeur]<br />
            Adresse : [Adresse postale]<br />
            Email : contact@taux-ensoleillement.fr<br />
            Directeur de la publication : [Nom du directeur de publication]
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergeur</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site est hébergé par :<br />
            Vercel Inc.<br />
            440 N Bashaw St, San Francisco, CA 94107, États-Unis<br />
            Site web : <a href="https://vercel.com" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">vercel.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            L&apos;ensemble du contenu du site taux-ensoleillement.fr (textes, images, graphiques, logo, icônes, etc.)
            est protégé par le droit d&apos;auteur et le droit de la propriété intellectuelle. Toute reproduction,
            représentation, modification, publication ou adaptation de tout ou partie des éléments du site,
            quel que soit le moyen ou le procédé utilisé, est interdite sans l&apos;autorisation écrite préalable
            de l&apos;éditeur.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sources des données</h2>
          <p className="text-gray-700 leading-relaxed">
            Les données d&apos;ensoleillement présentées sur ce site proviennent de sources publiques, notamment
            Météo-France et l&apos;INSEE. Ces données sont fournies à titre indicatif et ne sauraient engager
            la responsabilité de l&apos;éditeur. Les données de population proviennent de l&apos;INSEE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Limitation de responsabilité</h2>
          <p className="text-gray-700 leading-relaxed">
            L&apos;éditeur s&apos;efforce de fournir des informations aussi précises que possible. Toutefois, il ne
            pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour,
            qu&apos;elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            Toutes les informations indiquées sur le site sont données à titre indicatif et sont susceptibles
            d&apos;évoluer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Liens hypertextes</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site taux-ensoleillement.fr peut contenir des liens hypertextes vers d&apos;autres sites. Cependant,
            l&apos;éditeur n&apos;a pas la possibilité de vérifier le contenu des sites ainsi visités et n&apos;assumera
            en conséquence aucune responsabilité de ce fait.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site taux-ensoleillement.fr utilise des cookies pour améliorer l&apos;expérience utilisateur et à des
            fins statistiques. Pour en savoir plus sur notre utilisation des cookies, veuillez consulter
            notre <a href="/politique-de-confidentialite" className="text-amber-600 hover:text-amber-700">politique de confidentialité</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Droit applicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux
            français seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
