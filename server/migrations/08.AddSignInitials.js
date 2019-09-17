

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('signs', 'initialName', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    }),
    queryInterface.addColumn('signs', 'initialPath', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    }),
  ]),

  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('signs', 'initialName'),
    queryInterface.removeColumn('signs', 'initialPath'),
  ]),
};
