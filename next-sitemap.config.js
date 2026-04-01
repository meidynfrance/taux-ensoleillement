/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://taux-ensoleillement.fr',
  generateRobotsTxt: false, // We use Next.js built-in robots.ts
  generateIndexSitemap: true,
  changefreq: 'monthly',
  priority: 0.5,
  exclude: ['/api/*'],
};
