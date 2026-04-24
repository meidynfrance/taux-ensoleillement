import type { MetadataRoute } from 'next';
import sql from '@/lib/db';

const baseUrl = 'https://taux-ensoleillement.fr';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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
    const regions = await sql<{ slug: string }[]>`SELECT slug FROM regions`;
    for (const r of regions) {
      regionPages.push({
        url: `${baseUrl}/region/${r.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  } catch { /* */ }

  // Departements
  const deptPages: MetadataRoute.Sitemap = [];
  try {
    const depts = await sql<{ slug: string }[]>`SELECT slug FROM departements`;
    for (const d of depts) {
      deptPages.push({
        url: `${baseUrl}/departement/${d.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  } catch { /* */ }

  // Communes — paginées pour gérer les 35 000+
  const communePages: MetadataRoute.Sitemap = [];
  try {
    const pageSize = 1000;
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const communes = await sql<{ slug: string }[]>`
        SELECT slug FROM communes
        ORDER BY id ASC
        LIMIT ${pageSize} OFFSET ${offset}
      `;

      if (!communes.length) {
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
