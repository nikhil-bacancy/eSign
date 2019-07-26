module.exports = (sequelize, DataTypes) => {
  const signs = sequelize.define('signs', {
    name: DataTypes.TEXT,
    path: DataTypes.TEXT,
    isDefault: DataTypes.BOOLEAN,
    statusDate: DataTypes.DATE
  }, {});
  signs.associate = function(models) {
    // associations can be defined here
  };
  return signs;
};