const pdftohtmlControllers = require('../controllers/pdftohtml.controller.js');

const routes = (app) => {
  app.post('/pdftohtml/',pdftohtmlControllers.sendDoc);
};

module.exports = { routes };

