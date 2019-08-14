const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.encrypt = (data) => {
    const privateKey = process.env.SECRET
    let token = jwt.sign({ data }, privateKey, { expiresIn: '10m' }, { algorithm: 'RS256' });
    return token;
}


exports.decrypt = (token) => {
    // const privateKey = process.env.SECRET
    var decoded = jwt.decode(token, { complete: true });
    return decoded.payload.data;
}