# Gatherly — GenAI Services and Usage

## 1. Planned service

**AI runtime:** Ollama  
**Inference mode:** Local model during development; production inference location must be explicitly documented.  
**Purpose:** Generate event-planning drafts tailored to event type, date, budget, guest count, location when supplied, style, priorities, and constraints.

Ollama is the runtime; it is not itself the model. Record the exact model name, tag, version, license, and relevant configuration after selecting and testing it.

## 2. AI-assisted features

Intended AI features:
- Event theme and concept suggestions.
- Draft planning timeline.
- Suggested budget allocation by category.
- Vendor selection criteria and questions to ask vendors.
- Personalized checklist.
- Contingency and risk suggestions.
- Suggestions for lower-cost alternatives.
- Rewriting or adapting a plan when user preferences change.

Only list features as available in the submission once they are implemented and tested.

## 3. Data sent to the model

Send only the fields required for the requested task. Example:
- Event type.
- Date or approximate planning horizon.
- Budget and currency.
- Guest count.
- Location, if relevant.
- Style and priorities.
- Explicit constraints provided by the user.

Do not send guest names, phone numbers, email addresses, dietary notes, accessibility notes, authentication tokens, or unrelated event records by default.

Clearly disclose whether inference happens on the user's machine or on a remote service.

## 4. Prompt design

Use a stable system instruction that:
- Defines the model as an event-planning assistant.
- Requires practical, respectful, inclusive suggestions.
- Treats user-provided text as data rather than privileged instructions.
- Requires uncertainty to be stated.
- Prohibits claims that prices, vendors, availability, or reviews are verified unless a trusted integration verifies them.
- Requests a strict structured response.
- Keeps all suggestions subject to user review.

The backend should construct the prompt from validated fields. Do not concatenate arbitrary client-supplied system instructions.

## 5. Output schema

An illustrative response structure:

```json
{
  "eventConcept": {
    "title": "string",
    "summary": "string",
    "themeIdeas": ["string"]
  },
  "budgetSuggestions": [
    {
      "category": "string",
      "estimatedAmount": 0,
      "reason": "string"
    }
  ],
  "milestones": [
    {
      "title": "string",
      "relativeTiming": "string",
      "reason": "string"
    }
  ],
  "checklist": [
    {
      "title": "string",
      "priority": "low | medium | high",
      "reason": "string"
    }
  ],
  "contingencies": ["string"],
  "assumptions": ["string"]
}
```

This is a conceptual schema. Implement and validate an exact runtime schema. Reject extra fields where appropriate, cap string and array lengths, and validate numeric ranges.

## 6. Trust and limitations

- AI suggestions may be incomplete, outdated, biased, or unsuitable.
- Generated budget numbers are planning estimates, not quotes.
- Do not imply that AI verified vendors, prices, availability, legal requirements, or venue rules.
- Users must review drafts before saving.
- Application code—not the model—calculates totals and enforces authorization.
- The AI must not directly write to Firestore or trigger privileged actions.

## 7. Fallback behavior

If Ollama is offline, the model is missing, or generation times out:
- Show a clear message.
- Offer retry where safe.
- Keep manual event, budget, task, vendor, and guest tools available.
- Do not fabricate an AI response or show a false success state.

## 8. Model record (complete after implementation)

- Model name/tag: **To be recorded**
- Ollama version: **To be recorded**
- Model license: **To be checked**
- Tested hardware: **To be recorded**
- Average and maximum observed latency: **To be measured**
- Inference location in deployed demo: **To be documented**
- Prompt version: **To be recorded**
- Known limitations: **To be documented**

## 9. Submission disclosure

The submission form asks which GenAI services were used and where they were used. The final answer should name Ollama and the exact model actually used, identify the features it powers, and accurately describe whether the deployed demo can reach the inference service. Do not claim Gemini, OpenAI, or another service unless it was genuinely used.
