

const express = require('express');
const router = express.Router();
const optimiserService = require('../services/optimiserService');
const systemService = require('../services/systemService');
const commandesService = require('../services/commandesService');
let distribution = null;

/**
 * @swagger
 * /optimiser-pc:
 *   post:
 *     summary: Optimiser le PC
 *     tags: [Optimiser]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sudoPassword:
 *                 type: string
 *                 description: Mot de passe sudo (Linux/Mac uniquement)
 *     responses:
 *       200:
 *         description: Optimisation réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 resultats:
 *                   type: array
 *       500:
 *         description: Erreur lors de l'optimisation
 */
router.post('/optimiser-pc', async (req, res) => {
  try {
    // Récupération de la distribution une seule fois
    if (distribution === null) {
      const data = await systemService.getSystemInfo();
      distribution = data.os.distro;
    }

    let commandes;
    
    if (distribution.toLowerCase() === 'win32') {
      commandes = await commandesService.getCommandesPowershell();
    } else {
      // Linux / macOS
      commandes = await commandesService.getCommandesByPlatform(distribution);
    }

    const sudoPassword = req.body?.sudoPassword || null;

    const wss = req.app.get('wss');

    res.json({
      success: true,
      started: true,
      distribution,
      commandesCount: commandes.length
    });

    for (const ws of wss.clients) {
      if (ws.readyState === 1) {
        optimiserService.executeCommande(
          process.platform,
          commandes,
          sudoPassword,
          (progressData) => {
            ws.send(JSON.stringify(progressData));
          }
        ).catch(err => {
          console.error('Erreur lors de l\'exécution des commandes:', err);
          ws.send(JSON.stringify({ error: err.message }));
        });
      }
    }

  } catch (error) {
    console.error('Erreur lors de l\'optimisation:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de l\'optimisation',
      details: error.message
    });
  }
});

module.exports = router;
