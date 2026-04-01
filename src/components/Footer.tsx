import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* A propos */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <img src="/logo.svg" alt="Taux-ensoleillement.fr" width={24} height={24} className="w-6 h-6" />
              Taux-ensoleillement<span className="text-amber-500">.fr</span>
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Retrouvez les données d&apos;ensoleillement de toutes les communes de France.
              Comparez les heures de soleil par département et par région.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">Accueil</Link>
              </li>
              <li>
                <Link href="/region" className="hover:text-amber-400 transition-colors">Régions de France</Link>
              </li>
              <li>
                <Link href="/departement" className="hover:text-amber-400 transition-colors">Départements de France</Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-amber-400 transition-colors">À propos</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Informations légales</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/mentions-legales" className="hover:text-amber-400 transition-colors">Mentions légales</Link>
              </li>
              <li>
                <Link href="/politique-de-confidentialite" className="hover:text-amber-400 transition-colors">Politique de confidentialité</Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-amber-400 transition-colors">Plan du site</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-10 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Taux-ensoleillement.fr - Toutes les données d&apos;ensoleillement en France. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
}
