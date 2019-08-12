const docSignLogControllers = require('../controllers/doc-sign-log.controller.js');

const routes = (app) => {
  app.post('/signlogs', docSignLogControllers.addSignLogDetais);
};

module.exports = { routes };