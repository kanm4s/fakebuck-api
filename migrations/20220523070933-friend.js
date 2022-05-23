"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("friends", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },

            status: {
                type: Sequelize.DataTypes.ENUM("PENDING", "APPROVE", "REJECT"),
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
            },
            request_from_id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                reference: {
                    model: {
                        tableName: "users",
                    },
                    key: "id",
                },
            },
        });
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.dropTable("friends");
    },
};
