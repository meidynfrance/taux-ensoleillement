import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Ensoleillement en France - Heures de soleil par commune, département et région",
    template: "%s | Ensoleillement en France",
  },
  description:
    "Découvrez le taux d'ensoleillement de toutes les communes de France. Carte interactive, données mensuelles, classement des villes les plus ensoleillées par département et région.",
  keywords: [
    'ensoleillement France',
    'heures de soleil',
    'taux ensoleillement commune',
    'ville la plus ensoleillée',
    'ensoleillement par département',
    'carte ensoleillement',
    'soleil France',
  ],
  metadataBase: new URL('https://taux-ensoleillement.fr'),
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Taux-ensoleillement.fr',
    title: "Ensoleillement en France - Heures de soleil par commune",
    description:
      "Retrouvez les données d'ensoleillement de toutes les communes de France. Carte interactive et classements.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://taux-ensoleillement.fr',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Taux-ensoleillement.fr',
    url: 'https://taux-ensoleillement.fr',
    description: "Données d'ensoleillement de toutes les communes de France",
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://taux-ensoleillement.fr/?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="fr" className={`${inter.variable} h-full antialiased`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
