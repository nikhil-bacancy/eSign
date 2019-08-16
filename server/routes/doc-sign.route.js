const docSignControllers = require('../controllers/doc-sign.controller.js');

const routes = (app) => {
  app.post('/docsing/', docSignControllers.create);
  app.get('/getDoc/:id', docSignControllers.getPdfImageUrls);
  app.get('/recipient/doc-sing', docSignControllers.getDocSignDetails); // used by recipient on dosign feature
};

module.exports = { routes };