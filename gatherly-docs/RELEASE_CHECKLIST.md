# Gatherly — Release and Submission Checklist

Use this before the final PromptWars submission. Check an item only after verifying it.

## Product and demo

- [ ] Dashboard shows meaningful planning information or a useful empty state.
- [ ] User can create a wedding, birthday, or community event.
- [ ] User can generate a structured plan using the configured AI path.
- [ ] AI suggestions are labeled and editable.
- [ ] User can save selected suggestions.
- [ ] Budget totals and balances are calculated by application code.
- [ ] Timelines and tasks can be reviewed and updated.
- [ ] Vendor checklist is usable.
- [ ] Guest/RSVP workflow works if included in the final scope.
- [ ] AI failure leaves manual planning usable.
- [ ] No fake verified vendors, quotes, reviews, or availability.
- [ ] Demo data is fictional.

## Code quality

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Tests pass.
- [ ] Production build passes.
- [ ] No critical console errors in primary workflows.
- [ ] Documentation matches actual implementation.

## Security and privacy

- [ ] No secrets in repository or Git history.
- [ ] Firestore rules or backend authorization are restrictive and tested.
- [ ] Cross-user access is denied.
- [ ] AI endpoint has appropriate limits and timeouts.
- [ ] Ollama is not exposed as an unrestricted public service.
- [ ] AI output is schema-validated and safely rendered.
- [ ] Privacy and AI processing disclosures are accurate.

## Accessibility and efficiency

- [ ] Keyboard-only primary workflow tested.
- [ ] Contrast and visible focus checked.
- [ ] Responsive mobile layout tested.
- [ ] Reduced motion considered.
- [ ] Production bundle measured.
- [ ] Repository size verified below 10 MB.
- [ ] No model weights, `node_modules`, build output, or secrets committed.

## Deployment and submission fields

- [ ] Public GitHub repository URL opens in a logged-out/private browser.
- [ ] Repository is public and under 10 MB.
- [ ] Deployed project URL works.
- [ ] Demo video is unlisted on YouTube or shared Drive access is enabled.
- [ ] Video demonstrates a real end-to-end workflow.
- [ ] "Changes/updates made in deployed version" describes actual implemented changes.
- [ ] GenAI services and their exact use are accurately described.
- [ ] LinkedIn post is published and the correct URL is ready.
- [ ] Final submission links and permissions are tested.

## Demo video outline

1. Introduce the event-planning problem.
2. Show the dashboard and event creation.
3. Generate a personalized plan.
4. Review and save milestones or checklist items.
5. Update budget and tasks.
6. Show vendor or guest management.
7. Demonstrate AI fallback or explain deployment constraints.
8. Briefly show security/accessibility/testing evidence.
9. State the actual model and inference mode.
