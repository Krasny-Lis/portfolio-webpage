import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import bootstrap from './src/main.server';

const app = express();
const port = process.env['PORT'] || 4000;
const distFolder = join(fileURLToPath(new URL('.', import.meta.url)), 'dist/portfolio-webpage/browser');
const indexPath = existsSync(join(distFolder, 'index.original.html'))
  ? join(distFolder, 'index.original.html')
  : join(distFolder, 'index.html');
const indexHtml = readFileSync(indexPath, 'utf-8');

app.use(express.static(distFolder, {
  maxAge: '1y'
}));

app.get('*', async (req, res, next) => {
  try {
    const { renderApplication, provideServerRendering } = await import('@angular/platform-server');
    const html = await renderApplication(bootstrap, {
      document: indexHtml,
      url: req.originalUrl,
      providers: [provideServerRendering(), { provide: APP_BASE_HREF, useValue: req.baseUrl }]
    });
    res.set('Cache-Control', 'no-store');
    res.send(html);
  } catch (error) {
    next(error);
  }
});

app.listen(port, () => {
  console.log(`Angular SSR server listening on http://localhost:${port}`);
});
