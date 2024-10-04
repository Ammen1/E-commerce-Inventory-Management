import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';


dotenv.config();

// Swagger definition
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Inventory Management API',
    version: '1.0.0',
    description: 'API for managing inventory items and users',
  },
  servers: [
    {
      url: process.env.API_BASE_URL || 'http://localhost:5000', 
      description: 'Development server',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

// Options for swagger-jsdoc
const options = {
  swaggerDefinition,
  apis: ['./routes/inventory/*.js', './routes/users/*.js', './routes/stocks/stockRoutes.js', './routes/order/orderRoutes.js', './routes/payment/transactionRoutes.js'],
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJsDoc(options);

const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

export default setupSwagger;
