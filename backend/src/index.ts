import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import config from './config/firebase';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

// Import routes
import shopRoutes from './routes/shop';
import productRoutes from './routes/product';
import saleRoutes from './routes/sale';
import customerRoutes from './routes/customer';
import supplierRoutes from './routes/supplier';
import udharRoutes from './routes/udhar';
import stockRoutes from './routes/stock';
import reportRoutes from './routes/report';
import syncRoutes from './routes/sync';

const app: Application = express();

// Middleware
app.use(helmet()); // Security headers
app.use(compression()); // Compress responses
app.use(cors({
  origin: config.allowedOrigins,
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined')); // Logging

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Smart Pasal API is running',
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/shops', shopRoutes);
app.use('/api/shops', productRoutes);
app.use('/api/shops', saleRoutes);
app.use('/api/shops', customerRoutes);
app.use('/api/shops', supplierRoutes);
app.use('/api/shops', udharRoutes);
app.use('/api/shops', stockRoutes);
app.use('/api/shops', reportRoutes);
app.use('/api/shops', syncRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║                                                   ║
║        🏪 Smart Pasal API Server                  ║
║                                                   ║
║        Environment: ${config.nodeEnv.padEnd(31)}║
║        Port: ${PORT.toString().padEnd(38)}║
║                                                   ║
║        Status: ✅ Running                         ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

export default app;
