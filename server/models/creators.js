
module.exports = (sequelize, DataTypes) => {
  const creators = sequelize.define('creators', {
    name: DataTypes.STRING(50),
    phoneNumber: DataTypes.STRING(10),
    email: DataTypes.STRING,
  }, {});
   
  creators.associate = function(models) {
    // associations can be defined here
  };
  return creators;
};