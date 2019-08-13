const db = require('../models/index');

const creators = db.creators;

exports.create = async function (req, res) {
  let creator;
  try {
    await creators.findOrCreate({
      where: { email: req.body.email },
      defaults: {
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        password: req.body.password,
        isVerified: true,
      }
    }).then(([user, created]) => {
      creator = user;
      return res.status(200).json({
        status: created,
        message: created ? 'Sender information stored successfully.' : 'Sender data already exist.',
        data: creator.dataValues,
      });
    })
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: 'Internal server error',
      details: error,
    });
  }

}