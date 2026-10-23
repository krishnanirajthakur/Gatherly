# Gatherly — PromptWars Evaluation Evidence Map

This document maps the challenge's judging criteria to concrete implementation and verification evidence. Update each section with real file paths, test results, and screenshots after implementation. Documentation alone is not evidence that a requirement has been met.

## 1. Code Quality

### Intended evidence
- Strict TypeScript configuration.
- Feature-oriented folder structure.
- Reusable accessible components.
- Separation between UI, persistence, deterministic business logic, and AI service.
- Lint, typecheck, and production build scripts.
- Tests for critical calculations and flows.

### Verification
- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] No known critical console errors in primary flows.
- [ ] No unexplained `any` or unsafe parsing of external responses.
- [ ] README setup instructions work from a clean clone.

Evidence to record: command output, CI run or screenshots, and relevant paths.

## 2. Security

### Intended evidence
- Firebase authorization rules or backend authorization.
- Input validation and request-size limits.
- Server-side AI access.
- Ollama not exposed as an unrestricted public service.
- Safe model-output rendering and schema validation.
- No committed secrets.
- Rate limiting and timeouts for AI requests.

### Verification
- [ ] Unauthenticated access is denied where required.
- [ ] Cross-user data access is denied.
- [ ] Firestore rules are tested.
- [ ] Invalid and oversized requests are rejected.
- [ ] Malformed model output is not persisted.
- [ ] Secret scan and dependency review completed.
- [ ] Production endpoint and CORS configuration reviewed.

Evidence to record: rule tests, API tests, and sanitized security review results.

## 3. Efficiency

### Intended evidence
- Small client bundle.
- Limited AI prompt and output sizes.
- Bounded inference time and concurrency.
- Lazy loading or route splitting where useful.
- No model weights or generated build output in Git.
- Efficient Firestore queries.

### Verification
- [ ] Production bundle size measured.
- [ ] Git repository size confirmed below 10 MB.
- [ ] AI latency measured on the actual model and hardware.
- [ ] Request limits and timeouts tested.
- [ ] Unnecessary repeated reads or generation requests reviewed.

Evidence to record: actual measurements and the method used.

## 4. Testing

### Intended evidence
- Unit tests for budget calculations and validation.
- Component tests for event and task workflows.
- Integration tests for persistence and AI error cases.
- End-to-end tests for a representative planning journey.
- Security and accessibility checks.

### Verification
- [ ] Unit/component tests pass.
- [ ] Production build passes.
- [ ] AI unavailable and invalid-output paths tested.
- [ ] Core event creation and update paths tested.
- [ ] At least one full end-to-end journey tested.
- [ ] Failures are documented honestly.

Evidence to record: test commands, counts, reports, and known gaps.

## 5. Accessibility

### Intended evidence
- Semantic structure and labeled controls.
- Keyboard-accessible navigation and dialogs.
- Visible focus states.
- Error messages associated with fields.
- Status text that does not depend on color alone.
- Responsive mobile layouts and reduced-motion support.

### Verification
- [ ] Keyboard-only primary journey works.
- [ ] Contrast checked.
- [ ] Zoom and mobile viewport checked.
- [ ] Automated accessibility scan run.
- [ ] Manual review of dynamic status messages performed.

Evidence to record: scan output, screenshots, and manual test notes.

## 6. Problem Statement Alignment

### Intended evidence
The application must demonstrably help organize weddings, birthdays, and community events with:
- Budgets and expense tracking.
- Timelines and deadlines.
- Vendor checklists.
- Personalized AI ideas.
- A usable event workspace.

### Verification
- [ ] Demo includes at least one wedding scenario.
- [ ] Demo includes a birthday or community-event scenario.
- [ ] AI produces structured ideas based on event context.
- [ ] User can review and save suggestions.
- [ ] Saved suggestions become editable tasks, milestones, or budget items.
- [ ] Budget totals are calculated by application code.
- [ ] The application remains useful if AI is unavailable.

Evidence to record: deployed URLs, screenshots, and a concise demo recording.

## 7. Final evidence table

| Criterion | Evidence link/path | Status | Notes |
|---|---|---|---|
| Code quality | To be added | Not verified | |
| Security | To be added | Not verified | |
| Efficiency | To be added | Not verified | |
| Testing | To be added | Not verified | |
| Accessibility | To be added | Not verified | |
| Problem alignment | To be added | Not verified | |

Do not mark a criterion "Pass" until evidence exists and has been reviewed.
