# Gatherly — Deployment Guide

## 1. Deployment model

Firebase Hosting serves the frontend. It does not run Ollama or a Node.js API by itself. A deployed AI feature needs a separately deployed backend that can securely reach Ollama, or the application must explicitly operate in local-only AI mode.

## 2. Prerequisites

- Node.js LTS and npm.
- Git.
- Firebase CLI, if using Firebase Hosting.
- A Firebase project if Firebase services are used.
- Ollama installed locally for development.
- A model downloaded through Ollama.
- A separately deployable backend environment if the public demo needs remote AI inference.

## 3. Local setup

Use the actual scripts defined in `package.json` after implementation. The following is an example workflow:

```bash
npm install
cp .env.example .env
npm run dev
```

Start Ollama in accordance with its installation instructions, ensure the selected model is available, and start the backend separately if the project includes one.

Do not assume that a model name in configuration means that model has been downloaded or is running.

## 4. Environment variables

Document required variable names in `.env.example`. Typical examples may include:
- Frontend Firebase project configuration.
- Backend port.
- Ollama base URL for server-side use.
- Ollama model tag.
- Allowed frontend origin.
- Authentication or service configuration needed by the selected design.

Never put server-only secrets into `VITE_*` variables; Vite exposes those values to the browser bundle. Never commit `.env`.

## 5. Firebase Hosting

1. Install Firebase CLI.
2. Authenticate with the intended Firebase account.
3. Select the correct project.
4. Build the frontend.
5. Configure Hosting to serve the build directory and rewrite SPA routes appropriately.
6. Deploy.
7. Test direct navigation and page refresh on nested routes.

Example commands, after configuration:

```bash
npm install -g firebase-tools
firebase login
firebase use <your-project-id>
npm run build
firebase deploy --only hosting
```

Replace the placeholder with your actual project ID. Never paste credentials into source files or commit local authentication files.

## 6. Firestore and Authentication

If used:
- Enable only the authentication methods required by the app.
- Deploy restrictive Firestore rules.
- Review indexes required by actual queries.
- Test authorization with the emulator or an equivalent test setup.
- Confirm unauthenticated users cannot access private data.
- Confirm users cannot access another user's records.
- Avoid production deployment with temporary open rules.

## 7. AI backend

For a public demo:
- Deploy the backend to a suitable service.
- Configure a private or otherwise secured path to Ollama.
- Require appropriate authentication or abuse protection.
- Restrict CORS to the deployed frontend origin.
- Set request limits, timeouts, concurrency limits, and rate limits.
- Use HTTPS.
- Monitor resource use and service availability.
- Avoid exposing the Ollama port directly to arbitrary internet clients.

If no reachable AI backend is available, label the AI feature as local-only and explain how to run it. Do not describe it as fully available to all public users.

## 8. Production verification

- [ ] Frontend loads over HTTPS.
- [ ] Direct navigation and refresh work.
- [ ] Authentication works as intended.
- [ ] Firestore rules are deployed and tested.
- [ ] AI endpoint availability is accurately represented.
- [ ] AI failure does not break manual planning.
- [ ] No secret values appear in browser bundles or public Git.
- [ ] Browser console and network errors reviewed.
- [ ] Mobile and keyboard flows checked.
- [ ] Demo uses fictional data.
- [ ] Repository size remains below 10 MB.
