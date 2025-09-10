import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/config';
import { errorHandler, notFound } from './middlewares/errorHandler';

// Route imports
import authRoutes from './routes/auth';
import modelRoutes from './routes/models';
import requirementRoutes from './routes/requirements';
import linkRoutes from './routes/links';
import shareRoutes from './routes/share';
import exportImportRoutes from './routes/exportImport';
import blockRoutes from './routes/blocks';
import diagramRoutes from './routes/diagrams';

const app = express();

// Security middlewares
app.use(helmet());
app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/models', modelRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/links', linkRoutes);
app.use('/api/blocks', blockRoutes);
app.use('/api/diagrams', diagramRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/export', exportImportRoutes);
app.use('/api/import', exportImportRoutes);

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.nodeEnv}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
});

export default app;
// trigger restart 
 
