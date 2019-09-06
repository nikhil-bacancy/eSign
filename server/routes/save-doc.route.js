const saveDocControllers = require('../controllers/doc-save.controller');

const routes = (app) => {
    app.post('/document/download', saveDocControllers.saveDoc);
    app.get('/document/download/:fileName', saveDocControllers.getDoc);
};

module.exports = { routes };