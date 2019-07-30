const chalk = require('chalk');
const express = require('express');
const expressValidator = require('express-validator');
const fs = require('fs');
const bodyParser = require('body-parser');
// const fileUpload = require('express-fileupload');
const glob = require('glob');
const app = express();
require('./models/')

// Load environment variables.
require('dotenv').config();

eval(fs.readFileSync(`${__dirname}/models/index.js`));

app.use(expressValidator());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
// app.use(fileUpload());

app.use('/', express.static('./public'));
app.use('/upload', express.static('./upload'));

app.set('view engine', 'ejs');

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
  
app.listen(process.env.PORT || 3001, () => {
  console.log(chalk.blue('App listening on port',process.env.PORT));
});
