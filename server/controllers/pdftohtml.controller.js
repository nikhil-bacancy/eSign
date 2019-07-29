const DocModifier = require('../utils/test');
const db = require('../models/index');

const documents = db.documents;

let pageConfig = {
  PAGE_NUM : 0,
  TOTAL_PAGES : 2,
  SIGN_POSX : 452,
  SIGN_POSY : 380,
  DIV_POSX : '',
  DIV_POSY : '',
  SIGN_PNG : '',
  PDF_DOC : ''
};


exports.uploadFile = async function (req,res) {
  let file;
  try {
    file = await documents.create({
      name: req.file.filename,
      path: req.file.destination,
      docType: req.file.mimetype,
      totalPages: req.body.totalPages,
      statusID :  1, // panding 
      statusDate: Date.now(),
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
  return res.status(200).json({
    status: true,
    message: 'Document information stored successfully.',
    data: file,
  });
}

exports.sendDoc = function (req, res) {
  try {
    if(req.body && req.files){

          pageConfig.PAGE_NUM = req.body.pageNo;
          pageConfig.TOTAL_PAGES = req.body.totalPages;
          pageConfig.SIGN_POSX = req.body.signX;
          pageConfig.SIGN_POSY = req.body.signY;
          pageConfig.DIV_POSX = req.body.divX;
          pageConfig.DIV_POSY = req.body.divY;
          pageConfig.SIGN_PNG = req.files.sign;
          pageConfig.PDF_DOC = req.files.pdf;
      
          let resMsg = DocModifier.modifyPDF(pageConfig);
          return res.status(200).json({
              status: false,
              message: resMsg,
              details: 'done',
          });
        }
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        details: err,
      });
    }
}  
