# Playwright E2E Automation (TypeScript)

## Overview
This repository contains an end-to-end (E2E) UI automation suite built with **Playwright + TypeScript**.
Main focus:
- Smoke coverage for landing/rooms list
- Core flow: booking (happy path)

## Tech stack
- Node.js (LTS recommended)
- Playwright Test
- TypeScript


## Setup

### 1) Install dependencies
npm install

### 2) Install Playwright browsers
npx playwright install

### 3) Configure environment variables
Create a `.env` file based on `.env.example`.

Example `.env.exa
BASE_URL=https://automation.testathon.hu/

## Running tests

### Run all tests
npx playwright test

### Run smoke tests only
npx playwright test tests/smoke

### Run in UI mode
npx playwright test --ui

### Debug a single test
npx playwright test tests/booking/booking-happy.spec.ts --debug

### View HTML report
npx playwright show-report

## Test design principles
- Prefer stable locators:
  - `page.getByRole(...)`
  - `page.getByTestId(...)`
- Avoid hard waits (`waitForTimeout`) unless absolutely necessary
- Use unique test data to reduce collisions
- Keep specs short and readable; reuse in Page Objects

Then run:
- npm ci
- npx playwright install --with-deps
- npx playwright test

## Notes / Known limitations
- Suite assumes at least one room is available on landing page
- Admin room cleanup depends on whether the app provides a delete function
