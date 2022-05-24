const { User } = require("../models");
const bcrypt = require("bcryptjs");
const createError = require("../utils/createError");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const genToken = (payload) =>
    jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

exports.login = async (req, res, next) => {
    try {
        const { emailOrPhone, password } = req.body;
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { email: emailOrPhone },
                    { phoneNumber: emailOrPhone },
                ],
            },
        });

        if (!user) {
            createError("invalid credentail", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            createError("invalid credentail", 400);
        }

        const token = genToken({ id: user.id });
        res.json({ token });
    } catch (err) {
        next(err);
    }
};

exports.register = async (req, res, next) => {
    try {
        const { firstName, lastName, emailOrPhone, password, confirmPassword } =
            req.body;

        if (!emailOrPhone) {
            createError("email or phone number is required", 400);
        }
        if (!password) {
            createError("password is required", 400);
        }
        if (password !== confirmPassword) {
            createError("password and confirm password is not match", 400);
        }

        const isMobilePhone = validator.isMobilePhone(emailOrPhone + "");
        const isEmail = validator.isEmail(emailOrPhone + ""); // convert to string

        if (!isMobilePhone && !isEmail) {
            createError("email or phone number is invalid", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName,
            lastName,
            email: isEmail ? emailOrPhone : null,
            phoneNumber: isMobilePhone ? emailOrPhone : null,
            password: hashedPassword,
        });

        const token = genToken({ id: user.id });
        res.status(201).json({ token });
    } catch (err) {
        next(err);
    }
};
