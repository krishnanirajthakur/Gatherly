const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// AI Provider configurations
const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let ollamaAvailable = false;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    const check = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    ollamaAvailable = check.ok;
  } catch {
    ollamaAvailable = false;
  }

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      groq: !!GROQ_API_KEY,
      gemini: !!process.env.GEMINI_API_KEY,
      ollama: ollamaAvailable,
    },
    activeGroqModel: GROQ_MODEL,
    activeOllamaModel: OLLAMA_MODEL,
  });
});

function buildPlannerPrompt(request) {
  return `You are an expert AI event planning assistant for Gatherly.
Generate an event plan in strictly valid JSON format matching this schema:
{
  "overview": "Summary of the event concept and approach",
  "assumptions": ["assumption 1", "assumption 2"],
  "themeIdeas": ["theme 1", "theme 2", "theme 3"],
  "budgetAllocations": [
    { "category": "Venue", "percentage": 25, "estimatedAmount": 50000, "description": "Venue rental" },
    { "category": "Catering", "percentage": 30, "estimatedAmount": 60000, "description": "Food & beverage" },
    { "category": "Decoration", "percentage": 15, "estimatedAmount": 30000, "description": "Floral & ambient decor" }
  ],
  "timeline": [
    { "weeksBefore": 8, "title": "Initial Planning", "description": "Book core vendors", "tasks": ["Task 1", "Task 2"] }
  ],
  "tasks": [
    { "title": "Book Venue", "description": "Inspect and confirm venue", "weeksBefore": 8, "priority": "urgent", "category": "Venue" },
    { "title": "Finalize Menu", "description": "Tasting and contract", "weeksBefore": 6, "priority": "high", "category": "Catering" }
  ],
  "vendorSuggestions": [
    { "category": "venue", "description": "Indoor banquet hall", "selectionCriteria": ["Capacity"], "questionsToAsk": ["Curfew timings?"], "budgetGuidance": "25% of total budget" }
  ],
  "guestExperienceTips": ["Welcome drinks on arrival", "Photo booth area"],
  "contingencyNotes": ["Keep indoor backup space in case of rain"],
  "sustainabilityTips": ["Digital invites to save paper", "Biodegradable tableware"]
}

Event Details:
- Name: ${request.eventName}
- Type: ${request.eventType}
- Start Date: ${request.startDate}
- Guests: ${request.guestCount}
- Budget: ${request.budget} ${request.currency}
- Location: ${request.location || 'Local venue'}
- Style/Preferences: ${request.preferences?.style || 'Standard'}

Return ONLY valid raw JSON with no Markdown backticks or additional text.`;
}

// AI Plan generation proxy endpoint
app.post('/api/plan', async (req, res) => {
  const { provider = 'groq', request } = req.body;
  if (!request) {
    return res.status(400).json({ message: 'Plan request body is required.' });
  }

  // 1. Groq Cloud AI Integration (OpenAI-compatible endpoint)
  if (provider === 'groq' && GROQ_API_KEY) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [
            { role: 'system', content: 'You are an AI planner. Respond exclusively with valid JSON matching the user schema.' },
            { role: 'user', content: buildPlannerPrompt(request) }
          ],
          response_format: { type: 'json_object' },
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error: ${response.status} ${errText}`);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content || '{}';
      const parsed = JSON.parse(content);

      return res.json({
        ...parsed,
        providerId: `Groq (${GROQ_MODEL})`,
        generatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.error('Groq generation error:', err.message);
      // Fall through to Ollama or demo mode
    }
  }

  // 2. Ollama Local Provider
  if (provider === 'ollama' || provider === 'groq') {
    try {
      const prompt = buildPlannerPrompt(request);
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt,
          stream: false,
          format: 'json',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const parsedPlan = JSON.parse(data.response);
        return res.json({
          ...parsedPlan,
          providerId: `Ollama (${OLLAMA_MODEL})`,
          generatedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn('Ollama not reachable, falling back to demo mode:', err.message);
    }
  }

  // 3. Fallback instruction
  return res.status(503).json({
    message: `External AI providers not reachable or unconfigured. Falling back to built-in deterministic demo provider.`,
    retryable: true,
  });
});

app.listen(PORT, () => {
  console.log(`Gatherly server running on port ${PORT}`);
  console.log(`Groq AI: ${GROQ_API_KEY ? 'Configured (' + GROQ_MODEL + ')' : 'No API key set (Set GROQ_API_KEY env var)'}`);
  console.log(`Ollama: ${OLLAMA_BASE_URL} (Model: ${OLLAMA_MODEL})`);
});
