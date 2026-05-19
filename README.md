# ☁️ Cloud Resume Challenge — Mahlatse Madiseng

[![Deploy to Azure Static Web Apps](https://github.com/Madisengm/cloud-resume-challenge/actions/workflows/azure-static-web-apps-black-sky-08599bc03.yml/badge.svg)](https://github.com/Madisengm/cloud-resume-challenge/actions)
[![Azure](https://img.shields.io/badge/Azure-Static_Web_Apps-0078D4?logo=microsoftazure&logoColor=white)](https://black-sky-08599bc03.7.azurestaticapps.net)
[![Angular](https://img.shields.io/badge/Angular-17+-DD0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Azure Functions](https://img.shields.io/badge/Azure_Functions-v4-0062AD?logo=azurefunctions&logoColor=white)](https://learn.microsoft.com/en-us/azure/azure-functions)
[![Cosmos DB](https://img.shields.io/badge/Cosmos_DB-NoSQL-0078D4?logo=microsoftazure&logoColor=white)](https://learn.microsoft.com/en-us/azure/cosmos-db)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

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
  │
  └── /api/* → Azure Functions v4  (Node.js, TypeScript, ES2020)
                    │
                    │  point read / upsert
                    ▼
              Azure Cosmos DB       (NoSQL, partition key: /id)
```

Every `git push` to `main` triggers a GitHub Actions workflow that builds the Angular app and deploys both the static frontend and the Azure Function API to Azure Static Web Apps in a single pipeline.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Angular 17+ (standalone) | SPA with signals-based state |
| Styling | Tailwind CSS 3 | Utility-first responsive design |
| Backend | Azure Functions v4 (Node.js) | Serverless visitor counter API |
| Database | Azure Cosmos DB (NoSQL) | Persistent visitor count storage |
| Hosting | Azure Static Web Apps | Unified frontend + API hosting |
| CI/CD | GitHub Actions | Automated build and deployment |
| Language | TypeScript (ES2020) | Frontend and backend |

---

## Project Structure

```
cloud-resume-challenge/
├── frontend/                          # Angular 17+ application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   └── services/
│   │   │   │       └── api.service.ts        # HttpClient, visitor count endpoint
│   │   │   ├── shared/
│   │   │   │   └── visitor-counter/
│   │   │   │       ├── visitor-counter.component.ts
│   │   │   │       └── visitor-counter.component.html
│   │   │   ├── app.component.ts              # Root standalone component
│   │   │   ├── app.component.html            # Resume template
│   │   │   ├── app.config.ts                 # provideHttpClient, provideRouter
│   │   │   └── app.routes.ts
│   │   ├── styles.css                        # Tailwind + smooth scroll
│   │   └── main.ts                           # bootstrapApplication()
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
│   └── tsconfig.json                         # target: ES2020
│
└── staticwebapp.config.json           # SWA routing rules
```

---

## Key Technical Decisions

### Standalone Angular components
This project uses Angular 17+ standalone components instead of `NgModule`. Each component declares its own `imports`, reducing boilerplate and enabling better tree-shaking. The `AppComponent` bootstraps via `bootstrapApplication()` with a minimal `appConfig` that provides `HttpClient` and the router.

### Signals for state management
State is managed using Angular signals (`signal<T>()`) rather than `BehaviorSubject` or component properties. Signals provide fine-grained reactivity with zero boilerplate and are the idiomatic pattern in Angular 17+.

### Point reads over queries in Cosmos DB
The visitor counter uses a Cosmos DB point read (`container.item(id, partitionKey).read()`) rather than a `SELECT *` query. Point reads cost ~1 RU vs ~2.5 RU for a query and are significantly faster since they bypass the query engine entirely. The partition key is set to `/id`.

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

Copy the example and fill in your Cosmos DB credentials:

```bash
cd api
cp local.settings.example.json local.settings.json
```

Edit `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "COSMOS_DB_ENDPOINT": "https://YOUR_ACCOUNT.documents.azure.com:443/",
    "COSMOS_DB_KEY": "YOUR_PRIMARY_KEY",
    "COSMOS_DB_DATABASE": "YOUR_DATABASE_NAME",
    "COSMOS_DB_CONTAINER": "YOUR_CONTAINER_NAME"
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

## Deployment

Deployment is fully automated via GitHub Actions. Every push to `main`:

1. Builds the Angular app (`ng build --configuration production`)
2. Compiles the TypeScript Azure Functions (`tsc`)
3. Deploys both to Azure Static Web Apps

Environment variables (`COSMOS_DB_ENDPOINT`, `COSMOS_DB_KEY`, etc.) are stored as application settings in Azure Static Web Apps and are never committed to the repository.

To deploy manually:

```bash
az staticwebapp appsettings set \
  --name cloud-resume-mahlatse \
  --setting-names \
    COSMOS_DB_ENDPOINT="..." \
    COSMOS_DB_KEY="..." \
    COSMOS_DB_DATABASE="..." \
    COSMOS_DB_CONTAINER="..."
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
- ✅ **Python/TypeScript** — TypeScript used for both frontend and backend
- ✅ **CI/CD** — GitHub Actions pipeline for automated deployments
- ✅ **Infrastructure as Code** — `staticwebapp.config.json` defines routing rules

---

## Author

**Mahlatse Madiseng**
Angular Developer · Level 2 Support Engineer · Aspiring Solutions Architect

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?logo=linkedin&logoColor=white)](https://linkedin.com/in/mahlatse-madiseng/)