module.exports = (sequelize, DataTypes) => {
  const sign_logs = sequelize.define('sign_logs', {
    docSignId: DataTypes.INTEGER,
    signId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    pageNo: DataTypes.INTEGER,
    signCoord: DataTypes.STRING,
    pageRatio: DataTypes.STRING,
    statusDate: DataTypes.DATE
  }, {});
  sign_logs.associate = function (models) {
    // associations can be defined here
  };
  return sign_logs;
};