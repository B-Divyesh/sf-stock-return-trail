import { mkdir, readFile, writeFile } from 'node:fs/promises';

const origin = 'https://stock-return-trail.sociobot.in';
const routes = {
  '/': {
    title: 'Stock Return Trail — Return job stock to its origin',
    description: 'Record stock sent to a job, count what was used, and return each remainder to its saved origin.',
  },
  '/demo': { title: 'Demo — Stock Return Trail', description: 'Try a sample job that is ready to finish.' },
  '/app': { title: 'Jobs — Stock Return Trail', description: 'Record stock leaving an origin and finish each job with returns.' },
  '/log': { title: 'Movement log — Stock Return Trail', description: 'Review and export your local stock movement log.' },
  '/settings': { title: 'Backup — Stock Return Trail', description: 'Back up and restore your local Stock Return Trail records.' },
  '/privacy': { title: 'Privacy — Stock Return Trail', description: 'How Stock Return Trail stores and handles your data.' },
  '/terms': { title: 'Terms — Stock Return Trail', description: 'Terms for using Stock Return Trail.' },
  '/404': { title: 'Page not found — Stock Return Trail', description: 'Return to Stock Return Trail.', robots: 'noindex,nofollow' },
};

function escapeHtml(value) {
  return value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function replaceMeta(html, selector, content) {
  const escaped = escapeHtml(content);
  const expression = new RegExp(`(<meta(?=[^>]*${selector})[^>]*\\bcontent=["'])[^"']*(["'][^>]*>)`, 'i');
  return html.replace(expression, `$1${escaped}$2`);
}

function pageFor(path, meta) {
  const url = `${origin}${path === '/' ? '/' : path}`;
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/i, `<title>${escapeHtml(meta.title)}</title>`);
  html = replaceMeta(html, 'name="description"', meta.description);
  html = html.replace(/(<link[^>]*rel=["']canonical["'][^>]*href=["'])[^"']*(["'][^>]*>)/i, `$1${url}$2`);
  html = replaceMeta(html, 'property="og:title"', meta.title);
  html = replaceMeta(html, 'property="og:description"', meta.description);
  html = replaceMeta(html, 'property="og:url"', url);
  html = replaceMeta(html, 'name="twitter:title"', meta.title);
  html = replaceMeta(html, 'name="twitter:description"', meta.description);
  html = replaceMeta(html, 'name="robots"', meta.robots || 'index,follow');
  return html;
}

const template = await readFile('dist/index.html', 'utf8');
for (const [path, meta] of Object.entries(routes)) {
  const html = pageFor(path, meta);
  if (path === '/') {
    await writeFile('dist/index.html', html);
  } else if (path === '/404') {
    await writeFile('dist/404.html', html);
  } else {
    const destination = `dist${path}`;
    await mkdir(destination, { recursive: true });
    await writeFile(`${destination}/index.html`, html);
  }
}
