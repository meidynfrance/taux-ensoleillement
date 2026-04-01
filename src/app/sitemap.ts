import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://taux-ensoleillement.fr';

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/region`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/departement`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/a-propos`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/mentions-legales`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    {
      url: `${baseUrl}/politique-de-confidentialite`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ];

  // Regions
  let regionPages: MetadataRoute.Sitemap = [];
  try {
    const { data: regions } = await supabase.from('regions').select('slug');
    if (regions) {
      regionPages = regions.map((r) => ({
        url: `${baseUrl}/region/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // silently fail
  }

  // Departements
  let deptPages: MetadataRoute.Sitemap = [];
  try {
    const { data: depts } = await supabase.from('departements').select('slug');
    if (depts) {
      deptPages = depts.map((d) => ({
        url: `${baseUrl}/departement/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }));
    }
  } catch {
    // silently fail
  }

  // Communes (all of them for maximum SEO)
  let communePages: MetadataRoute.Sitemap = [];
  try {
    const { data: communes } = await supabase.from('communes').select('slug');
    if (communes) {
      communePages = communes.map((c) => ({
        url: `${baseUrl}/commune/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));
    }
  } catch {
    // silently fail
  }

  return [...staticPages, ...regionPages, ...deptPages, ...communePages];
}
