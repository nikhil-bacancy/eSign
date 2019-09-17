module.exports = (sequelize, DataTypes) => {
  const signs = sequelize.define('signs', {
    email: DataTypes.STRING,
    name: DataTypes.TEXT,
    path: DataTypes.TEXT,
    initialName: DataTypes.TEXT,
    initialPath: DataTypes.TEXT,
    isDefault: DataTypes.BOOLEAN,
  }, {});
  signs.associate = function (models) {
    // associations can be defined here
  };
  return signs;
};