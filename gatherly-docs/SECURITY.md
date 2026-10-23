# Gatherly — Security Plan

## 1. Security objectives

Protect user event information, prevent unauthorized access and abuse, avoid secret leakage, and ensure AI output cannot execute code or silently change user data.

This document is a security plan, not a certification or a claim that the application has passed an audit.

## 2. Threat model

Assets:
- Event details, locations, budgets, and dates.
- Guest names and contact details.
- Dietary and accessibility notes.
- Vendor contact details and quotes.
- Authentication state and user identifiers.
- Server environment variables and credentials.
- AI prompts and generated content.

Threats:
- Unauthorized access to another user's events.
- Weak or missing Firestore rules.
- Secret leakage in Git history or client bundles.
- Prompt injection or malicious text in user-supplied fields.
- Malformed or adversarial model output.
- Denial of service through large prompts or repeated AI calls.
- Cross-site scripting through rendered AI output.
- Insecure CORS configuration or exposed Ollama service.
- Accidental logging of personal information.

## 3. Authentication and authorization

- Require authentication for private saved data.
- Verify ownership for every read, update, and delete.
- Enforce access rules on the server or in Firestore Security Rules, not just in the UI.
- Deny access by default.
- Test cross-user access attempts.
- Do not use user-supplied `ownerId` as proof of ownership.
- Restrict administrative access and service-account permissions.

## 4. Firebase

- Use restrictive Firestore Security Rules.
- Require authentication for private documents.
- Validate expected fields and types in rules where feasible.
- Limit users to records they own.
- Test rules using the Firebase Emulator Suite when practical.
- Do not deploy permissive rules such as unrestricted reads and writes.
- Do not commit service-account JSON files.
- Consider App Check for supported production surfaces, while recognizing it does not replace authorization.

## 5. Ollama and backend

- Do not expose Ollama directly to the public internet.
- Put a backend API between browser clients and inference.
- Keep model endpoint configuration server-side.
- Set request body limits, generation limits, timeouts, and concurrency limits.
- Add rate limiting and abuse monitoring to AI endpoints.
- Restrict CORS to the intended origins in production.
- Use HTTPS for public service traffic.
- Do not return stack traces, internal hostnames, prompts containing secrets, or environment variables to clients.

## 6. Prompt injection and model output

- Treat user-provided event details as untrusted data.
- Use a fixed system instruction and structured input fields.
- Never let the model decide authorization, access control, or whether a database operation is permitted.
- Never execute generated code, shell commands, SQL, or HTML.
- Validate generated JSON against a schema and enforce field/length limits.
- Render model output as text or safely sanitized Markdown.
- Do not automatically persist a generated plan without explicit user confirmation.
- Include safe handling for refusals, malformed output, and unexpected content.

## 7. Privacy and data minimization

- Send only the context required for the requested planning task.
- Prefer aggregate guest counts over guest records.
- Avoid sending names, email addresses, phone numbers, dietary notes, or accessibility notes to AI by default.
- Explain whether AI processing occurs locally or on a remote server.
- Do not log full prompts or model responses by default.
- Establish retention and deletion behavior.
- Use fictional sample data in public screenshots and demos.

## 8. Input validation

Validate:
- Required fields and allowed event types.
- Date formats and reasonable date ranges.
- Non-negative integer guest counts.
- Finite, non-negative monetary amounts.
- Maximum string lengths.
- Allowed enum values for statuses and priorities.
- Request body size and nested object depth.
- Model output fields and array lengths.

Do not rely only on HTML input attributes; repeat validation at the trusted API or persistence boundary.

## 9. XSS and output safety

- Prefer normal React text rendering.
- Do not use `dangerouslySetInnerHTML` for model output.
- If Markdown rendering is implemented, disable raw HTML and sanitize output with a maintained sanitizer.
- Avoid building links from untrusted text without validating protocols.
- Do not allow AI-generated content to control application routes or execute actions.

## 10. Secrets and repository hygiene

- Commit `.env.example`, not `.env`.
- Keep private keys, tokens, service-account files, and credentials out of the repository.
- Add secret files and generated output to `.gitignore`.
- Scan the repository and Git history before public release.
- If a secret is committed, revoke/rotate it; deleting the visible file alone is insufficient.

## 11. Security verification checklist

- [ ] Unauthenticated users cannot read private event data.
- [ ] User A cannot read or modify User B's event.
- [ ] Firestore rules are not open to the public.
- [ ] API request size and output length are limited.
- [ ] AI endpoint has timeout and rate limit controls.
- [ ] Ollama is not exposed as an unrestricted public service.
- [ ] AI output is validated and rendered safely.
- [ ] Errors do not expose stack traces or secrets.
- [ ] No secrets or personal data are committed.
- [ ] Dependency audit is reviewed and relevant issues are addressed.
- [ ] Production CORS and HTTPS configuration are checked.

## 12. Incident response

If credentials or private data are exposed:
1. Disable or revoke the affected credential.
2. Rotate dependent credentials.
3. Review logs and repository history.
4. Assess what data may have been accessed.
5. Fix the root cause and add a regression test.
6. Document the incident and any required user notification.
