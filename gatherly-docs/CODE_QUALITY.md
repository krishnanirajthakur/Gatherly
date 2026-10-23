# Gatherly — Code Quality Standards

## 1. Principles

- Prefer readable, maintainable code over clever abstractions.
- Use TypeScript with strict settings where practical.
- Keep components small and focused.
- Separate UI, domain logic, persistence, and AI orchestration.
- Use clear names for event, budget, task, vendor, and guest concepts.
- Avoid duplicated business logic.
- Do not claim features are implemented until working code and tests exist.

## 2. Suggested project conventions

- Use feature-oriented folders.
- Keep shared primitives separate from domain-specific components.
- Put API clients and Firebase access behind service modules.
- Keep budget arithmetic in pure functions.
- Keep prompt templates and output schemas in a dedicated AI module.
- Keep environment access in a small configuration module.
- Use explicit types for API requests and responses.
- Prefer discriminated unions for state where they improve clarity.

## 3. TypeScript

- Avoid `any`; if unavoidable, explain and isolate it.
- Validate external data at runtime even when TypeScript types exist.
- Avoid unsafe type assertions for API responses.
- Handle nullable and optional fields explicitly.
- Keep strict compiler checks enabled unless a documented reason prevents it.

## 4. Error handling

- Handle expected failures at service boundaries.
- Return safe, user-friendly messages to the client.
- Keep detailed diagnostics server-side without exposing secrets or personal content.
- Do not silently swallow errors.
- Do not display a success state before persistence confirms success.
- Provide retry where retrying is safe.

## 5. UI quality

- Use semantic HTML.
- Reuse buttons, fields, dialogs, tables, and status indicators.
- Include loading, empty, error, and success states.
- Avoid nonfunctional decorative controls.
- Use consistent spacing and typography tokens.
- Ensure responsive behavior and keyboard accessibility.

## 6. AI code quality

- Isolate Ollama calls behind an adapter/interface.
- Use bounded prompts and generation settings.
- Validate model output with a runtime schema.
- Keep deterministic application decisions outside the model.
- Test with mocked model responses.
- Never execute model output.

## 7. Quality gates

Suggested scripts:
- `lint`
- `typecheck`
- `test`
- `build`
- `test:e2e` where configured

Run these before each release. Document any skipped check and why it was skipped.

## 8. Pull request or change checklist

- [ ] Change solves a specific user problem.
- [ ] Types and validation are updated.
- [ ] Loading, empty, and error states are considered.
- [ ] Accessibility is reviewed.
- [ ] Tests are added or updated.
- [ ] No secrets or private data are included.
- [ ] Documentation reflects actual behavior.
- [ ] Production build succeeds.
