const db = require('../models/index');

const recipients = db.recipients;

exports.create =  async function (req,res) {
  let recipientsData;
  try {
    recipientsData = await recipients.bulkCreate(req.body,{ returning: true });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
  return res.status(200).json({
    status: true,
    message: 'recipient information stored successfully.',
    data: recipientsData,
  });
}