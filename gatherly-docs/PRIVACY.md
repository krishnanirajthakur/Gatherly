# Gatherly — Privacy Notes

## 1. Scope

Gatherly may handle event dates, locations, budgets, vendor details, and guest information. Guest records may include personal information and optional dietary or accessibility notes. Such information should be treated carefully.

## 2. Data minimization

- Collect only information needed for event planning.
- Make optional fields genuinely optional.
- Avoid collecting sensitive guest details unless a feature requires them.
- Do not send guest-level records to the AI model when aggregate data is sufficient.
- Do not include real personal information in public demo fixtures or screenshots.

## 3. AI processing disclosure

The application must state where AI processing happens:
- Local Ollama inference on the user's machine; or
- A separately hosted inference service.

If prompts leave the user's device, explain that the submitted planning context is sent to that service. Do not claim that data stays local when a remote backend is used.

## 4. Access and retention

- Restrict saved event data to authorized users.
- Document how users can delete events and associated records.
- Document any logs and their retention.
- Avoid logging full prompts, guest records, or vendor contact details.
- Keep backups and exports under appropriate access controls.

## 5. User control

Users should be able to review AI suggestions before saving them. Where implemented, users should be able to edit and delete saved planning records and export their data.

## 6. Transparency

This file is a development privacy plan, not a legal privacy policy. Before public release, provide a user-facing privacy notice that accurately describes actual data collection, storage, AI processing, retention, and contact information. Do not publish placeholder legal claims as if they were reviewed by counsel.
