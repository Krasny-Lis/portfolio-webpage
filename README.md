# Developer Portfolio – Angular, TypeScript & Data Engineering

[![Build and deploy Angular to GitHub Pages](https://github.com/Krasny-Lis/portfolio-webpage/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Krasny-Lis/portfolio-webpage/actions/workflows/deploy-pages.yml)

Bilingual developer portfolio built with Angular 19. It presents frontend and data-engineering projects, technical skills and contact information in a responsive, accessible interface.

**Live application:** https://krasny-lis.github.io/portfolio-webpage/#/

## What this project demonstrates

- standalone Angular architecture and lazy-loaded routes
- Signals and RxJS for UI and content state
- bilingual content stored outside component code
- accessible navigation, keyboard support and light/dark themes
- responsive project filtering and contact form validation
- Jest unit tests, Cypress end-to-end setup and ESLint
- automated GitHub Pages build and deployment
- build-specific cache invalidation for project and skill data
- separate SSR and prerender configuration for compatible hosts

## Technology stack

| Area | Technology |
| --- | --- |
| Application | Angular 19, TypeScript, RxJS |
| UI | SCSS, Angular CDK, responsive design |
| State | Angular Signals and reactive streams |
| Testing | Jest, Cypress |
| Quality | ESLint, Prettier, GitHub Actions |
| Hosting | GitHub Pages |

## Run locally

Node.js 22 is recommended.

```bash
npm ci
npm start
```

The development server is available at http://localhost:4200.

## Quality checks

```bash
npm run lint
npm run test -- --ci --runInBand
npm run build
```

The pull-request workflow runs the full Jest suite, ESLint and the production GitHub Pages build. End-to-end tests can be run separately with `npm run e2e` while the application is running.

## Content management

Portfolio content is stored in two language variants:

```text
src/assets/content/
  en/
    projects.json
    skills.json
    social.json
  pl/
    projects.json
    skills.json
    social.json
```

Each production deployment injects the current Git commit SHA as `BUILD_VERSION`. Content requests include it as a query parameter, for example:

```text
assets/content/en/projects.json?v=<git-commit-sha>
```

This prevents a new application version from reusing outdated project or skill JSON files from the browser cache.

## Deployment

The supported GitHub Pages deployment is a client-rendered build:

```bash
npm run build:pages
```

The workflow:

1. installs locked dependencies;
2. runs unit tests and ESLint;
3. builds the application with the repository base path;
4. injects the deployment commit SHA;
5. uploads `dist/portfolio-webpage/browser`;
6. deploys only after changes reach `master`.

Hash routing is used for reliable refreshes on static hosting. The SSR and prerender configuration remains available for environments that can serve generated or server-rendered HTML.

## Project status

Actively maintained. Portfolio content is updated when a new public project or meaningful technical result is ready.
