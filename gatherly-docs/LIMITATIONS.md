# Gatherly — Known and Expected Limitations

This file should be updated honestly as implementation progresses.

## Known architectural constraints

- Firebase Hosting serves static frontend assets; it does not run Ollama.
- Local Ollama inference is available only while the local service and machine are available.
- A public AI experience requires a secured, reachable inference backend.
- Model output can be inaccurate or inconsistent and must be reviewed.
- Generated budget amounts are estimates, not vendor quotes.
- Vendor suggestions are not verified listings unless a trusted integration is implemented.
- AI output does not establish vendor availability, venue permissions, or legal compliance.

## Items to verify before submission

- [ ] Exact Ollama model and license.
- [ ] Public demo AI availability.
- [ ] Authentication and data persistence behavior.
- [ ] Firebase rules and access tests.
- [ ] Mobile and accessibility testing.
- [ ] Browser compatibility.
- [ ] Repository size below 10 MB.
- [ ] Actual automated test results.
- [ ] Data export and deletion behavior.
- [ ] Deployment and privacy disclosures.

## Reporting limitations

Do not hide a limitation to make the demo appear more complete. Explain what works, what is mocked, what requires local setup, and what remains planned.
