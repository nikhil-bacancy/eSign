const db = require('../models/index');

const organizations = db.organizations;

exports.create = async function (req,res) {
  let organization;
  try {
    await organizations.findOrCreate({
      where: {email: req.body.email},
      defaults: {
          name: req.body.name,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
      }
    }).then(([data,created])=>{
      organization = data; 
      return res.status(200).json({
        status: created,
        message:  created ? 'organization information stored successfully.' : 'organization data already exist.',
        data: organization,
      });
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }
}