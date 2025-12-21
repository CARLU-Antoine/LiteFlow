const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const apiRoutes = require('./routes/api');

const app = express();

// ====================================
// Middleware
// ====================================
app.use(cors());
app.use(express.json());

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
// Démarrage du serveur
// ====================================
app.listen(config.PORT, config.HOST, () => {
  console.log('\n🚀 ====================================');
  console.log('   LiteFlow Backend API démarré !');
  console.log('====================================');
  console.log(`📍 URL: http://${config.HOST}:${config.PORT}`);
  console.log(`⚡ Environnement: ${process.env.NODE_ENV || 'development'}`);
  console.log('\n📊 Endpoints disponibles:');
  console.log(`   GET /api/cpu           - Données CPU avec historique`);
  console.log(`   GET /api/memory        - Utilisation mémoire`);
  console.log(`   GET /api/disk          - Utilisation disque`);
  console.log(`   GET /api/network       - Statistiques réseau`);
  console.log(`   GET /api/system-info   - Informations système`);
  console.log(`   GET /api/processes     - Top processus`);
  console.log(`   GET /api/dashboard     - Toutes les données`);
  console.log(`   GET /health            - Health check`);
  console.log('\n✅ Serveur prêt à recevoir des requêtes!\n');
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