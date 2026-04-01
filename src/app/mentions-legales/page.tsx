import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Taux-ensoleillement.fr - Informations sur l\'éditeur, l\'hébergeur et les conditions d\'utilisation.',
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
            EI Meidy BAFFOU (Entreprise Individuelle)<br />
            SIRET : 80473268300045<br />
            Email : contact@taux-ensoleillement.fr<br />
            Directeur de la publication : Meidy BAFFOU
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Hébergeur</h2>
          <p className="text-gray-700 leading-relaxed">
            Le site est hébergé par :<br />
            Vercel Inc.<br />
            340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis<br />
            Site web : <a href="https://vercel.com" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">vercel.com</a>
          </p>
          <p className="text-gray-700 leading-relaxed mt-3">
            Base de données hébergée par :<br />
            Supabase Inc.<br />
            San Francisco, CA, États-Unis<br />
            Site web : <a href="https://supabase.com" className="text-amber-600 hover:text-amber-700" target="_blank" rel="noopener noreferrer">supabase.com</a>
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Propriété intellectuelle</h2>
          <p className="text-gray-700 leading-relaxed">
            L&apos;ensemble du contenu du site taux-ensoleillement.fr (textes, images, graphiques, logo, icônes,
            code source, design) est protégé par le droit d&apos;auteur et le droit de la propriété intellectuelle.
            Toute reproduction, même partielle, est interdite sans l&apos;autorisation écrite préalable de l&apos;éditeur.
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
            Le site taux-ensoleillement.fr est fourni « en l&apos;état ». L&apos;éditeur ne pourra être tenu
            responsable des dommages directs ou indirects liés à l&apos;utilisation du service, y compris
            l&apos;indisponibilité, la perte de données ou l&apos;utilisation abusive par des tiers.
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
            fins publicitaires. Pour en savoir plus sur notre utilisation des cookies, veuillez consulter
            notre <a href="/politique-de-confidentialite" className="text-amber-600 hover:text-amber-700">politique de confidentialité</a>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Droit applicable</h2>
          <p className="text-gray-700 leading-relaxed">
            Les présentes mentions légales sont régies par le droit français. En cas de litige, les tribunaux
            compétents de Paris seront seuls compétents.
          </p>
        </section>
      </div>
    </div>
  );
}
