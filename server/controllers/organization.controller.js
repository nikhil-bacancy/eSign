const db = require('../models/index');

const organizations = db.organizations;

exports.create = async function (req,res) {
  let organization;
  try {
    organization = await organizations.create({
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
    message: 'organization information stored successfully.',
    data: organization,
  });
}