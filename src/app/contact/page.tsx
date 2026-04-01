import type { Metadata } from 'next';
import Breadcrumb from '@/components/Breadcrumb';

export const metadata: Metadata = {
  title: 'Contact - Ensoleillement.fr',
  description: 'Contactez l\'équipe d\'Ensoleillement.fr pour toute question sur les données d\'ensoleillement en France.',
  alternates: {
    canonical: 'https://taux-ensoleillement.fr/contact',
  },
};

export default function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb
        items={[
          { label: 'Accueil', href: '/' },
          { label: 'Contact' },
        ]}
      />

      <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-8">
        Contactez-nous
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-700 leading-relaxed mb-6">
            Vous avez une question sur les données d&apos;ensoleillement, une suggestion d&apos;amélioration
            ou vous souhaitez signaler une erreur ? N&apos;hésitez pas à nous écrire.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Email</h2>
              <a href="mailto:contact@taux-ensoleillement.fr" className="text-amber-600 hover:text-amber-700 font-medium">
                contact@taux-ensoleillement.fr
              </a>
            </div>

            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Délai de réponse</h2>
              <p className="text-gray-600">Nous nous efforçons de répondre sous 48 heures ouvrées.</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Envoyer un message</h2>
          <form
            action="mailto:contact@taux-ensoleillement.fr"
            method="post"
            encType="text/plain"
            className="space-y-4"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Votre nom
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                placeholder="Jean Dupont"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Votre email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
                placeholder="jean@exemple.fr"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Sujet
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors"
              >
                <option value="question">Question générale</option>
                <option value="erreur">Signaler une erreur</option>
                <option value="suggestion">Suggestion d&apos;amélioration</option>
                <option value="partenariat">Partenariat</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Votre message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 transition-colors resize-vertical"
                placeholder="Votre message..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-sm"
            >
              Envoyer le message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
