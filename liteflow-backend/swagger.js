const swaggerJSDoc = require('swagger-jsdoc');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Commandes',
    version: '1.0.0',
    description: 'Documentation de l’API Node.js',
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Serveur local',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./routes/**/*.js']
};

module.exports = swaggerJSDoc(options);
