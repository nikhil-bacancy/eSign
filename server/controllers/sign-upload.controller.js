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
        initialName: req.body.initialName,
        initialPath: req.body.initialPath,
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
    attributes: ['id', 'email', 'name', 'path', 'initialName', 'initialPath'],
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

exports.update = async (req, res) => {
  const signID = req.params.id;
  await signs.update(
    {
      email: req.body.email,
      name: req.body.fileName,
      path: req.body.filePath,
      initialName: req.body.initialName,
      initialPath: req.body.initialPath,
      isDefault: true,
    },
    { where: { id: signID }, returning: true, pain: true }
  ).then(([rowAffected, data]) => {
    if (rowAffected) {
      return res.status(200).json({
        status: true,
        message: 'signature details updated successfully.',
        data: data,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'signature update Unsuccessful / check Id.',
        data: data,
      });
    }
  }).catch((err) => {
    return res.status(500).json({
      status: false,
      message: 'internal server error.',
      details: err.toString(),
    });
  });
}