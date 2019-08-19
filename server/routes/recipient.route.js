const recipientControllers = require('../controllers/recipient.controller.js');

const routes = (app) => {
  app.post('/recipients/', recipientControllers.create);
  app.put('/recipients/:id', recipientControllers.update);
  app.get('/getRecipientList/', recipientControllers.getRecipientList);
};

module.exports = { routes };