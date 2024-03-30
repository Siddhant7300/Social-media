const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error, success } = require('../utils/responseWrapper');
const cookieParser = require('cookie-parser');

const signupController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(error(400, "All fields are required"));
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.send(error(409, "User is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        return res.send(success(200, newUser));
    } catch (err) {
        console.error("Error in signupController: ", err);
        return res.send(error(500, "Internal Server Error"));
    }
};

const loginController = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.send(error(400, "Email and password are required"));
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.send(error(401, "Invalid email or password"));
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.send(error(401, "Invalid email or password"));
        }

        const accessToken = generateAccessToken({
            userId: existingUser._id,
        });

        const refreshToken = generateRefreshToken({
            userId: existingUser._id,
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true
        });

        return res.json(success(200, { accessToken }));
    } catch (err) {
        console.error("Error in loginController: ", err);
        return res.send(error(500, "Internal Server Error"));
    }
};

const refreshAccessTokenController = async (req, res) => {
    const refreshToken = req.cookies.jwt; // Accessing the jwt cookie
    
    if (!refreshToken) {
        return res.send(error(400, "Refresh token is required in cookie"));
    }

    try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded.userId;
        const accessToken = generateAccessToken({ _id });

        console.log("New access token generated:", accessToken);

        return res.status(201).json(success(201, { accessToken }));
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.send(error(401, "Invalid refresh token"));
    }
};

function generateAccessToken(data) {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "20s"
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
}

const generateRefreshToken = (data) => {
    try {
        const token = jwt.sign(data, process.env.REFRESH_TOKEN_PRIVATE_KEY, {
            expiresIn: "1y"
        });
        console.log(token);
        return token;
    } catch (error) {
        console.log(error);
        return null;
    }
};

module.exports = { signupController, loginController, refreshAccessTokenController };
