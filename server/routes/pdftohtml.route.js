const pdftohtmlControllers = require('../controllers/pdftohtml.controller.js');

const routes = (app) => {
  app.post('/pdftohtml/',pdftohtmlControllers.sendDoc);
  app.post('/uploadfile/',pdftohtmlControllers.uploadFile);
};

module.exports = { routes };

