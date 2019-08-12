const docSignControllers = require('../controllers/doc-sign.controller.js');

const routes = (app) => {
  app.post('/docsing/', docSignControllers.addDocSignDetais);
  app.get('/getDoc/:id', docSignControllers.getPdfImageUrls);
};

module.exports = { routes };