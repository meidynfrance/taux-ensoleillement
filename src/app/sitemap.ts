import type { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

const baseUrl = 'https://taux-ensoleillement.fr';
const COMMUNES_PER_SITEMAP = 5000;

export async function generateSitemaps() {
  // Count total communes
  let totalCommunes = 0;
  try {
    const { count } = await supabase
      .from('communes')
      .select('*', { count: 'exact', head: true });
    totalCommunes = count || 0;
  } catch {
    totalCommunes = 35000;
  }

  const numSitemaps = Math.ceil(totalCommunes / COMMUNES_PER_SITEMAP);
  // id 0 = static + regions + departements, ids 1..N = communes
  const sitemaps = [{ id: 0 }];
  for (let i = 1; i <= numSitemaps; i++) {
    sitemaps.push({ id: i });
  }
  return sitemaps;
}

export default async function sitemap({ id }: { id: number }): Promise<MetadataRoute.Sitemap> {
  if (id === 0) {
    // Static pages + regions + departements
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
    } catch { /* */ }

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
    } catch { /* */ }

    return [...staticPages, ...regionPages, ...deptPages];
  }

  // Commune sitemaps (id 1, 2, 3, ...)
  const offset = (id - 1) * COMMUNES_PER_SITEMAP;
  try {
    const { data: communes } = await supabase
      .from('communes')
      .select('slug')
      .order('id', { ascending: true })
      .range(offset, offset + COMMUNES_PER_SITEMAP - 1);

    if (communes) {
      return communes.map((c) => ({
        url: `${baseUrl}/commune/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }));
    }
  } catch { /* */ }

  return [];
}
