# Gatherly — Accessibility Plan

## 1. Target

Aim for WCAG 2.2 AA alignment. This is a design and testing target, not a certification claim.

## 2. Visual design

- Use the approved orange, white, and neutral palette with sufficient contrast.
- Check contrast for normal text, large text, controls, borders, and focus indicators.
- Do not use color as the only indicator of status.
- Pair status colors with text such as "Over budget", "Due soon", or "Completed".
- Support browser zoom and text resizing.
- Avoid clipped labels and fixed-height text containers.

## 3. Keyboard access

- All actions must be reachable without a mouse.
- Preserve a logical tab order.
- Use semantic buttons and links.
- Provide visible focus indicators.
- Dialogs must manage focus and return focus when closed.
- Menus and tabs should follow familiar keyboard behavior.
- Do not trap focus except inside modal dialogs where appropriate.
- Ensure skip navigation is available on long pages.

## 4. Forms

- Every field has a persistent programmatic label.
- Required fields are indicated in text, not only by color or an asterisk without explanation.
- Errors explain how to fix the issue.
- Associate errors with their fields.
- Preserve valid form entries when a submission fails.
- Use appropriate input types and autocomplete attributes.
- Avoid relying on placeholder text as the only label.
- Explain currency, date, and number formats.

## 5. Screen readers and dynamic updates

- Use semantic landmarks and headings in a logical hierarchy.
- Provide accessible names for icon-only controls.
- Announce save success, validation errors, and AI service failures appropriately.
- Avoid announcing every token or minor UI change during AI generation.
- Ensure charts have an equivalent text summary or data table.
- Provide meaningful empty-state descriptions.

## 6. AI-generated content

- Label AI-generated drafts clearly.
- Use headings and lists to structure long plans.
- Keep generated text readable and editable.
- Do not use motion or animated typing as the only indication that generation is happening.
- Present loading status and errors in accessible status regions.

## 7. Motion

- Avoid decorative animation.
- Respect `prefers-reduced-motion`.
- Do not use flashing content.
- Keep transitions brief and nonessential.

## 8. Touch and responsive design

- Provide adequately sized touch targets with sufficient spacing.
- Avoid hover-only interactions.
- Prevent horizontal overflow at narrow widths.
- Provide mobile alternatives to wide tables.
- Ensure dialogs fit the viewport and can scroll.
- Keep important actions available at high zoom levels.

## 9. Accessibility verification

- [ ] Complete event creation with keyboard only.
- [ ] Navigate sidebar and event tabs without a mouse.
- [ ] Verify focus visibility.
- [ ] Verify labels, descriptions, and error announcements.
- [ ] Check text and control contrast.
- [ ] Test at 200% zoom and a narrow viewport.
- [ ] Test reduced-motion preference.
- [ ] Run automated accessibility checks.
- [ ] Perform a manual screen-reader spot check.
