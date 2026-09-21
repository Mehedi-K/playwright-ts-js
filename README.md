# Playwright TS/JS Test Automation

[![CI](https://github.com/Mehedi-K/playwright-ts-js/actions/workflows/ci.yml/badge.svg)](https://github.com/Mehedi-K/playwright-ts-js/actions/workflows/ci.yml)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)

A test automation portfolio project built with [Playwright Test](https://playwright.dev/). It covers both **UI end-to-end testing** with the Page Object Model and **REST API testing**, written primarily in TypeScript with a couple of plain JavaScript specs included to show Playwright Test runs `.ts` and `.js` files side by side without any extra configuration.

## What's tested

- **UI** — [saucedemo.com](https://www.saucedemo.com/), a demo e-commerce site: login (valid, invalid, and locked-out users), product sorting, cart management, and the full checkout flow.
- **API** — [reqres.in](https://reqres.in/api), a public fake REST API: `GET /users`, `GET /users/{id}`, `POST /users`, `PUT /users/{id}`, and `DELETE /users/{id}`, asserting status codes and response bodies via Playwright's `request` fixture.

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (20 LTS recommended)
- npm

## Setup

```bash
npm install
npx playwright install
```

If you only need Chromium (the browser CI runs against), you can install just that:

```bash
npx playwright install chromium
```

## Running the tests

Run the full suite (all projects: Chromium, Firefox, WebKit):

```bash
npx playwright test
```

Run against Chromium only:

```bash
npx playwright test --project=chromium
```

Run a subset:

```bash
npx playwright test tests/ui        # UI specs only
npx playwright test tests/api       # API specs only
npx playwright test tests-js        # plain JavaScript specs only
```

Run headed, for watching the browser:

```bash
npx playwright test --headed
```

## Viewing the HTML report

After a run, Playwright generates an HTML report:

```bash
npx playwright show-report
```

## Project structure

```
playwright-ts-js/
  playwright.config.ts      # baseURL, projects (chromium/firefox/webkit), reporter config
  tsconfig.json              # TypeScript config for the pages/ and tests/ (TS) folders
  pages/                      # Page Object Model classes
    LoginPage.ts
    ProductsPage.ts
    CartPage.ts
    CheckoutPage.ts
  tests/
    ui/                       # TypeScript UI specs (saucedemo.com), built on the POM classes
      login.spec.ts
      sorting.spec.ts
      cart.spec.ts
      checkout.spec.ts
    api/                      # TypeScript API specs (reqres.in), using the `request` fixture
      users.spec.ts
  tests-js/                   # Plain JavaScript specs — no TypeScript, no POM classes,
    smoke.spec.js              # demonstrating Playwright Test works with vanilla JS too
  .github/workflows/ci.yml    # GitHub Actions workflow
```

### Page Object Model

The UI suite follows the Page Object Model pattern: each page of the app (`LoginPage`, `ProductsPage`, `CartPage`, `CheckoutPage`) is a small class wrapping `page` with locators and actions, constructed fresh in each test. Locators prefer Playwright's `getByTestId(...)`, matching saucedemo.com's `data-test` attributes, so tests rely on Playwright's built-in auto-waiting instead of manual waits or sleeps.

### TypeScript + JavaScript side by side

Playwright Test natively supports mixing `.ts` and `.js` spec files in the same run — no separate build step or transpilation config is required. `tests/` and `pages/` are TypeScript (checked by `tsconfig.json`); `tests-js/` contains plain `.js` specs that `require('@playwright/test')` directly, showing the same site can be exercised without any TypeScript tooling.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on every push and pull request to `main`: it installs dependencies with `npm ci`, installs the Chromium browser (`npx playwright install --with-deps chromium`), runs the suite against Chromium, and uploads the `playwright-report/` directory as a build artifact (even when tests fail).

## Notes on the targets under test

- **saucedemo.com** is a public Sauce Labs demo app used for practicing UI automation. Standard credentials: `standard_user` / `secret_sauce`; the `locked_out_user` account (same password) is used to exercise the error path.
- **reqres.in** is a public fake REST API for practicing API automation. As of writing, its `/api/users` endpoints respond without requiring an API key; the spec sends a placeholder `x-api-key` header regardless so the suite keeps working if the anonymous tier is ever restricted.
