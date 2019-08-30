const db = require('../models/index');
var _ = require('lodash');
const path = require('path');
const middleware = require('../helper/middleware');
const emailer = require('../helper/emailer');
const doc_sign_Func = require('./doc-sign.controller')
const uploadFilePath = path.normalize(__dirname + '/../helper/images/');
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
      let from = req.body.sender.name;
      let to = req.body.recipientsList[index].email;
      let subject = "Testing Email From Nikhil Patel";
      let link = `${process.env.APP_LINK}/recipient/sign?token=${token} `
      let html = emailer.setSignatureEMailBodyHtml(req.body.sender, req.body.recipientsList[index], link, 'setSign')
      let attachments = [{
        filename: 'Esign.png',
        path: uploadFilePath + 'Esign.png',
        cid: 'esing@logo' //same cid value as in the html img src
      }, {
        filename: 'symbol.png',
        path: uploadFilePath + 'symbol.png',
        cid: 'symbol@logo' //same cid value as in the html img src
      }]
      emailer.sendEMail(from, to, subject, null, html, attachments).then(respose => {
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


exports.getSignLogsByDocSignId = (req, res) => {
  sign_logs.findAll({
    where: { docSignId: req.params.id },
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  }).map(el => el.get({ plain: true })).then((response) => {
    return res.status(200).json({
      status: response.length ? true : false,
      message: response.length ? 'Doc Sign Logs Data Found..!' : 'Doc Sign Logs Data Not Found..!',
      data: response,
    });
  }).catch(error => {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      error: error.original,
    });
  });
}

const updateById = (req) => {
  return new Promise((resolve, reject) => {
    const sign_logs_details = [];
    let counter = 0;
    _.each(req.body.docSignLogs, (payload) => {
      sign_logs.update(
        { signId: payload.signId, statusId: (payload.signId) ? 2 : 1 },
        { where: { id: payload.id, docSignId: payload.docSignId }, returning: true, pain: true }
      ).then(([rowAffected, data]) => {
        if (rowAffected) {
          sign_logs_details.push(data[0]['dataValues']);
          ++counter;
          if (counter === req.body.docSignLogs.length) {
            resolve(sign_logs_details);
          }
        } else {
          reject("details mismatch / not found ");
        }
      }).catch((err) => {
        reject(err.toString());
      });
    });
  });
}

notifySenderByMail = (req, totalRecipients, completedSignCounts, tokenToSender) => {
  return new Promise((resolve, reject) => {
    try {
      let from = req.body.recipientDetails.name;
      let to = req.body.creatorDetails.email;
      let subject = "Testing Email From Nikhil Patel";
      let html;
      let attachments;
      if (totalRecipients === completedSignCounts) {
        let link = `${process.env.APP_LINK}/sender/viewsign?token=${tokenToSender} `
        html = emailer.setSignatureEMailBodyHtml(req.body.creatorDetails, req.body.recipientDetails, link, 'dosign');
        attachments = [{
          filename: 'Esign.png',
          path: uploadFilePath + 'Esign.png',
          cid: 'esing@logo' //same cid value as in the html img src
        }, {
          filename: 'symbol.png',
          path: uploadFilePath + 'symbol.png',
          cid: 'symbol@logo' //same cid value as in the html img src
        }]
      } else {
        html = `<p>Recipient : <b> ${req.body.recipientDetails.name} </b> Has Signed The Document.!</p><p>Recipient Email Id : <a href="mailto:${req.body.recipientDetails.email}" target="_blank">${req.body.recipientDetails.email}</a> </p>`;
        attachments = null;
      }
      null;
      emailer.sendEMail(from, to, subject, null, html, attachments).then(respose => {
        resolve(respose);
      }).catch(error => {
        reject({ error });
      })
    } catch (error) {
      console.log("TCL: notifySenderByMail -> error", error);
      reject({ error });
    }
  });
}

exports.update = async (req, res) => {
  try {
    let tokenToSender = middleware.encrypt({ docId: req.body.docId })
    await updateById(req).then(sign_log_data => {
      req.body.statusId = 2;
      doc_sign_Func.updateById(req)
        .then(() => {
          doc_sign_Func.onDocSignComplete(req.body.docId)
            .then(doc_sign_res => {
              let totalRecipients = doc_sign_res.data.length;
              let completedSignCounts = 0;
              doc_sign_res.data.forEach(doc_sign_Obj => {
                if (doc_sign_Obj.statusId === 2) {
                  ++completedSignCounts;
                }
              });
              notifySenderByMail(req, totalRecipients, completedSignCounts, tokenToSender).then(respose => {
                return res.status(200).json({
                  status: true,
                  message: 'Document signed successfully.',
                  data: sign_log_data,
                  respose
                });
              }).catch(error => {
                return res.status(500).json({ error });
              });
            }).catch((err) => {
              return res.status(500).json({
                status: false,
                message: 'doc_sign mail Internal Server Error.',
                details: err
              });
            });
        }).catch((err) => {
          return res.status(500).json({
            status: false,
            message: 'doc_sign Internal Server Error.',
            details: err
          });
        });
    }).catch((err) => {
      return res.status(500).json({
        status: false,
        message: 'sign_log Internal Server Error.',
        details: err
      });
    });
  } catch (error) {
    console.log("TCL: exports.update -> error", error)
  }
}





// let from = req.body.recipientDetails.name;
// let to = req.body.creatorDetails.email;
// let subject = "Testing Email From Nikhil Patel";
// let html = `<p>Recipient : <b> ${req.body.recipientDetails.name} </b> Has Signed The Document.!</p><p>Recipient Email Id : <a href="mailto:${req.body.recipientDetails.email}" target="_blank">${req.body.recipientDetails.email}</a> </p>`;
// let attachments = null;
// emailer.sendEMail(from, to, subject, null, html, attachments).then(respose => {
//   return res.status(200).json({
//     status: true,
//     message: 'Document signed successfully.',
//     data: sign_log_data,
//     respose
//   });
// }).catch(error => {
//   return res.status(500).json({ error });
// })