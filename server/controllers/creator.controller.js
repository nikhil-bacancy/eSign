const db = require('../models/index');

const creators = db.creators;

exports.create = async function (req,res) {
  let creator;
  try {
    creator = await creators.create({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
  return res.status(200).json({
    status: true,
    message: 'Sender information stored successfully.',
    data: creator,
  });
}