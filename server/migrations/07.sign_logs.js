
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('sign_logs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            docSignId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'doc_signs',
                    key: 'id'
                }
            },
            signId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'signs',
                    key: 'id'
                }
            },
            statusId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'status',
                    key: 'id'
                }
            },
            pageNo: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            signCoord: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            pageRatio: {
                type: Sequelize.STRING,
                allowNull: false,
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
        return queryInterface.dropTable('sign_logs');
    }
};