const express = require('express');
const port = 8000;
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const glob = require('glob');
const fileUpload = require('express-fileupload');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(fileUpload());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods','POST,PUT,GET,DELETE');
    res.header('Access-Control-Allow-Headers', 'XMLHttpRequest,Origin, X-Requested-With, Content-Type, Accept, x-authorization, x-access-token, authorization');
    next();
});
  
const initRoutes = (app) => {
    // including all routes
    glob('./routes/*.js', (err, routes) => {
      if (err) {
        console.log('Error occured including routes');
        return;
      }
      routes.forEach((routePath) => {
        require(routePath).routes(app); // eslint-disable-line
      });
      console.warn('No of routes file : ', routes.length);
    });
};
  
initRoutes(app);
  
app.listen(port || 3001, () => {
    console.log(chalk.blue('App listening on port',port));
});
  