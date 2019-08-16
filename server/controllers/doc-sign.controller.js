const DocModifier = require('../utils/test');
const db = require('../models/index');
var _ = require('lodash');
const middleware = require('../helper/middleware');
const emailer = require('../helper/emailer');
const doc_signs = db.doc_signs;
const recipients = db.recipients;
const creators = db.creators;
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
      doc_signs.findOrCreate({
        where: { documentId: payload.documentId, creatorId: payload.creatorId, recipientId: payload.recipientId },
        include: [
          {
            model: recipients,
            attributes: ['id', 'name', 'email'],
            required: true,
          }],
        defaults: {
          documentId: payload.documentId,
          creatorId: payload.creatorId,
          recipientId: payload.recipientId,
          statusId: payload.statusId,
          statusDate: payload.statusDate,
        }
      }).then(([data, created]) => {
        doc_sign.push(data);
        counter++;
        if (counter === req.body.length) {
          resolve({
            status: created,
            message: created ? 'Document sign data stored successfully.' : 'Document sign data already exist.',
            data: doc_sign,
          });
        }
      }).catch(error => {
        reject({
          status: false,
          message: 'Internal server error',
          details: error,
        });
      });
    })
  })
}

exports.create = async (req, res) => {
  await docsCreateBulk(req).then((data) => {
    return res.status(200).json({
      status: data.status,
      message: data.message,
      data: data.data,
    });
  }).catch((error) => {
    return res.status(500).json({
      status: error.status,
      message: error.message,
      details: error.details,
    });
  });
}

// exports.update = async (req, res) => {
//   const docSignId = req.params.id;
//   await doc_signs.update(
//     { pageRatio: req.body.pageRatio },
//     { where: { id: docSignId }, returning: true, pain: true }
//   ).then(([rowAffected, data]) => {
//     if (rowAffected) {
//       return res.status(200).json({
//         status: true,
//         message: 'doc sign details updated successfully.',
//         data: data,
//       });
//     } else {
//       return res.status(500).json({
//         status: false,
//         message: 'update Unsuccessful / check Id.',
//         data: data,
//       });
//     }
//   }).catch((err) => {
//     return res.status(500).json({
//       status: false,
//       message: 'details not found.',
//       details: err.toString(),
//     });
//   });
// }

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

exports.getDocSignDetails = (req, res) => {
  middleware.decrypt(req.query.token).then(tokenData => {
    const data = JSON.parse(JSON.stringify(tokenData));
    doc_signs.find({
      where: { id: data.docSignId },
      attributes: ['id', 'documentId', 'creatorId', 'recipientId'],
      include: [
        {
          model: documents,
          attributes: ['name', 'path', 'docType', 'totalPages'],
        }, {
          model: creators,
          attributes: ['name'],
        }, {
          model: recipients,
          attributes: ['name'],
        }],
    }).then(response => {
      return res.status(200).json({
        status: response ? true : false,
        message: 'Doc Sign Data Fetched Successfully..!',
        details: response,
      });
    }).catch(error => {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        details: error,
      });
    });
  }).catch(error => {
    return res.status(500).json({
      status: false,
      message: 'Token Has Expired.!',
      details: error,
    });
  });
}