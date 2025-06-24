import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { User } from "../models/user.model.js";
import transporter from "../config/nodemailer.js";

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // for password encrypting using hashing for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // for store user in database
    const user = await User.create({ name, email, password: hashedPassword });
    await user.save();

    // for generating JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // for cookie setting
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // for sending welcome email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Welcome to AuthCorp",
      text: `Hello ${name},\n\nThank you for registering with us! We're excited to have you on board.\n\nBest regards,\nAuthCorp Team`,
    };

    await transporter.sendMail(mailOptions); 

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at register :: ", error });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({ message: "Login successfull", user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at login :: ", error });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });

    return res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error at logout :: ", error });
  }
};
