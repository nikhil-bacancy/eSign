module.exports = (sequelize, DataTypes) => {
  const doc_signs = sequelize.define('doc_signs', {
    documentID: DataTypes.INTEGER,
    organizationID: DataTypes.INTEGER,
    creatorID: DataTypes.INTEGER,
    recipientID: DataTypes.INTEGER,
    statusID: DataTypes.INTEGER,
    statusDate: DataTypes.DATE,
  }, {});
  doc_signs.associate = function(models) {
    // associations can be defined here
  };
  return doc_signs;
};