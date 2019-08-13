
module.exports = (sequelize, DataTypes) => {
  const creators = sequelize.define('creators', {
    name: DataTypes.STRING(50),
    phoneNumber: DataTypes.STRING(10),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    isVerified: DataTypes.BOOLEAN,
    hash: DataTypes.STRING
  }, {});

  creators.associate = function (models) {
    // associations can be defined here
  };
  return creators;
};