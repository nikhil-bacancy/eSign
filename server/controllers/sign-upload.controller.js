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

