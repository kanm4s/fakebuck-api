module.exports = (sequelize, DataTypes) => {
    const Post = sequelize.define(
        "Post",
        {
            title: DataTypes.STRING,
            image: DataTypes.STRING,
            like: {
                type: DataTypes.INTEGER.UNSIGNED, //UNSIGN is can't not < 0
                allowNull: false,
                defaultValue: 0,
            },
        },
        {
            underscored: true,
        }
    );
    return Post;
};
