import User from "../models/user.js";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt";

const createUser = async (req, res) => {
    const userdata = req.body;
    try {
        const newuser = new User(userdata);
        const salt = await bcrypt.genSalt(10);
        newuser.password = await bcrypt.hash(newuser.password, salt);
        await newuser.save();
        return res.status(200).json({
            success: true,
            message: "User created successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).jsons({
                success: false,
                message: "User does not exist",
            });
        }
        const compare = await bcrypt.compare(password, existingUser.password);
        console.log(compare);
        if (!compare) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "24h",
            }
        );
        return res.status(200).json({
            success: true,
            token,
            message: "User logged in successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
const getUser = async (req, res) => {
    const { id } = req.user;
    try {
        const user = await User.findOne({ _id: id })
        user.password = null;
        if (user) {
            return res.status(201).json({
                success: true,
                message: "User retrieved successfully",
                user: user
            })
        }
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
export { createUser, loginUser, getUser };