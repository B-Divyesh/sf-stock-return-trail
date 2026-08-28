import { access, readFile } from 'node:fs/promises';

const pages = {
  '/': ['dist/index.html', 'Stock Return Trail — Return job stock to its origin'],
  '/demo': ['dist/demo/index.html', 'Demo — Stock Return Trail'],
  '/app': ['dist/app/index.html', 'Jobs — Stock Return Trail'],
  '/log': ['dist/log/index.html', 'Movement log — Stock Return Trail'],
  '/settings': ['dist/settings/index.html', 'Backup — Stock Return Trail'],
  '/privacy': ['dist/privacy/index.html', 'Privacy — Stock Return Trail'],
  '/terms': ['dist/terms/index.html', 'Terms — Stock Return Trail'],
  '/404': ['dist/404.html', 'Page not found — Stock Return Trail'],
};

for (const [route, [file, title]] of Object.entries(pages)) {
  await access(file);
  const html = await readFile(file, 'utf8');
  const url = `https://stock-return-trail.sociobot.in${route === '/' ? '/' : route}`;
  if (!html.includes(`<title>${title}</title>`) || !html.includes(`rel="canonical" href="${url}"`) || !html.includes(`property="og:title" content="${title}"`) || !html.includes(`property="og:url" content="${url}"`)) {
    throw new Error(`${route} does not have its own complete raw metadata.`);
  }
}
const missing = await readFile('dist/404.html', 'utf8');
if (!missing.includes('name="robots" content="noindex,nofollow"')) throw new Error('404 page must not be indexed.');
console.log(`Verified raw titles, canonicals, and social metadata for ${Object.keys(pages).length} emitted routes.`);
