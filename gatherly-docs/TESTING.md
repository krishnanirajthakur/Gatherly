# Gatherly — Testing Strategy

## 1. Goals

Verify that core planning flows work, financial values are calculated correctly, access controls protect private records, AI output is handled safely, and the application remains usable when dependencies fail.

Do not report tests as passing unless they have actually been executed.

## 2. Test layers

### Static checks
- TypeScript type checking.
- ESLint.
- Formatting check, if configured.
- Production build.
- Dependency vulnerability review.

### Unit tests
- Budget calculations.
- Currency formatting.
- Date and timeline calculations.
- Input validators.
- AI response schema validation.
- Prompt construction and field allowlisting.
- Task completion and progress calculations.

### Component tests
- Event creation wizard.
- Inline validation and error messages.
- Budget editor.
- Task status controls.
- Vendor status controls.
- Guest RSVP controls.
- AI loading, success, invalid-output, timeout, and unavailable states.
- Keyboard interaction for dialogs, menus, and tabs.

### Integration tests
- Event persistence.
- Authentication and authorization.
- Firestore rules using emulator tests where practical.
- Backend AI route validation.
- Ollama adapter behavior using a mock service.
- Save selected AI suggestions as tasks or budget categories.

### End-to-end tests
- Create an event.
- Generate or load a mocked plan.
- Review and save a plan.
- Add and complete a task.
- Update a budget and record an expense.
- Add a vendor.
- Add a guest and update RSVP.
- Verify the dashboard reflects saved changes.
- Verify AI-unavailable fallback.

## 3. Essential test cases

| ID | Scenario | Expected result |
|---|---|---|
| T-01 | Create event with valid fields | Event is saved and visible |
| T-02 | Submit missing required field | Inline error; no invalid save |
| T-03 | Enter negative budget | Rejected with clear message |
| T-04 | Record expense above budget | Correct totals and visible warning |
| T-05 | Complete task | Status and progress update |
| T-06 | Invalid AI JSON | Rejected; no automatic persistence |
| T-07 | Ollama unavailable | Helpful error and manual workflow remains usable |
| T-08 | AI request exceeds size limit | Rejected safely |
| T-09 | User A requests User B's event | Access denied |
| T-10 | Model output includes HTML/script text | Displayed safely as text or sanitized |
| T-11 | Keyboard-only event creation | All required controls are operable |
| T-12 | Narrow mobile viewport | No unintended horizontal overflow |
| T-13 | Firestore write denied | Error shown; no false success |
| T-14 | Empty event list | Useful empty state is displayed |
| T-15 | Very long event name | Length limit enforced gracefully |

## 4. AI testing

AI outputs are probabilistic, so tests should prioritize structure, safety, and usefulness rather than exact wording.

- Mock the Ollama API in automated tests.
- Validate response schema, array lengths, numeric ranges, and required fields.
- Test empty, malformed, oversized, delayed, and unexpected responses.
- Test prompt-injection-like text as input and verify it cannot trigger tools or privileged actions.
- Test that generated costs are labeled estimates.
- Test that generated suggestions are not saved without user confirmation.
- Keep a small manually reviewed set of sample prompts for weddings, birthdays, and community events.
- Record the model and configuration used for any manual evaluation.

## 5. Accessibility tests

- Keyboard-only navigation.
- Visible focus states.
- Form labels and error association.
- Dialog focus management.
- Screen-reader names for icon-only buttons.
- Contrast checks.
- Reduced-motion behavior.
- Automated axe scan where available.
- Manual review at desktop and mobile widths.

Automated accessibility tools do not prove full accessibility.

## 6. Suggested scripts

Align these with the actual package scripts:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
```

If Playwright is configured:

```bash
npm run test:e2e
```

If the backend has its own package, run its lint, typecheck, and tests separately.

## 7. Test data

Use synthetic test records. Never place real guest lists, contact information, credentials, or private event details in fixtures.

## 8. Release gate

A release should not be described as ready until:
- Required automated checks have run.
- Critical failures are fixed or explicitly documented.
- Security rules have been tested.
- Main user journeys have been exercised.
- The production build succeeds.
- Known limitations are disclosed.
