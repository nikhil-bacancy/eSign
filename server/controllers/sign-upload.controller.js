const db = require('../models/index');

const signs = db.signs;


exports.uploadSign = async function (req, res) {
  let file;
  try {
    await signs.findOrCreate({
      where: { name: req.body.fileName },
      defaults: {
        email: req.body.email,
        name: req.body.fileName,
        path: req.body.filePath,
        isDefault: true,
      }
    }).then(([data, created]) => {
      file = data;
      return res.status(200).json({
        status: true,
        message: 'Sign Uploaded successfully.',
        data: file,
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

exports.findSign = (req, res) => {
  signs.findOne({
    where: { email: req.params.email },
    attributes: ['id', 'email', 'name', 'path'],
  }).then(response => {
    return res.status(200).json({
      status: response ? true : false,
      message: 'Sign Fetched Successfully..!',
      data: response.dataValues,
    })
  }).catch(error => {
    return res.status(500).json({
      status: false,
      message: 'No Sign Found.!',
      error,
    });
  });

}