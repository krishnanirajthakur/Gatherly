# Contributing to Gatherly

Thank you for helping improve Gatherly.

## Development principles

- Keep changes focused on the event-planning problem.
- Preserve the solid orange, white, and neutral visual system.
- Prefer accessible, semantic controls.
- Keep budget calculations deterministic.
- Treat AI output as untrusted draft content.
- Do not add paid services or dependencies without documenting the trade-off.
- Do not add secrets or real personal data.

## Workflow

1. Create a focused branch.
2. Make the smallest coherent change.
3. Update or add tests.
4. Run lint, typecheck, tests, and production build.
5. Update documentation to match the behavior.
6. Review accessibility, security, and responsive states.
7. Check repository size and tracked files before committing.

## Coding conventions

- Use TypeScript types for application and API data.
- Validate external data at runtime.
- Keep Firebase and AI service calls out of presentation-only components.
- Use clear error states.
- Avoid hidden side effects in rendering.
- Use stable identifiers for saved records.
- Do not trust client-provided ownership fields.

## Pull request checklist

- [ ] Purpose and user impact are clear.
- [ ] Tests are included or the reason for not adding them is explained.
- [ ] Accessibility reviewed.
- [ ] Security implications reviewed.
- [ ] Documentation updated.
- [ ] No secrets, model weights, or personal data included.
- [ ] Repository remains within size constraints.
