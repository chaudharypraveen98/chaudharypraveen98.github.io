import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import fs from 'fs';
import path from 'path';

function copyDirSync(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function syncStaticAssets() {
  return {
    name: 'sync-static-assets',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const outDir = dir.pathname;

        // 1. Ensure projects/index.html exists alongside projects.html
        const projectsHtml = path.join(outDir, 'projects.html');
        const projectsIndex = path.join(outDir, 'projects', 'index.html');
        if (fs.existsSync(projectsHtml)) {
          fs.copyFileSync(projectsHtml, projectsIndex);
        }

        // 1b. Ensure sitemap.xml exists from sitemap-0.xml
        const sitemap0 = path.join(outDir, 'sitemap-0.xml');
        const sitemapTarget = path.join(outDir, 'sitemap.xml');
        if (fs.existsSync(sitemap0)) {
          fs.copyFileSync(sitemap0, sitemapTarget);
        }

        // 2. Copy root static files & subdirs
        const rootDir = process.cwd();
        const staticItems = [
          'CNAME',
          'robots.txt',
          'favicon.ico',
          'logo.webp',
          'manifest.json',
          'resume.pdf',
          'about.html',
          'contact.html',
          'index.html',
          'single.html',
          'service-worker.js',
          'binarybeast',
          'playlist',
          'project-preview',
          'css',
          'fonts',
          'icon',
          'images',
          'js',
        ];

        for (const item of staticItems) {
          const srcPath = path.join(rootDir, item);
          const destPath = path.join(outDir, item);
          if (!fs.existsSync(srcPath)) continue;
          if (fs.statSync(srcPath).isDirectory()) {
            copyDirSync(srcPath, destPath);
          } else {
            fs.copyFileSync(srcPath, destPath);
          }
        }

        // 3. Copy projects assets, css, js into dist/projects/
        const projectAssets = ['assets', 'css', 'js'];
        for (const item of projectAssets) {
          const srcPath = path.join(rootDir, 'projects', item);
          const destPath = path.join(outDir, 'projects', item);
          if (fs.existsSync(srcPath)) {
            copyDirSync(srcPath, destPath);
          }
        }
      },
    },
  };
}

export default defineConfig({
  site: 'https://www.praveenchaudhary.in',
  build: {
    format: 'file', // Generates /projects/slug.html to match existing URLs
  },
  integrations: [
    sitemap({
      customPages: [
        'https://www.praveenchaudhary.in/',
        'https://www.praveenchaudhary.in/about.html',
        'https://www.praveenchaudhary.in/contact.html',
        'https://www.praveenchaudhary.in/project-preview/',
        'https://www.praveenchaudhary.in/playlist/',
        'https://www.praveenchaudhary.in/binarybeast/',
        'https://www.praveenchaudhary.in/single.html',
      ],
      filter: (page) => !page.includes('/404') && !page.includes('/fonts'),
      serialize(item) {
        if (item.url.includes('/projects/') && !item.url.endsWith('.html')) {
          item.url = `${item.url}.html`;
        }
        return item;
      },
    }),
    syncStaticAssets(),
  ],
});
