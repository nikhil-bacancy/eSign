const fileuploadControllers = require('../controllers/fileupload.controller.js');
const multer  = require('multer');
const path = require('path');
const uploadFilePath = path.normalize( __dirname + '/../upload/');

const storage = multer.diskStorage({
  destination:  uploadFilePath,
  filename: function (req, file, cb) {
    cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname))
  },
});
 
const upload = multer({ storage: storage }).single('docFile')

const routes = (app) => {  
  app.post('/pdftohtml/',fileuploadControllers.sendDoc);

  app.post('/uploadfile/',(req, res)  => {
    upload(req,res,(err) => {
      if(err){
        return res.status(400).json({
          status: false,
          message: 'The file not saved!',
          details: 'error found in uploading!',
        });
      }else{
        return fileuploadControllers.uploadFile(req,res);
      }
    })
  }); 
  
};

module.exports = { routes };