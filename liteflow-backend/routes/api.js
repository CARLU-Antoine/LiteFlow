const express = require('express');
const router = express.Router();
const systemService = require('../services/systemService');
const commandesService = require('../services/commandesService');

/**
 * @swagger
 * tags:
 *   - name: System
 *     description: Routes système (doc par Antoine Carlu)
 *   - name: Commandes
 *     description: Gestion des commandes (doc par Antoine Carlu)
 */

// GET /cpu
/**
 * @swagger
 * /cpu:
 *   get:
 *     summary: Infos CPU
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/cpu', async (req, res) => {
  const data = await systemService.getCPU();
  res.json(data);
});

// GET /memory
/**
 * @swagger
 * /memory:
 *   get:
 *     summary: Infos mémoire
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/memory', async (req, res) => {
  const data = await systemService.getMemory();
  res.json(data);
});

// GET /disk
/**
 * @swagger
 * /disk:
 *   get:
 *     summary: Infos disque
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/disk', async (req, res) => {
  const data = await systemService.getDisk();
  res.json(data);
});

// GET /network
/**
 * @swagger
 * /network:
 *   get:
 *     summary: Infos réseau
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/network', async (req, res) => {
  const data = await systemService.getNetwork();
  res.json(data);
});

// GET /system-info
/**
 * @swagger
 * /system-info:
 *   get:
 *     summary: Infos système
 *     tags: [System]
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/system-info', async (req, res) => {
  const data = await systemService.getSystemInfo();
  res.json(data);
});

// GET /processes
/**
 * @swagger
 * /processes:
 *   get:
 *     summary: Liste processus
 *     tags: [System]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre max
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/processes', async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const data = await systemService.getProcesses(limit);
  res.json(data);
});

// GET /commandes
/**
 * @swagger
 * /commandes:
 *   get:
 *     summary: Liste commandes
 *     tags: [Commandes]
 *     parameters:
 *       - in: query
 *         name: typeOs
 *         schema:
 *           type: string
 *           enum: [bash, powershell]
 *         required: true
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/commandes', async (req, res) => {
  const { typeOs } = req.query;
  const data = await commandesService.getCommandes(typeOs);
  res.json(data);
});

// POST /ajouter-commandes
/**
 * @swagger
 * /ajouter-commandes:
 *   post:
 *     summary: Ajoute commande
 *     tags: [Commandes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               typeOs:
 *                 type: string
 *                 enum: [bash, powershell]
 *               id:
 *                 type: integer
 *               cmd:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Commande ajoutée
 */

router.post('/ajouter-commandes', async (req, res) => {
  const { typeOs,id, cmd, description } = req.body;
  await commandesService.addCommande(typeOs,id, cmd, description);
  res.status(201).json({ message: 'Commande ajoutée' });
});
/**
 * @swagger
 * /supprimer-commandes/{id}:
 *   delete:
 *     summary: Supprime une commande
 *     tags: [Commandes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la commande à supprimer
 *       - in: query
 *         name: typeOs
 *         schema:
 *           type: string
 *           enum: [bash, powershell]
 *         required: true
 *         description: Type de commande
 *     responses:
 *       200:
 *         description: Commande supprimée avec succès
 *       400:
 *         description: Paramètres manquants ou invalides
 */
router.delete('/supprimer-commandes/:id', async (req, res) => {
  const { id } = req.params;
  const { typeOs } = req.query;

  console.log('id',id)
  console.log('typeOs',typeOs)
  await commandesService.deleteCommande(typeOs, id);
  res.status(200).json({ message: 'Commande supprimée' });
});



module.exports = router;
