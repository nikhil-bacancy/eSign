const organizationControllers = require('../controllers/organization.controller.js');

const routes = (app) => {  
  app.post('/organization/',organizationControllers.create);
};

module.exports = { routes };