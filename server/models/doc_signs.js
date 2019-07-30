module.exports = (sequelize, DataTypes) => {
  const doc_signs = sequelize.define('doc_signs', {
    documentId: DataTypes.INTEGER,
    organizationId: DataTypes.INTEGER,
    creatorId: DataTypes.INTEGER,
    recipientId: DataTypes.INTEGER,
    statusId: DataTypes.INTEGER,
    statusDate: DataTypes.DATE,
  }, {});
  doc_signs.associate = function(models) {
    // associations can be defined here
  };
  return doc_signs;
};