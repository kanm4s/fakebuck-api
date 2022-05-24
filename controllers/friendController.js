const createError = require("../utils/createError");
const { Friend, User } = require("../models");
const { Op } = require("sequelize");
const { FRIEND_ACCEPTED, FRIEND_PENDING } = require("../config/constants");
const FriendService = require("../services/friendService");

exports.getAllFriend = async (req, res, next) => {
    try {
        const { status } = req.query;

        let users = [];

        if (status?.toUpperCase() === "UNKNOWN") {
            // FIND UNKNOWN
            users = await FriendService.findUnknownFriend(req.user.id);
        } else if (status?.toUpperCase() === "PENDING") {
            // FIND PENDIND FRIEND
            users = await FriendService.findPendingFriend(req.user.id);
        } else if (status?.toUpperCase() === "REQUEST") {
            // FIND REQUEST FRIEND
            users = await FriendService.findRequestFriend(req.user.id);
        } else {
            // FIND ACCEPTED FRIEND
            users = await FriendService.findAcceptedFriend(req.user.id);
        }

        // console.log(JSON.stringify(users, null, 2));
        res.json({ users });
    } catch (err) {
        next(err);
    }
};

exports.requestFriend = async (req, res, next) => {
    try {
        const { requestToId } = req.body;

        if (req.user.id + "" === requestToId + "") {
            createError("cannot request yourself", 400);
        }

        const existFriend = await Friend.findOne({
            where: {
                [Op.or]: [
                    { requestFromId: req.user.id, requestToId: requestToId }, // request from and to id
                    { requestFromId: requestToId, requestToId: req.user.id },
                ],
            },
        });

        if (existFriend) {
            createError("this user has already been requested", 400);
        }

        const friend = await Friend.create({
            requestToId,
            requestFromId: req.user.id,
            status: FRIEND_PENDING,
        });

        res.json({ friend });
    } catch (err) {
        next(err);
    }
};

exports.updateFriend = async (req, res, next) => {
    try {
        const { requestFromId } = req.params;

        const friend = await Friend.findOne({
            where: {
                requestFromId,
                requestToId: req.user.id,
                status: FRIEND_PENDING,
            },
        });

        if (!friend) {
            createError("friend request not found", 400);
        }

        friend.status = FRIEND_ACCEPTED; // update through object and save
        await friend.save();
        res.json({ message: "friend request accepted" });
    } catch (err) {
        next(err);
    }
};

exports.deleteFriend = async (req, res, next) => {
    try {
        const { id } = req.params;
        const friend = await Friend.findOne({
            where: {
                id,
            },
        });

        if (!friend) {
            createError("friend request not found", 400);
        }

        if (
            friend.requestFromId !== req.user.id &&
            friend.requestToId !== req.user.id
        ) {
            createError("you have no permission", 400);
        }

        await friend.destroy();
        res.status(204).json({ message: "delete friend done" });
    } catch (err) {
        next(err);
    }
};
