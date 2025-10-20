# Portfolio Angular Developer

MVP portfolio application built with Angular 19 standalone components. The app showcases projects, skills and contact options, supports light/dark theming, and is prepared for SSR + prerender to achieve high Lighthouse scores.

## Tech stack & features

- Angular 19 standalone architecture
- Signals for UI state (theme, filters)
- Reactive forms for validated contact form
- Server Side Rendering + prerender (`ng run portfolio-webpage:prerender`)
- Static content fetched from `assets/content/*.json`
- Accessible UI with keyboard support and WCAG-focused styling
- Dark/Light mode persisted in `localStorage`
- Jest for unit tests, Cypress for e2e (baseline config)

## Getting started

```bash
npm install
npm run start          # SPA dev server on http://localhost:4200
npm run dev:ssr        # Start SSR dev server (http://localhost:4200 by default)
```

## Useful scripts

| Command | Description |
| --- | --- |
| `npm run lint` | Run ESLint on `src/` and `cypress/`. |
| `npm run test` | Execute Jest unit tests. |
| `npm run build` | Production browser build. |
| `npm run build:ssr` | Build browser + server bundles for SSR. |
| `npm run prerender` | Prerender defined routes to static HTML. |
| `npm run e2e` | Execute Cypress e2e tests (requires app running). |
| `npm run format` | Format using Prettier. |

## Deployment

1. Build SSR bundles: `npm run build:ssr`.
2. Optionally prerender static routes: `npm run prerender`.
3. Serve using the generated Node server (`node dist/portfolio-webpage/server/server.mjs`) or deploy the prerendered output (`dist/portfolio-webpage/browser`).

## Content management

Portfolio data lives in `src/assets/content`:

- `projects.json` – metadata, demo/repo links, `private` flag
- `skills.json` – skill groups with level tags
- `social.json` – social/contact links used in navbar/footer

Update these files to refresh displayed content.

## Testing & quality

- **Unit tests**: `npm run test`
- **Lint**: `npm run lint`
- **End-to-end**: `npm run e2e`

CI should follow the pipeline `install -> lint -> test -> build -> prerender`.

## Environments

- `src/environments/environment.ts` – local/dev (owner view = `true`)
- `src/environments/environment.production.ts` – production (private projects hidden)

Adjust `contactEndpoint` to point at the form backend of your choice (Formspree, EmailJS, etc.).

## GitHub Pages / Static hosting

1. Run `npm run prerender` to generate HTML for key routes.
2. Deploy contents of `dist/portfolio-webpage/browser` to a static host (Netlify, Vercel, GitHub Pages). The generated files include meta tags per route and JSON-LD schema for SEO.

## License

MIT
