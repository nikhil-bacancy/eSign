
module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('signs', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        path: {
          allowNull: false,
          type: Sequelize.TEXT
        },
        isDefault: {
            allowNull: false,
            type: Sequelize.BOOLEAN
        },
        statusDate: {
          allowNull: false,
          type: Sequelize.DATE
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('signs');
    }
  };