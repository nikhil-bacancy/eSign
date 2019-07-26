module.exports = (sequelize, DataTypes) => {
  const sign_logs = sequelize.define('sign_logs', {
    docSignID: DataTypes.INTEGER,
    signID: DataTypes.INTEGER,
    pageNo: DataTypes.INTEGER,
    statusID: DataTypes.INTEGER,
    signCoord: DataTypes.STRING,
    statusDate: DataTypes.DATE
  }, {});
  sign_logs.associate = function(models) {
    // associations can be defined here
  };
  return sign_logs;
};