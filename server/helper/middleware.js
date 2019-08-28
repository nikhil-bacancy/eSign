const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.encrypt = (data) => {
  const privateKey = process.env.SECRET
  let token = jwt.sign({ data }, privateKey, { expiresIn: '7d' }, { algorithm: 'RS256' });
  return token;
}

exports.decrypt = (token) => {
  return new Promise((resolve, reject) => {
    const privateKey = process.env.SECRET
    jwt.verify(token, privateKey, function (err, decoded) {
      if (err) {
        reject({
          message: err.message,
          expiredAt: err.expiredAt
        });
      } else {
        resolve(decoded.data);
      }
    });
  })
}