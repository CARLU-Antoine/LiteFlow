const express = require('express');
const router = express.Router();
const systemService = require('../services/systemService');

/* =========================
   SYSTEM
========================= */

/**
 * @swagger
 * /system-info:
 *   get:
 *     summary: Infos système
 *     tags: [System]
 */
router.get('/system-info', async (req, res) => {
  try {
    const data = await systemService.getSystemInfo();
    res.json(data);
  } catch {
    res.status(500).json({ error: 'Erreur système' });
  }
});

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Données du dashboard
 *     tags: [System]
 */
router.get('/dashboard', async (req, res) => {
  try {
    const [disk, cpu, memory, network] = await Promise.all([
      systemService.getDisk(),
      systemService.getCPU(),
      systemService.getMemory(),
      systemService.getNetwork()
    ]);

    res.json({ disk, cpu, memory, network });
  } catch {
    res.status(500).json({ error: 'Erreur dashboard' });
  }
});

/**
 * @swagger
 * /processes:
 *   get:
 *     summary: Liste des processus
 *     tags: [System]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
router.get('/processes', async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 10;
    res.json(await systemService.getProcesses(limit));
  } catch {
    res.status(500).json({ error: 'Erreur processus' });
  }
});

module.exports = router;
