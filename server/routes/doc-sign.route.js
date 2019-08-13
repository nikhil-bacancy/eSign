const docSignControllers = require('../controllers/doc-sign.controller.js');

const routes = (app) => {
  app.post('/docsing/', docSignControllers.create);
  // app.put('/docsing/:id', docSignControllers.update);
  app.get('/getDoc/:id', docSignControllers.getPdfImageUrls);
};

module.exports = { routes };