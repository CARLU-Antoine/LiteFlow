module.exports = {
  // Port du serveur
  PORT: process.env.PORT || 3001,
  
  // Host
  HOST: process.env.HOST || 'localhost',
  
  // Intervalle de mise à jour (ms)
  UPDATE_INTERVAL: 4000,
  
  // Nombre max de points d'historique
  MAX_HISTORY: 60,
};