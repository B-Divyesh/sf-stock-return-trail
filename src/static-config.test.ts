import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Route = { route: string; headers?: Record<string, string> };

describe('static-host cache policy', () => {
  it('keeps versioned assets immutable while HTML, the manifest, and worker revalidate', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as {
      globalHeaders: Record<string, string>;
      routes: Route[];
      mimeTypes: Record<string, string>;
    };
    expect(config.globalHeaders['Cache-Control']).toBe('public, max-age=0, must-revalidate');
    expect(config.routes.find((item) => item.route === '/assets/*')?.headers?.['Cache-Control']).toBe('public, max-age=31536000, immutable');
    expect(config.routes.find((item) => item.route === '/sw.js')?.headers?.['Cache-Control']).toBe('no-cache, no-store, must-revalidate');
    expect(config.routes.find((item) => item.route === '/manifest.webmanifest')?.headers?.['Cache-Control']).toBe('public, max-age=300, must-revalidate');
    expect(config.mimeTypes['.avif']).toBe('image/avif');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
  });

  it('uses real emitted pages for known routes and reserves a status-404 override for unknown paths', () => {
    const config = JSON.parse(readFileSync(resolve(process.cwd(), 'public/staticwebapp.config.json'), 'utf8')) as {
      navigationFallback?: unknown;
      responseOverrides: Record<string, { rewrite: string }>;
      routes: Array<{ route: string; rewrite?: string }>;
    };
    expect(config.navigationFallback).toBeUndefined();
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html' });
    const source = readFileSync(resolve(process.cwd(), 'scripts/prerender-routes.mjs'), 'utf8');
    for (const route of ['/demo', '/app', '/log', '/settings', '/privacy', '/terms']) {
      expect(source).toContain(`'${route}'`);
      expect(config.routes.find((item) => item.route === route)?.rewrite).toBe(`${route}/index.html`);
    }
  });
});
