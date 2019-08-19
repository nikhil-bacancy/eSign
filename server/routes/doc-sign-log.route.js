const docSignLogControllers = require('../controllers/doc-sign-log.controller.js');

const routes = (app) => {
  app.get('/sign-logs/:id', docSignLogControllers.getSignLogsByDocSignId);
  app.post('/signlogs', docSignLogControllers.addSignLogDetais);
};

module.exports = { routes };