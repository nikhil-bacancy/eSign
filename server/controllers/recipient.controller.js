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

exports.getRecipientList = async function (req, res) {
  let recipientsData;

  let sort;
  if (req.query.sort !== undefined && req.query.sort !== '') {
    sort = req.query.sort.split(',').map(col => col.split(':'));
  } else {
    sort = [['updatedAt', 'DESC']];
  }

  const where = {};
  if (req.query.search !== undefined && req.query.search !== '') {
    where.name = { [db.Sequelize.Op.iLike]: `%${req.query.search}%` };
  } else if (req.params.id) {
    where.id = req.params.id;
  }

  try {
    recipientsData = await recipients.findAll({
      offset: req.query.skip,
      order: sort,
      where,
    });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'No recipientsData found.',
      details: err,
    });
  }

  if (recipientsData.length > 0) {
    return res.status(200).json({
      status: true,
      message: 'All recipientsDatas fetched successfully.',
      data: recipientsData,
    });
  }
  return res.status(200).json({
    status: false,
    message: 'No recipientsData found.',
    data: recipientsData,
  });
};