const DocModifier = require('../utils/test');
const db = require('../models/index');

const doc_signs = db.doc_signs;
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


exports.addDocSignDetais = async function (req,res) {
  let doc_sign;
  try {
    doc_sign = await doc_signs.bulkCreate(req.body,{ returning: true });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
  return res.status(200).json({
    status: true,
    message:  'Document sign information stored successfully.',
    data: doc_sign,
  });
}


exports.getPdfImageUrls = async (req,res) => {
    let docData;
    const where = {};
    if (req.params.id) { where.id = req.params.id };
    
    try {
      docData = await documents.find({
        offset: req.query.skip,
        where,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: 'No recipientsData found.',
        details: err,
      });
    }

    if (docData) {
      let pdfPath = docData.path + docData.name;
      let PDFImage = require("pdf-image").PDFImage;
      let pdfImage = new PDFImage(pdfPath,{
        // convertOptions: {
        //   "-quality": "100"
        // }
      });
      
      pdfImage.convertFile().then((imagePaths) => {
        let imgs = imagePaths.map((imgPath,index) => {
           let imgArr = imgPath.split("/")
           return imgArr[imgArr.length-1];
        })
        return res.status(200).json({
          status: true,
          message:  'pdf fetched successfully.',
          data: imgs,
        });
      },(err) => {
        return res.status(500).json({
          status: false,
          message: 'Internal server error',
          details: err,
        });
      });
    }else{
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        details: 'document not found',
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
