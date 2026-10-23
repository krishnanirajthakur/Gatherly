const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
}));
app.use(express.json());

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    providers: {
      gemini: !!process.env.GEMINI_API_KEY,
      groq: !!process.env.GROQ_API_KEY,
      ollama: !!process.env.OLLAMA_BASE_URL,
    },
  });
});

// AI Plan generation proxy endpoint
app.post('/api/plan', async (req, res) => {
  const { provider, request } = req.body;
  if (!request) {
    return res.status(400).json({ message: 'Plan request body is required.' });
  }

  // If a provider API key isn't configured, instruct client to use fallback/demo mode
  return res.status(503).json({
    message: `Provider '${provider}' is not configured on the server. Using demo mode fallback.`,
    retryable: true,
  });
});

app.listen(PORT, () => {
  console.log(`Gatherly server running on port ${PORT}`);
});
