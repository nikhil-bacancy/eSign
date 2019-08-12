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
      sign_logs.findOne({
        include: [
          {
            model: doc_signs,
            required: true,
          }],
        where: { docSignId: payload.docSignId, signId: payload.signId, pageNo: payload.pageNo, signCoord: payload.signCoord },
      }).then(res => {
        if (res) {
          console.log(" iiiiffffffff TCL: signLogCreateBulk ++++++++++++++ res", res.dataValues)
          counter++;
          if (counter === req.body.length) {
            resolve(sign_logs_details);
          }
          sign_logs_details.push(res.dataValues);
        } else {
          console.log("eeeeelllllsssssseeeeeeeee TCL: signLogCreateBulk ---------------- res", res)
          sign_logs.create({
            docSignId: payload.docSignId,
            signId: payload.signId,
            pageNo: payload.pageNo,
            signCoord: payload.signCoord,
            statusId: payload.statusId,
            statusDate: payload.statusDate,
          }).then(res => {
            sign_logs_details.push(res);
            counter++;
            if (counter === req.body.length) {
              resolve(sign_logs_details);
            }
          }).catch(error => {
            reject(error);
          });
        }
        // counter++;
        // if (counter === req.body.length) {
        //   resolve(sign_logs_details);
        // }
      })
    })
  })
}


exports.addSignLogDetais = async (req, res) => {
  await signLogCreateBulk(req).then((data) => {
    return res.status(200).json({
      status: true,
      message: 'Document sign log information stored successfully.',
      data,
    });
  }).catch((error) => {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error.original.detail,
    });
  });
}
