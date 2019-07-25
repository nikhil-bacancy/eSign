const DocModifier = require('../utils/test');
const fs = require('fs');

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

exports.uploadFile = function (req,res) {
  try {
    const data = new Uint8Array(Buffer.from(req.files.docFile.data));
    fs.writeFile('message.pdf', data, (err) => {
      if(err) {
        return res.status(500).json({
          status: false,
          message: 'file_uploading_error',
          details: err,
        });
      }else{
        return res.status(200).json({
          status: false,
          message: 'The file has been saved!',
          details: 'The file has been saved!',
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }

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
