const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const apiRoutes = require('./routes/api');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

// ====================================
// Middleware global
// ====================================
app.use(cors());
app.use(express.json());

// ====================================
// Middleware de log des requêtes (temps réel)
// ====================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});


// ====================================
// Routes
// ====================================
app.use('/api', apiRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: Date.now(),
    uptime: process.uptime(),
  });
});

// Route racine
app.get('/', (req, res) => {
  res.json({
    name: 'LiteFlow Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /api/cpu',
      'GET /api/memory',
      'GET /api/disk',
      'GET /api/network',
      'GET /api/system-info',
      'GET /api/processes?limit=10',
      'GET /api/dashboard',
      'GET /health',
    ],
  });
});



// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====================================
// Démarrage du serveur
// ====================================
app.listen(config.PORT, config.HOST, () => {
  console.log('\n ====================================');
  console.log('   LiteFlow Backend API démarré !');
  console.log('====================================');
});


// ====================================
// Gestion des erreurs 404
// ====================================
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint non trouvé',
    path: req.path,
  });
});

// ====================================
// Gestion arrêt propre
// ====================================
process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  process.exit(0);
});
