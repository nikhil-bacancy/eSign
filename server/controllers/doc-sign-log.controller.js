const db = require('../models/index');
var _ = require('lodash');

const sign_logs = db.sign_logs;
const doc_signs = db.doc_signs;

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

const signLogCreateBulk = (req) => {
  return new Promise((resolve, reject) => {
    const sign_logs_details = [];
    let counter = 0;
    _.each(req.body, (payload) => {
      sign_logs.findOrCreate({
        where: { docSignId: payload.docSignId, pageNo: payload.pageNo, signCoord: payload.signCoord },
        defaults: {
          docSignId: payload.docSignId,
          signId: payload.signId,
          pageNo: payload.pageNo,
          signCoord: payload.signCoord,
          pageRatio: payload.pageRatio,
          statusId: payload.statusId,
          statusDate: payload.statusDate,
        }
      }).then(([data, created]) => {
        sign_logs_details.push(data);
        counter++;
        if (counter === req.body.length) {
          resolve({
            status: created,
            message: created ? 'Document sign logs stored successfully.' : 'Document sign logs already exist.',
            data: sign_logs_details,
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


exports.addSignLogDetais = async (req, res) => {
  await signLogCreateBulk(req).then((data) => {
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
