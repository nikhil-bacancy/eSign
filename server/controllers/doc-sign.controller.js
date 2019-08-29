const DocModifier = require('../utils/test');
const db = require('../models/index');
var _ = require('lodash');
const middleware = require('../helper/middleware');
const recipientsFun = require('./recipient.controller');
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
        defaults: {
          documentId: payload.documentId,
          creatorId: payload.creatorId,
          recipientId: payload.recipientId,
          statusId: payload.statusId,
          statusDate: payload.statusDate,
        }
      }).then(async ([data, created]) => {
        await recipientsFun.findById(payload.recipientId).then((finaldata) => {
          data.dataValues.recipient = finaldata.data;
        }).catch((error) => {
          reject({
            status: false,
            message: 'Internal server error',
            details: error,
          });
        });
        doc_sign.push(data);
        if (++counter === req.body.length) {
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

exports.create = (req, res) => {
  docsCreateBulk(req).then((data) => {
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

exports.updateById = (req) => {
  const docSignId = req.body.docSignId || req.body.id;
  return new Promise((resolve, reject) => {
    doc_signs.update(
      { statusId: req.body.statusId, },
      { where: { id: docSignId }, returning: true, pain: true }
    ).then(([rowAffected, data]) => {
      if (rowAffected) {
        resolve({
          status: true,
          message: 'doc sign details updated successfully.',
          data: data[0]['dataValues'],
        });
      } else {
        console.log("TCL: exports.updateById -> reject")
        reject({
          status: false,
          message: 'update Unsuccessful / check Id.',
          data: data,
        });
      }
    }).catch((err) => {
      reject({
        status: false,
        message: 'details not found.',
        details: err.toString(),
      });
    });
  });
}

exports.sendMailOnDocSignComplete = (docId) => {
  return new Promise((resolve, reject) => {
    doc_signs.findAll({
      where: { documentId: docId },
      attributes: { exclude: ['createdAt', 'updatedAt'] },
    }).map(el => el.get({ plain: true })).then((response) => {
      resolve({
        status: response.length ? true : false,
        message: response.length ? 'Doc Sign Logs Data Found..!' : 'Doc Sign Logs Data Not Found..!',
        data: response,
      });
    }).catch(error => {
      reject({
        status: false,
        message: 'docsign mail Internal server error',
        error: error.original,
      });
    });
  });
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
          attributes: ['name', 'email'],
        }, {
          model: recipients,
          attributes: ['name', 'email'],
        }],
    }).then(response => {
      return res.status(200).json({
        status: response ? true : false,
        message: 'Doc Sign Data Fetched Successfully..!',
        data: response.dataValues,
      });
    }).catch(error => {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error,
      });
    });
  }).catch(error => {
    return res.status(500).json({
      status: false,
      message: 'Token Has Expired.!',
      error,
    });
  });
}