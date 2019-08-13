
module.exports = (sequelize, DataTypes) => {
  const recipients = sequelize.define('recipients', {
    name: DataTypes.STRING(50),
    phoneNumber: DataTypes.STRING(10),
    email: DataTypes.STRING,
  }, {});

  recipients.associate = function (models) {
    // associations can be defined here
  };
  return recipients;
};