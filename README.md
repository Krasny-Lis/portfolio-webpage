# Portfolio Angular Developer

MVP portfolio application built with Angular 19 standalone components. The app showcases projects, skills and contact options, supports light/dark theming, and is prepared for SSR + prerender to achieve high Lighthouse scores.

## Tech stack & features

- Angular 19 standalone architecture
- Signals for UI state (theme, filters)
- Reactive forms for validated contact form
- Server Side Rendering + prerender (`ng run portfolio-webpage:prerender`)
- Static content fetched from `assets/content/*.json` with build-specific cache versioning
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

| Command             | Description                                       |
| ------------------- | ------------------------------------------------- |
| `npm run lint`      | Run ESLint on `src/` and `cypress/`.              |
| `npm run test`      | Execute Jest unit tests.                          |
| `npm run build`     | Production browser build.                         |
| `npm run build:pages` | Production browser build for GitHub Pages.       |
| `npm run build:ssr` | Build browser + server bundles for SSR.           |
| `npm run prerender` | Prerender defined routes to static HTML.          |
| `npm run e2e`       | Execute Cypress e2e tests (requires app running). |
| `npm run format`    | Format using Prettier.                            |

## Deployment

The supported GitHub Pages deployment uses a client-rendered Angular build. Follow
the setup below; do not use the SSR/prerender commands for Pages. GitHub Pages does
not run a Node.js server. The existing SSR configuration is separate from this
deployment and is not validated by the Pages workflow.

## Content management

Portfolio data lives in `src/assets/content`:

- `projects.json` - metadata, demo/repo links, `private` flag
- `skills.json` - skill groups with level tags
- `social.json` - social/contact links used in navbar/footer

Update these files to refresh displayed content. Production builds append the
current Git commit SHA to content requests as a `?v=` parameter. This changes the
asset URL on every deployment and prevents browsers from reusing outdated project
or skill JSON files.

## Testing & quality

- **Unit tests**: `npm run test`
- **Lint**: `npm run lint`
- **End-to-end**: `npm run e2e`

The Pages workflow runs `npm ci`, the full Jest unit suite, ESLint and
`npm run build:pages` on pull requests to `master`. Publishing runs only after a
push to `master` or a manual workflow run on `master`. End-to-end tests remain a
separate local check.

## Environments

- `src/environments/environment.ts` - local/dev (owner view = `true`)
- `src/environments/environment.production.ts` - production (private projects hidden)

Adjust `contactEndpoint` to point at the form backend of your choice (Formspree, EmailJS, etc.).

## GitHub Pages / Static hosting

### One-time repository setup

1. Open **Settings → Pages → Build and deployment**.
2. Set **Source** to **GitHub Actions**, not **Deploy from a branch**. Do not select
   `/docs`: that directory does not contain a built site.
3. Merge the deployment changes into `master`.
4. Open **Actions → Build and deploy Angular to GitHub Pages** and wait for both
   `build` and `deploy` to finish. Subsequent pushes to `master` update the site.
5. Open <https://krasny-lis.github.io/portfolio-webpage/>.

If Pages is enabled after the workflow has already failed, rerun the failed jobs
or use **Run workflow** on `master`. No personal access token is needed.

### Build and routing

```bash
npm ci
npm run build:pages
```

Upload the contents of `dist/portfolio-webpage/browser`, not the source repository
or the parent `dist/portfolio-webpage` directory. The workflow does this for you.

The command combines the `production` and `github-pages` configurations:

- `baseHref` is `/portfolio-webpage/`, so scripts, styles and JSON assets load
  under the repository URL.
- The production environment remains active (`ownerView: false`).
- The workflow injects the current Git commit SHA as `BUILD_VERSION`, which is
  added to JSON content URLs to invalidate stale browser caches.
- `app.config.pages.ts` replaces the normal app config only for this build. It
  uses hash routing and does not enable hydration, because no server-rendered
  HTML is provided.
- Routes use URLs such as `/portfolio-webpage/#/projects`. Opening that URL
  directly or refreshing it requests the same static index page, avoiding 404s.
- `npm start`, `npm run build` and the existing SSR configuration are unchanged.

After deployment, check the home page, open `#/projects` and `#/contact` directly,
refresh both pages, and verify the language switch and project/skill data. The
Pages build is client-rendered, not prerendered HTML with per-route SEO metadata.

If the repository is renamed or a custom domain is added, update `baseHref` in
the `github-pages` configuration in `angular.json` to match its new public path.

## License

MIT
