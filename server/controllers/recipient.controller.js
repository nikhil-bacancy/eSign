const db = require('../models/index');
var _ = require('lodash');
const recipients = db.recipients;

const addRecipient = (req) => {
  return new Promise((resolve, reject) => {
    const recipient_details = [];
    let counter = 0;
    _.each(req.body, (payload) => {
      recipients.findOrCreate({
        where: { email: payload.email },
        defaults: {
          name: payload.name,
          phoneNumber: payload.phoneNumber,
          email: payload.email,
        }
      }).then(([user, created]) => {
        recipient_details.push(user);
        counter++;
        if (counter === req.body.length) {
          resolve({
            status: created,
            message: created ? 'Sender information stored successfully.' : 'Sender data already exist.',
            data: recipient_details,
          });
        }
      }).catch(error => {
        reject({
          status: false,
          message: 'Internal server error',
          details: error,
        });
      });
    })
  })
}


exports.create = async (req, res) => {
  await addRecipient(req).then((data) => {
    return res.status(200).json({
      status: data.status,
      message: data.message,
      data: data.data,
    });
  }).catch((error) => {
    return res.status(500).json({
      status: error.status,
      message: error.message,
      details: error.details,
    });
  });
}


exports.update = async (req, res) => {
  const recipientID = req.params.id;
  await recipients.update(
    { email: req.body.email, name: req.body.name },
    { where: { id: recipientID }, returning: true, pain: true }
  ).then(([rowAffected, data]) => {
    if (rowAffected) {
      return res.status(200).json({
        status: true,
        message: 'recipient details updated successfully.',
        data: data,
      });
    } else {
      return res.status(500).json({
        status: false,
        message: 'recipient update Unsuccessful / check Id.',
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