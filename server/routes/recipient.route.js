const recipientControllers = require('../controllers/recipient.controller.js');

const routes = (app) => {  
  app.post('/recipients/',recipientControllers.create);
};

module.exports = { routes };