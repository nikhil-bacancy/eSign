module.exports = (sequelize, DataTypes) => {
  const documents = sequelize.define('documents', {
    name: DataTypes.TEXT,
    path: DataTypes.TEXT,
    docType: DataTypes.STRING,
    totalPages: DataTypes.INTEGER,
    statusID: DataTypes.INTEGER,
    statusDate: DataTypes.DATE,
  }, {});
  documents.associate = function(models) {
    // associations can be defined here
  };
  return documents;
};