
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('doc_signs', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            documentId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'documents',
                    key: 'id'
                }
            },
            creatorId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'creators',
                    key: 'id'
                }
            },
            recipientId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'recipients',
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
        return queryInterface.dropTable('doc_signs');
    }
};