# ☁️ Cloud Resume Challenge — Mahlatse Madiseng

[![Deploy to Azure Static Web Apps](https://github.com/Madisengm/cloud-resume-challenge/actions/workflows/azure-static-web-apps-black-sky-08599bc03.yml/badge.svg)](https://github.com/Madisengm/cloud-resume-challenge/actions)
[![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?logo=microsoftazure&logoColor=white)](https://black-sky-08599bc03.7.azurestaticapps.net)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azurefunctions&logoColor=white)](https://learn.microsoft.com/en-us/azure/azure-functions)
[![Cosmos DB](https://img.shields.io/badge/Cosmos_DB-NoSQL-0078D4?logo=microsoftazure&logoColor=white)](https://learn.microsoft.com/en-us/azure/cosmos-db)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Cypress](https://img.shields.io/badge/Cypress-E2E_Tests-17202C?logo=cypress&logoColor=white)](https://cypress.io)
[![Application Insights](https://img.shields.io/badge/Application_Insights-Monitoring-0078D4?logo=microsoftazure&logoColor=white)](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview)

> A fully serverless, cloud-native resume — built as part of the [Cloud Resume Challenge](https://cloudresumechallenge.dev) by Forrest Brazeal.

**Live site:** [https://black-sky-08599bc03.7.azurestaticapps.net](https://black-sky-08599bc03.7.azurestaticapps.net)

---

## Architecture

```
Browser
  │
  │  HTTPS
  ▼
Azure Static Web Apps
  ├── Angular 17+ Frontend         (standalone components, signals, Tailwind CSS)
  │     └── Application Insights JS SDK (page views, exceptions, performance)
  │
  └── /api/* → Azure Functions v4  (Node.js, TypeScript, ES2020)
                    │  └── Application Insights (invocations, exceptions, dependencies)
                    │
                    │  point read / upsert
                    ▼
              Azure Cosmos DB       (NoSQL, partition key: /id)

GitHub Actions
  ├── Cypress E2E Tests (20 tests — must pass before deploy)
  └── Deploy to Azure Static Web Apps
```

Every `git push` to `main` triggers a GitHub Actions workflow that runs the full Cypress test suite first, then builds and deploys the Angular app and Azure Functions API — only if all tests pass.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Angular 17+ (standalone) | SPA with signals-based state |
| Styling | Tailwind CSS 3 | Utility-first responsive design |
| Backend | Azure Functions v4 (Node.js) | Serverless visitor counter API |
| Database | Azure Cosmos DB (NoSQL) | Persistent visitor count storage |
| Hosting | Azure Static Web Apps | Unified frontend + API hosting |
| Monitoring | Azure Application Insights | Frontend + backend telemetry |
| Testing | Cypress | E2E test suite (20 tests) |
| CI/CD | GitHub Actions | Test → build → deploy pipeline |
| Language | TypeScript (ES2020) | Frontend and backend |

---

## Project Structure

```
cloud-resume-challenge/
├── frontend/                          # Angular 17+ application
│   ├── cypress/
│   │   ├── e2e/
│   │   │   └── resume.cy.ts              # 20 E2E tests
│   │   └── support/
│   │       └── e2e.ts
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── services/
│   │   │   │       ├── api.service.ts            # HttpClient, visitor count endpoint
│   │   │   │       └── app-insights.service.ts   # Application Insights SDK wrapper
│   │   │   ├── shared/
│   │   │   │   └── visitor-counter/
│   │   │   │       ├── visitor-counter.component.ts
│   │   │   │       └── visitor-counter.component.html
│   │   │   ├── app.component.ts              # Root standalone component
│   │   │   ├── app.component.html            # Resume template
│   │   │   ├── app.config.ts                 # provideHttpClient, provideRouter, App Insights init
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   │   ├── environment.ts                # dev config + App Insights connection string
│   │   │   └── environment.prod.ts           # prod config
│   │   ├── styles.css                        # Tailwind + smooth scroll
│   │   └── main.ts                           # bootstrapApplication()
│   ├── cypress.config.ts                     # Cypress configuration
│   ├── proxy.conf.json                       # /api → localhost:7071 (dev only)
│   └── angular.json
│
├── api/                               # Azure Functions v4
│   ├── src/
│   │   ├── functions/
│   │   │   └── visitorCounter.ts             # GET /api/visitor-count
│   │   └── services/
│   │       └── cosmosDbService.ts            # Point read + upsert
│   ├── host.json
│   ├── local.settings.json                   # ⚠️ git-ignored — never commit
│   ├── local.settings.example.json           # safe placeholder for contributors
│   └── tsconfig.json                         # target: ES2020
│
├── staticwebapp.config.json           # SWA routing rules
└── .github/
    └── workflows/
        └── azure-static-web-apps-black-sky-08599bc03.yml  # CI/CD pipeline
```

---

## Key Technical Decisions

### Standalone Angular components
This project uses Angular 17+ standalone components instead of `NgModule`. Each component declares its own `imports`, reducing boilerplate and enabling better tree-shaking. The `AppComponent` bootstraps via `bootstrapApplication()` with a minimal `appConfig` that provides `HttpClient` and the router.

### Signals for state management
State is managed using Angular signals (`signal<T>()`) rather than `BehaviorSubject` or component properties. Signals provide fine-grained reactivity with zero boilerplate and are the idiomatic pattern in Angular 17+.

### Point reads over queries in Cosmos DB
The visitor counter uses a Cosmos DB point read (`container.item(id, partitionKey).read()`) rather than a `SELECT *` query. Point reads cost ~1 RU vs ~2.5 RU for a query and are significantly faster since they bypass the query engine entirely. The partition key is set to `/id`.

### Cypress tests gate deployment
The GitHub Actions pipeline runs all 20 Cypress E2E tests before the deploy job is allowed to run. If any test fails, the deploy is blocked. This prevents regressions from reaching the live site.

### Application Insights across the full stack
Application Insights is wired into both the Angular frontend (via the JS SDK) and the Azure Function (via the connection string env var). This gives end-to-end trace correlation — a single user visit produces linked telemetry across the browser, the Function invocation, and the Cosmos DB dependency call.

### Proxy config for local development
During development, `proxy.conf.json` forwards all `/api/*` requests from `localhost:4200` to the Azure Functions host on `localhost:7071`. This mirrors the production routing behaviour of Azure Static Web Apps without any code changes between environments.

---

## Running Locally

### Prerequisites

- Node.js 18+
- Angular CLI: `npm install -g @angular/cli`
- Azure Functions Core Tools v4: `npm install -g azure-functions-core-tools@4`

### 1. Clone the repo

```bash
git clone https://github.com/Madisengm/cloud-resume-challenge.git
cd cloud-resume-challenge
```

### 2. Configure environment variables

```bash
cd api
cp local.settings.example.json local.settings.json
```

Edit `local.settings.json` with your real values:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_DB_ENDPOINT": "https://YOUR_ACCOUNT.documents.azure.com:443/",
    "COSMOS_DB_KEY": "YOUR_PRIMARY_KEY",
    "COSMOS_DB_DATABASE": "YOUR_DATABASE_NAME",
    "COSMOS_DB_CONTAINER": "YOUR_CONTAINER_NAME",
    "APPLICATIONINSIGHTS_CONNECTION_STRING": "YOUR_CONNECTION_STRING"
  }
}
```

### 3. Start the API

```bash
cd api
npm install
npm run start
# Functions host starts on http://localhost:7071
```

### 4. Start the frontend

```bash
cd frontend
npm install
ng serve
# Angular dev server starts on http://localhost:4200
```

The Angular proxy automatically forwards `/api/*` requests to the Functions host.

---

## Testing

This project uses [Cypress](https://cypress.io) for E2E testing. The suite covers 20 tests across 5 test groups.

### Test coverage

| Group | What is tested |
|---|---|
| Home section | Heading, tagline, CTA buttons render correctly |
| About section | Section exists, heading, profile summary, profile image |
| Resume section | Education heading, work experience, Verisec entry, skill badges |
| Visitor counter | Live Views label, number resolves from API, Azure Serverless label |
| CV download | `href` points to `CV.pdf`, `download` attribute is present |

### Run tests locally

```bash
# Terminal 1 — Angular must be running first
cd frontend && ng serve

# Terminal 2 — run Cypress headlessly
cd frontend && npm run cypress:run

# Or open the Cypress UI
cd frontend && npm run cypress:open
```

### Run tests in CI

Tests run automatically on every push to `main` via GitHub Actions. The deploy job only runs if all 20 tests pass.

---

## Monitoring

This project uses [Azure Application Insights](https://learn.microsoft.com/en-us/azure/azure-monitor/app/app-insights-overview) for full-stack observability.

### What is tracked

| Layer | Telemetry collected |
|---|---|
| Angular frontend | Page views, JS exceptions, browser performance, user sessions |
| Azure Functions | Invocation count, execution duration, failures, cold starts |
| Cosmos DB | Dependency calls, read latency, failed operations |

### Architecture

The Application Insights JS SDK is initialised in `app.config.ts` via `APP_INITIALIZER`, ensuring telemetry starts before the first component renders. The `AppInsightsService` wraps the SDK and exposes `trackEvent()`, `trackException()`, and `trackPageView()` for manual instrumentation anywhere in the app.

The Azure Function is auto-instrumented via the `APPLICATIONINSIGHTS_CONNECTION_STRING` environment variable — no code changes required. All Function logs, exceptions, and Cosmos DB dependency traces are automatically correlated.

### Cost

The free tier of Azure Monitor includes 5 GB of data ingestion per month per billing account. At approximately 3 KB of telemetry per visit (page view + Function invocation + Cosmos DB dependency), the free tier supports roughly 1.6 million visits per month. A daily cap of 0.1 GB is configured in the Azure portal to guarantee zero unexpected charges.

---

## Deployment

Deployment is fully automated via GitHub Actions. Every push to `main`:

1. Runs 20 Cypress E2E tests against a local Angular dev server
2. Blocks deployment if any test fails
3. Builds the Angular app (`ng build --configuration production`)
4. Compiles the TypeScript Azure Functions (`tsc`)
5. Deploys both to Azure Static Web Apps

Environment variables are stored as Azure Static Web Apps application settings and are never committed to the repository.

To update app settings manually:

```bash
az staticwebapp appsettings set \
  --name cloud-resume-mahlatse \
  --setting-names \
    COSMOS_DB_ENDPOINT="..." \
    COSMOS_DB_KEY="..." \
    COSMOS_DB_DATABASE="..." \
    COSMOS_DB_CONTAINER="..." \
    APPLICATIONINSIGHTS_CONNECTION_STRING="..."
```

---

## API Reference

### `GET /api/visitor-count`

Increments the visitor count and returns the updated value.

**Response**
```json
{
  "count": 72
}
```

**Headers returned**
```
Cache-Control: no-store, no-cache, must-revalidate
Access-Control-Allow-Origin: <allowed origin>
Content-Type: application/json
```

**Error response**
```json
{
  "error": "Failed to access Cosmos DB"
}
```

---

## What I Learned

This project covers the following Cloud Resume Challenge requirements:

- ✅ **HTML/CSS** — Resume written in Angular with Tailwind CSS
- ✅ **Static website** — Hosted on Azure Static Web Apps
- ✅ **HTTPS** — Enforced by Azure Static Web Apps
- ✅ **DNS** — Custom domain configurable via SWA
- ✅ **JavaScript** — Angular frontend with TypeScript
- ✅ **Database** — Azure Cosmos DB (NoSQL) for visitor counter
- ✅ **API** — Azure Functions v4 REST endpoint
- ✅ **TypeScript** — Used for both frontend and backend
- ✅ **Tests** — 20 Cypress E2E tests gating every deployment
- ✅ **CI/CD** — GitHub Actions pipeline: test → build → deploy
- ✅ **Monitoring** — Azure Application Insights across frontend and backend
- ✅ **Infrastructure as Code** — `staticwebapp.config.json` defines routing rules

---

## Author

**Mahlatse Madiseng**
Frontend Engineer · Cloud Solutions Developer · Aspiring Solutions Architect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/mahlatse-madiseng/)