const docSignControllers = require('../controllers/doc-sign.controller.js');

const routes = (app) => {
  app.post('/docsing/', docSignControllers.create);
  app.get('/getDoc/:id', docSignControllers.getPdfImageUrls);
  app.get('/recipient/doc-sign', docSignControllers.getDocSignDetails); // used by recipient on dosign feature
  app.get('/creator/doc-sign-review', docSignControllers.getDocSignDetailsByDocId); // used by creator/sender on review completed signed document feature
};

module.exports = { routes };