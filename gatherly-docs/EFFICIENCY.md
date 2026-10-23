# Gatherly — Efficiency and Performance

## 1. Objectives

Keep the app responsive, reduce unnecessary network requests, limit AI inference costs and latency, and keep the public repository below the PromptWars limit of 10 MB.

## 2. Frontend performance

- Use route-level code splitting where it materially reduces initial load.
- Avoid large UI dependencies when native or smaller alternatives suffice.
- Lazy-load noncritical views and images.
- Use stable keys and avoid unnecessary re-renders.
- Paginate or virtualize long guest/vendor/task lists only when needed.
- Debounce search input where it triggers expensive work.
- Avoid polling for data that can be updated through existing state or supported listeners.
- Provide loading skeletons only when they improve perceived performance.
- Keep animations subtle and inexpensive.
- Measure the production build instead of guessing.

## 3. AI inference efficiency

- Choose a model that fits the target machine's memory and latency constraints.
- Record the exact Ollama model tag and version in `AI_USAGE.md`.
- Send only fields relevant to the requested planning task.
- Avoid sending the full event database for a small request.
- Limit prompt size, output length, and generation time.
- Use structured output to reduce rework and parsing errors.
- Avoid repeated automatic regeneration loops.
- Cache only where safe and appropriate; do not share private event output across users.
- Show a clear timeout and retry path.
- Keep manual planning features available if inference is slow or unavailable.

## 4. Backend efficiency

- Enforce request body limits.
- Set connection and generation timeouts.
- Limit concurrent model requests to available capacity.
- Return compact error responses.
- Avoid logging large prompts or generated plans.
- Reuse server-side clients where appropriate.
- Use pagination for list endpoints.
- Avoid unbounded queries and broad Firestore reads.

## 5. Data efficiency

- Store only necessary fields.
- Use server timestamps or a consistent date strategy.
- Avoid duplicating actual expense totals if they can be derived reliably; if cached, define how they stay consistent.
- Query only the records needed for the current view.
- Review Firestore reads/writes and index requirements.
- Do not store model weights, build output, `node_modules`, or local databases in Git.

## 6. Repository size budget

The public repository must remain below 10 MB. Keep a safety margin; aim for a Git repository comfortably below the limit rather than targeting 9.9 MB.

Exclude at minimum:
- `node_modules/`
- `dist/`
- `.firebase/`
- `.env` and private environment files
- Ollama model weights
- local databases and cache folders
- Playwright/browser binaries
- logs and coverage output unless deliberately required

Use `.gitignore` and inspect tracked file sizes before submission. Remember that removing a large file from the latest commit may not remove it from Git history.

## 7. Measurement plan

Record actual measurements after implementation:
- Production bundle size.
- Initial route load behavior.
- AI response latency on the tested machine/model.
- Request and response sizes.
- Time to complete the main event-creation flow.
- Test execution time.
- Git repository size.

Do not invent benchmark numbers. Report device, model, environment, and method alongside results.
