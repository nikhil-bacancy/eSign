const signUploadControllers = require('../controllers/sign-upload.controller.js');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const uploadSignFilePath = path.normalize(__dirname + '/../upload/signatures/');
const uploadInitialFilePath = path.normalize(__dirname + '/../upload/signatures/initials/');

const upload = multer();

const routes = (app) => {
  app.post('/uploadsign/', upload.fields([{ name: 'signImg', maxCount: 1 }, { name: 'initialImg', maxCount: 1 }]), (req, res) => {

    let fileName = (req.body.email.split('@')[0] + '.png');
    let img = req.body.signImg;
    let image = img.split(';base64,').pop();

    let initialImgFileName = ('I' + req.body.email.split('@')[0] + '.png');
    let imgInitial = req.body.initialImg;
    let imageInitial = imgInitial.split(';base64,').pop();

    fs.writeFile(uploadSignFilePath + fileName, image, { encoding: 'base64' }, function (err) {
      if (err) {
        return res.status(400).json({
          status: false,
          message: 'The signature not saved!',
          details: 'error found in uploading!',
          error: err
        });
      } else {
        fs.writeFile(uploadInitialFilePath + initialImgFileName, imageInitial, { encoding: 'base64' }, function (err) {
          if (err) {
            return res.status(400).json({
              status: false,
              message: 'The signature Initial not saved!',
              details: 'error found in uploading!',
              error: err
            });
          } else {
            req.body.fileName = fileName;
            req.body.filePath = '/upload/signatures/';
            req.body.initialName = initialImgFileName;
            req.body.initialPath = '/upload/signatures/initials';
            return signUploadControllers.uploadSign(req, res);
          }
        });
      }
    });
  });

  app.get('/sign/:email', signUploadControllers.findSign);
  app.put('/sign/:id', signUploadControllers.update);
};

module.exports = { routes };