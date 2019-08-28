const signUploadControllers = require('../controllers/sign-upload.controller.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadFilePath = path.normalize(__dirname + '/../upload/signatures/');

const upload = multer();

const routes = (app) => {
  app.post('/uploadsign/', upload.single('signImg'), (req, res) => {
    let fileName = (req.body.email.split('@')[0] + '.png');
    let img = req.body.signImg;
    let image = img.split(';base64,').pop();
    fs.writeFile(uploadFilePath + fileName, image, { encoding: 'base64' }, function (err) {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'The signature not saved!',
          details: 'error found in uploading!',
          error: err
        });
      } else {
        req.body.fileName = fileName;
        req.body.filePath = '/upload/signatures/';
        return signUploadControllers.uploadSign(req, res);
      }
    });
  });

  app.get('/sign/:email', signUploadControllers.findSign)
};

module.exports = { routes };