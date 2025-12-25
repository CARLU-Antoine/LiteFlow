const express = require('express');
const router = express.Router();
const systemService = require('../services/systemService');
const commandesService = require('../services/commandesService');

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

/* =========================
   COMMANDES
========================= */

/**
 * @swagger
 * /commandes:
 *   get:
 *     summary: Liste des commandes bash et powershell
 *     tags: [Commandes]
 */
router.get('/commandes', async (req, res) => {
  try {
    const [commandeBash,commandePowershell] = await Promise.all([
      commandesService.getCommandesBash(),
      commandesService.getCommandesPowershell(),
    ]);

    res.json({ commandeBash, commandePowershell });
  } catch {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

/**
 * @swagger
 * /ajouter-commandes:
 *   post:
 *     summary: Ajouter une commande
 *     tags: [Commandes]
 */
router.post('/ajouter-commandes', async (req, res) => {
  try {
    const { typeOs, id, cmd, description } = req.body;
    if (!typeOs || !id || !cmd || !description) {
      return res.status(400).json({ error: 'Champs manquants' });
    }

    await commandesService.addCommande(typeOs, id, cmd, description);
    res.status(201).json({ message: 'Commande ajoutée' });
  } catch {
    res.status(500).json({ error: 'Erreur ajout commande' });
  }
});

/**
 * @swagger
 * /supprimer-commandes/{id}:
 *   delete:
 *     summary: Supprimer une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 */
router.delete('/supprimer-commandes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { typeOs } = req.query;

    if (!id || !typeOs) {
      return res.status(400).json({ error: 'Paramètres manquants' });
    }

    await commandesService.deleteCommande(typeOs, id);
    res.json({ message: 'Commande supprimée' });
  } catch {
    res.status(500).json({ error: 'Erreur suppression commande' });
  }
});

module.exports = router;
