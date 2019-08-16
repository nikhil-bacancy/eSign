const db = require('../models/index');
var _ = require('lodash');
const middleware = require('../helper/middleware');
const emailer = require('../helper/emailer');

const doc_signs = db.doc_signs;
const sign_logs = db.sign_logs;

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
    _.each(req.body.docSignLogs, (payload) => {
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
        sign_logs_details.push(data.dataValues);
        counter++;
        if (counter === req.body.docSignLogs.length) {
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
  let RecipientTokens = req.body.recipientsList.map(({ email, docSignId }) => middleware.encrypt({ email, docSignId }))
  let counter = 0;
  await signLogCreateBulk(req).then((data) => {
    RecipientTokens.forEach((token, index) => {

      let from = req.body.sender;
      let to = req.body.recipientsList[index].email;
      let subject = "Testing Email From Nikhil Patel";
      let bodyText = "Kindly Click On Given Link.!";
      let html = `<a href="${process.env.APP_LINK}/recipient/sign?token=${token}">ESign Document Signature Link</a>`;

      emailer.sendEMail(from, to, subject, bodyText, html).then(respose => {
        counter++;
        if (counter === RecipientTokens.length) {
          return res.status(200).json({
            status: data.status,
            message: data.message,
            data: data.data,
            respose
          });
        }
      }).catch(error => {
        return res.status(500).json({ error });
      })
    });
  }).catch((error) => {
    return res.status(500).json({
      status: error.status,
      message: error.message,
      details: error.details,
    });
  });
}
