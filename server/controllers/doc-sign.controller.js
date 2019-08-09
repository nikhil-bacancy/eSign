const DocModifier = require('../utils/test');
const db = require('../models/index');
var _ = require('lodash');

const doc_signs = db.doc_signs;
const documents = db.documents;

let pageConfig = {
  PAGE_NUM: 0,
  TOTAL_PAGES: 2,
  SIGN_POSX: 452,
  SIGN_POSY: 380,
  DIV_POSX: '',
  DIV_POSY: '',
  SIGN_PNG: '',
  PDF_DOC: ''
};

const docsCreateBulk = (req) => {
  return new Promise((resolve, reject) => {
    const doc_sign = [];
    let counter = 0;
    _.each(req.body, (payload) => {
      doc_signs.findOne({
        where: { documentId: payload.documentId, creatorId: payload.creatorId, recipientId: payload.recipientId },
      }).then(res => {
        if (res) {
          doc_sign.push(res.dataValues);
        } else {
          doc_signs.create({
            documentId: payload.documentId,
            organizationId: payload.organizationId,
            creatorId: payload.creatorId,
            recipientId: payload.recipientId,
            statusId: payload.statusId,
            statusDate: payload.statusDate,
          }).then(res => {
            doc_sign.push(res);
          })
        }
        counter++;
        if (counter === req.body.length) {
          resolve(doc_sign);
        }
      })
    })
  })
}

exports.addDocSignDetais = async (req, res) => {
  try {
    const data = await docsCreateBulk(req);
    return res.status(200).json({
      status: true,
      message: 'Document sign information stored successfully.',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
}

exports.getPdfImageUrls = async (req, res) => {
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
    let pdfImage = new PDFImage(pdfPath, {
      // convertOptions: {
      //   "-quality": "100"
      // }
    });

    pdfImage.convertFile().then((imagePaths) => {
      let imgs = imagePaths.map((imgPath, index) => {
        let imgArr = imgPath.split("/")
        return imgArr[imgArr.length - 1];
      })
      return res.status(200).json({
        status: true,
        message: 'pdf fetched successfully.',
        data: imgs,
      });
    }, (err) => {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        details: err,
      });
    });
  } else {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: 'document not found',
    });
  }
}


exports.sendDoc = function (req, res) {
  try {
    if (req.body && req.files) {

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
