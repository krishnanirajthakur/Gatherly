# Gatherly — AI-Powered Event Planning Assistant

> Bring your plans together.

Gatherly helps people plan weddings, birthdays, anniversaries, festivals, and community events using a structured workspace for budgets, timelines, tasks, vendors, guests, and AI-generated ideas.

## Project status

This repository is the project documentation baseline for the Google PromptWars challenge. The implementation should be considered incomplete until the features described here are implemented, tested, and verified in the deployed application. Do not claim a feature is complete merely because it is documented.

## Problem

Event planning often involves scattered notes, spreadsheets, messages, and estimates. Organizers need a single place to convert an event idea into a realistic plan, track costs and deadlines, coordinate vendors, and adjust the plan when circumstances change.

## Proposed solution

Gatherly combines ordinary planning tools with a GenAI assistant. Users provide event details such as type, date, location, budget, guest count, and preferences. The assistant proposes a structured plan that users can review and selectively save as editable event data.

### Core capabilities

- Create and manage wedding, birthday, anniversary, festival, and community events.
- Generate structured event concepts, budget suggestions, timelines, and checklists.
- Track planned budget, estimated cost, actual expenses, and remaining balance.
- Create and complete tasks with due dates, priorities, and statuses.
- Track vendors, quotes, contact progress, and booking status.
- Maintain a guest list and RSVP status.
- View milestones in a calendar or agenda.
- Export or print a plan where implemented.
- Continue using manual planning features when AI is unavailable.

## Product principles

1. **AI assists; the user decides.** Generated suggestions are drafts, not verified facts.
2. **Calculations are deterministic.** Totals, balances, and budget percentages are calculated in application code.
3. **Privacy by design.** Collect only the data needed for planning and avoid sending guest details to the model unless strictly necessary and clearly disclosed.
4. **Secure by default.** Never expose secrets or an unrestricted Ollama endpoint to browsers or public networks.
5. **Accessible and responsive.** Core workflows must work with keyboard navigation, assistive technology, and mobile layouts.
6. **Honest product states.** Do not show fake vendors, quotes, reviews, AI activity, or successful saves.

## Intended technology stack

- React, TypeScript, and Vite for the client.
- A small backend API for validation and AI orchestration.
- Ollama with a locally installed model for local inference during development.
- Firebase Hosting for the static frontend.
- Firebase Authentication and Firestore only if required by the implemented scope.
- Vitest and React Testing Library for unit/component tests.
- Playwright for selected end-to-end tests.
- ESLint and TypeScript checks for code quality.

The final architecture must account for the fact that Firebase Hosting does not run Ollama. A deployed frontend needs a separately reachable inference backend, or the AI feature must be clearly marked as local-only. Do not expose Ollama directly to the public internet without a properly secured service layer.

## Quick start

Commands below are a proposed setup and must be updated to match the final repository structure.

```bash
npm install
cp .env.example .env
npm run dev
```

If the project includes a backend, install and start it using the commands documented in `DEPLOYMENT.md`. Ollama must be installed separately, and the selected model must be pulled locally.

## Environment configuration

See `.env.example` for placeholders. Never commit real API keys, service-account credentials, private Firebase configuration, or other secrets. Firebase web configuration is not a substitute for Firestore Security Rules and authorization.

## Repository structure (target)

```text
gatherly/
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   │   ├── events/
│   │   ├── planner/
│   │   ├── budget/
│   │   ├── tasks/
│   │   ├── vendors/
│   │   └── guests/
│   ├── lib/
│   ├── styles/
│   └── test/
├── server/
│   ├── routes/
│   ├── services/
│   └── test/
├── docs/
├── public/
├── .env.example
├── firebase.json
├── firestore.rules
├── firestore.indexes.json
├── README.md
└── package.json
```

This is a target structure, not a claim that every path already exists.

## Documentation

- [User and system flow](FLOW.md)
- [Architecture](ARCHITECTURE.md)
- [Security](SECURITY.md)
- [Testing](TESTING.md)
- [Accessibility](ACCESSIBILITY.md)
- [Efficiency and performance](EFFICIENCY.md)
- [Code quality](CODE_QUALITY.md)
- [Judging criteria evidence map](EVALUATION.md)
- [GenAI usage](AI_USAGE.md)
- [Deployment](DEPLOYMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Privacy](PRIVACY.md)
- [Known limitations](LIMITATIONS.md)
- [Release checklist](RELEASE_CHECKLIST.md)

## GenAI disclosure

The planned GenAI service is Ollama running a locally installed model. It is intended to generate planning suggestions and structured drafts. The exact model name, version, prompt templates, inference location, and deployed availability must be recorded in `AI_USAGE.md` after implementation. Do not claim a cloud-hosted AI service was used if the application only calls a local Ollama instance.

## Demo and sample data

Use clearly labeled fictional sample events in screenshots and demos. Do not include real personal data, credentials, private guest lists, or unverified vendor claims.

## License

An open-source license should be selected before public release. See `LICENSE` (or add one) and ensure that dependencies and assets are used in accordance with their licenses.
