const creatorControllers = require('../controllers/creator.controller.js');

const routes = (app) => {  
  app.post('/creator/',creatorControllers.create);
};

module.exports = { routes };