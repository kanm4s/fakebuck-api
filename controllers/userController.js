const FriendService = require("../services/friendService");

exports.getMe = async (req, res) => {
    // const {
    //     id,
    //     firstName,
    //     lastName,
    //     email,
    //     phoneNumer,
    //     profilePic,
    //     coverPhoto,
    //     createdAt,
    //     updatedAt,
    // } = req.user;
    const user = JSON.parse(JSON.stringify(req.user));

    const friend = await FriendService.findAcceptedFriend(req.user.id);

    user.friend = friend;
    // res.json({
    //     user: id,
    //     firstName,
    //     lastName,
    //     email,
    //     phoneNumer,
    //     profilePic,
    //     coverPhoto,
    //     createdAt,
    //     updatedAt,
    //     friend,
    // });
    res.json({ user });
};
