"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.createTable("posts", {
            id: {
                type: Sequelize.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            title: {
                type: Sequelize.DataTypes.STRING,
                allowNull: false,
            },
            image: {
                type: Sequelize.DataTypes.STRING,
            },
            createdAt: {
                type: Sequelize.DataTypes.DATE,
            },
            updatedAt: {
                type: Sequelize.DataTypes.DATE,
            },
            like: {
                type: Sequelize.DataTypes.INTEGER,
            },
            user_id: {
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
        return queryInterface.dropTable("posts");
    },
};
