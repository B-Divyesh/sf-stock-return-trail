import { readdir, readFile, writeFile } from 'node:fs/promises';

const assetNames = await readdir(new URL('../dist/assets/', import.meta.url));
const precache = assetNames
  .filter((name) => /\.(?:js|css|woff2?)$/.test(name))
  .map((name) => `/assets/${name}`);
const swUrl = new URL('../dist/sw.js', import.meta.url);
const source = await readFile(swUrl, 'utf8');
await writeFile(swUrl, source.replace('/*__PRECACHE__*/[]', JSON.stringify(precache)));
