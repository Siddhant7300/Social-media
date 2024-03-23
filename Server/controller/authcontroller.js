const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { error } = require('../utils/responseWrapper');

const signupController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send(error(400, "All fields are required"));
        }

        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send(error(409, "User is already registered"));
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email,
            password: hashedPassword,
        });

        return res.send(newUser);
    } catch (err) {
        console.error("Error in signupController: ", err);
        return res.status(500).send(error(500, "Internal Server Error"));
    }
};

const loginController = async (req, res) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send(error(400, "Email and password are required"));
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(401).send(error(401, "Invalid email or password"));
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordValid) {
            return res.status(401).send(error(401, "Invalid email or password"));
        }



        const accessToken = generateAccessToken({
            userId: existingUser._id,
        });

        const refreshToken = generateRefreshToken({
            userId: existingUser._id,
        });

        return res.json({ accessToken,refreshToken });
    } catch (err) {
        console.error("Error in loginController: ", err);
        return res.status(500).send(error(500, "Internal Server Error"));
    }
};

const refreshAccessTokenController = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).send("Refresh token is required");
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_PRIVATE_KEY);
        const _id = decoded.userId;
        const accessToken = generateAccessToken({ _id });

        console.log("New access token generated:", accessToken);

        return res.status(201).json({ accessToken });
    } catch (error) {
        console.error("Error refreshing access token:", error);
        return res.status(401).send("Invalid refresh token");
    }
};




function generateAccessToken(data) {
    try {
        const token = jwt.sign(data, process.env.ACCESS_TOKEN_PRIVATE_KEY, {
            expiresIn: "10m"
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
