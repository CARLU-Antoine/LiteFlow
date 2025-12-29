const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

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
// Middleware de log des requêtes
// ====================================
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ====================================
// Routes API
// ====================================
app.use('/api', apiRoutes);

// ====================================
// Health check
// ====================================
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: Date.now(),
    uptime: process.uptime(),
  });
});

// ====================================
// Route racine
// ====================================
app.get('/', (req, res) => {
  res.json({
    name: 'LiteFlow Backend API',
    version: '1.0.0',
    endpoints: [
      'GET /api/system-info',
      'GET /api/dashboard',
      'GET /api/optimiser-pc',
      'GET /api/processes?limit=10',
      'GET /health',
    ],
  });
});

// ====================================
// Swagger
// ====================================
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ====================================
// Création serveur HTTP
// ====================================
const server = http.createServer(app);

// ====================================
// WebSocket Server
// ====================================
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws, req) => {
  console.log('🔌 Client WebSocket connecté');

  ws.on('close', () => {
    console.log('❌ Client WebSocket déconnecté');
  });

  ws.on('error', (err) => {
    console.error('WebSocket error:', err);
  });
});

// Helper d’envoi WebSocket
function wsSend(ws, type, payload) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, payload }));
  }
}

// Rendre WS accessible aux routes
app.set('wss', wss);
app.set('wsSend', wsSend);

// ====================================
// Démarrage du serveur
// ====================================
server.listen(config.PORT, config.HOST, () => {
  console.log('\n ====================================');
  console.log('   LiteFlow Backend API démarré !');
  console.log(`   http://${config.HOST}:${config.PORT}`);
  console.log('====================================');
});

// ====================================
// Gestion 404
// ====================================
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint non trouvé',
    path: req.path,
  });
});

// ====================================
// Arrêt propre
// ====================================
process.on('SIGTERM', () => {
  console.log('\n👋 Arrêt du serveur...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('\n👋 Arrêt du serveur...');
  server.close(() => process.exit(0));
});
