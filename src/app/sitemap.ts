import type { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';

const baseUrl = 'https://taux-ensoleillement.fr';

// Use a fresh client to avoid any caching issues during build
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = getSupabase();

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/departement`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/a-propos`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${baseUrl}/mentions-legales`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
    { url: `${baseUrl}/politique-de-confidentialite`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.2 },
  ];

  // Regions
  const regionPages: MetadataRoute.Sitemap = [];
  try {
    const { data: regions, error } = await supabase.from('regions').select('slug');
    if (!error && regions) {
      for (const r of regions) {
        regionPages.push({
          url: `${baseUrl}/region/${r.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.7,
        });
      }
    }
  } catch { /* */ }

  // Departements
  const deptPages: MetadataRoute.Sitemap = [];
  try {
    const { data: depts, error } = await supabase.from('departements').select('slug');
    if (!error && depts) {
      for (const d of depts) {
        deptPages.push({
          url: `${baseUrl}/departement/${d.slug}`,
          lastModified: new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        });
      }
    }
  } catch { /* */ }

  // Communes - paginated to get all 35k+
  const communePages: MetadataRoute.Sitemap = [];
  try {
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data: communes, error } = await supabase
        .from('communes')
        .select('slug')
        .order('id', { ascending: true })
        .range(offset, offset + pageSize - 1);

      if (error || !communes || communes.length === 0) {
        hasMore = false;
      } else {
        for (const c of communes) {
          communePages.push({
            url: `${baseUrl}/commune/${c.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
          });
        }
        offset += pageSize;
        hasMore = communes.length === pageSize;
      }
    }
  } catch { /* */ }

  return [...staticPages, ...regionPages, ...deptPages, ...communePages];
}
