
module.exports = (sequelize, DataTypes) => {
  const organizations = sequelize.define('organizations', {
    name: DataTypes.STRING(50),
    phoneNumber: DataTypes.STRING(10),
    email: DataTypes.STRING,
  }, {});
   
  organizations.associate = function(models) {
    // associations can be defined here
  };
  return organizations;
};