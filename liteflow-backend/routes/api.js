const express = require('express');
const router = express.Router();
const systemService = require('../services/systemService');
const commandesService = require('../services/commandesService');


// ====================================
// GET /api/cpu
// ====================================
router.get('/cpu', async (req, res) => {
  try {
    const data = await systemService.getCPU();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// GET /api/memory
// ====================================
router.get('/memory', async (req, res) => {
  try {
    const data = await systemService.getMemory();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// GET /api/disk
// ====================================
router.get('/disk', async (req, res) => {
  try {
    const data = await systemService.getDisk();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// GET /api/network
// ====================================
router.get('/network', async (req, res) => {
  try {
    const data = await systemService.getNetwork();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// GET /api/system-info
// ====================================
router.get('/system-info', async (req, res) => {
  try {
    const data = await systemService.getSystemInfo();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ====================================
// GET /api/processes?limit=10
// ====================================
router.get('/processes', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const data = await systemService.getProcesses(limit);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ====================================
// GET /api/commandes?typeOs=bash|powershell
// ====================================
router.get('/commandes', async (req, res) => {
  try {
  
    const { typeOs } = req.query;

    if (!['bash', 'powershell'].includes(typeOs)) {
      return res.status(400).json({
        error: "Paramètre 'type' requis (bash | powershell)"
      });
    }

    const data = await commandesService.getCommandes(typeOs);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ====================================
// POST /api/ajouter-commandes
// ====================================
router.post('/ajouter-commandes', async (req, res) => {
  try {
    const { typeOs, cmd,description } = req.body;

    // Validation
    if (!typeOs || !cmd) {
      return res.status(400).json({
        error: "Les champs 'type' et 'cmd' sont requis"
      });
    }

    if (!['bash', 'powershell'].includes(typeOs)) {
      return res.status(400).json({
        error: "Type invalide (bash | powershell)"
      });
    }

    await commandesService.addCommande(typeOs, cmd, description);

    res.status(201).json({
      message: 'Commande ajoutée avec succès'
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



module.exports = router;