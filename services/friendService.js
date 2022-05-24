const { Op } = require("sequelize");
const { Friend, User } = require("../models");
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");

exports.findAcceptedFriend = async (id) => {
    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ requestToId: id }, { requestFromId: id }],
            status: FRIEND_ACCEPTED,
        },
    });

    const friendIds = friends.map((ele) =>
        ele.requestToId === id ? ele.requestFromId : ele.requestToId
    );

    // SELECT * FROM users WHERE id IN (2,1)
    const users = await User.findAll({
        where: { id: friendIds },
        attributes: { exclude: ["password"] },
    });

    return users;
};

exports.findPendingFriend = async (id) => {
    const friends = await Friend.findAll({
        where: {
            requestToId: id,
            status: FRIEND_PENDING,
        },
        include: {
            model: User,
            as: "RequestFrom",
            attributes: {
                exclude: ["password"],
            },
        },
    });

    // console.log(JSON.stringify(friends, null, 2));
    return friends.map((ele) => ele.RequestFrom);
};

exports.findRequestFriend = async (id) => {
    const friends = await Friend.findAll({
        where: {
            requestFromId: id,
            status: FRIEND_PENDING,
        },
        include: {
            model: User,
            as: "RequestTo",
            attributes: {
                exclude: ["password"],
            },
        },
    });
    return friends.map((ele) => ele.RequestTo);
};
exports.findUnknownFriend = async (id) => {
    const friends = await Friend.findAll({
        where: {
            [Op.or]: [{ requestToId: id }, { requestFromId: id }],
        },
    });

    const friendIds = friends.map((ele) =>
        ele.requestToId === id ? ele.requestFromId : ele.requestToId
    );

    friendIds.push(id);

    // SELECT * FROM users WHERE id IN (2,1)
    const users = await User.findAll({
        where: { id: { [Op.notIn]: friendIds } },
        attributes: { exclude: ["password"] },
    });

    return users;
};
