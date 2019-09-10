const DocModifier = require('../utils/test');
const db = require('../models/index');
var _ = require('lodash');
const middleware = require('../helper/middleware');
const recipientsFun = require('./recipient.controller');
const doc_signs = db.doc_signs;
const recipients = db.recipients;
const creators = db.creators;
const documents = db.documents;
const path = require('path');
const uploadedFilePath = path.normalize(__dirname + '/../upload/');
const resultsFilePath = path.normalize(__dirname + '/../results/');

exports.onDocSignComplete = (docId) => {
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

exports.getDoc = (req, res) => {
  const file = resultsFilePath + req.params.fileName;
  return res.download(file);
}

exports.saveDoc = function (req, res) {
  try {
    if (req.body) {
      // signLogs, signatureDetails, documentDetails, docSignIds
      const pageConfig = req.body.signLogs.map(signLogObj => {
        if (signLogObj.signId) {
          const index = req.body.signatureDetails.findIndex((objSign) => parseInt(objSign.id) === parseInt(signLogObj.signId));
          signPath = `${uploadedFilePath}signatures/${req.body.signatureDetails[index].name}`;
        }
        return {
          PAGE_NUM: signLogObj.pageNo,
          SIGN_POSX: parseFloat(signLogObj.signCoord.split(',')[0]),
          SIGN_POSY: parseFloat(signLogObj.signCoord.split(',')[1]),
          PAGE_RATIO_X: parseFloat(signLogObj.pageRatio.split(',')[0]),
          PAGE_RATIO_Y: parseFloat(signLogObj.pageRatio.split(',')[1]),
          SIGN_PNG: signPath,
        }
      });

      const PDF_DOC = (uploadedFilePath + req.body.documentDetails.name)
      DocModifier.modifyPDF(pageConfig, PDF_DOC).then(resFile => {
        return res.status(200).json({
          status: true,
          message: 'Document Is Ready To Download.!',
          file: resFile,
        });
      }).catch(err => {
        return res.status(500).json({
          status: false,
          message: 'Internal server error',
          details: err,
        });
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

exports.getDocSignDetailsByDocId = (req, res) => {
  middleware.decrypt(req.query.token).then(tokenData => {
    const data = JSON.parse(JSON.stringify(tokenData));
    doc_signs.findAll({
      where: {
        documentId: data.docId
      },
      attributes: ['id', 'documentId', 'creatorId', 'statusId'],
      include: [
        {
          model: documents,
          attributes: ['id', 'name', 'path', 'docType', 'totalPages'],
        }, {
          model: creators,
          attributes: ['id', 'name', 'email'],
        }, {
          model: recipients,
          attributes: ['id', 'name', 'email'],
        }],
    }).map(el => el.get({ plain: true })).then(response => {
      return res.status(200).json({
        status: response.length ? true : false,
        message: response.length ? 'Doc Sign Data Fetched Successfully..!' : 'Doc Sign Data Not Found..!',
        data: response,
      });
    }).catch(error => {
      return res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: error.original,
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