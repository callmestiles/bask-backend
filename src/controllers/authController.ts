import { Request, Response } from "express";
import {
  createUser,
  findUserByEmail,
  deleteUser,
} from "../services/userService";
import { generateToken } from "../utils/auth";
import { User } from "../models";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, accountType, firstName, lastName } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const newUser: User = await createUser({
      email,
      password,
      accountType,
      firstName,
      lastName,
      isEmailVerified: false,
    });

    const token = generateToken(newUser.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", //secure cookies in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // 'none' for cross-site in production
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: newUser.toSafeObject(),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user: User | null = await findUserByEmail(email);
    if (!user || !user.password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: user.toSafeObject(),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const googleAuthCallback = (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    const token = generateToken(user.id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const frontendUrls = process.env.FRONTEND_URLS
      ? process.env.FRONTEND_URLS.split(",")
      : ["http://localhost:9002"];

    const requestOrigin = req.headers.origin || req.headers.referer;
    let frontendUrl = frontendUrls[0]; // Default to first URL (local)

    if (requestOrigin) {
      const matchedUrl = frontendUrls.find((url) =>
        requestOrigin.startsWith(url)
      );
      if (matchedUrl) {
        frontendUrl = matchedUrl;
      }
    }

    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google auth callback error:", error);

    // Same logic for error redirect
    const frontendUrls = process.env.FRONTEND_URLS
      ? process.env.FRONTEND_URLS.split(",")
      : ["http://localhost:9002"];

    const requestOrigin = req.headers.origin || req.headers.referer;
    let frontendUrl = frontendUrls[0];

    if (requestOrigin) {
      const matchedUrl = frontendUrls.find((url) =>
        requestOrigin.startsWith(url)
      );
      if (matchedUrl) {
        frontendUrl = matchedUrl;
      }
    }

    res.redirect(`${frontendUrl}/login?error=auth_failed`);
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user as User;
    res.json({ user: user.toSafeObject() });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

export const deleteUserAccount = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const success = await deleteUser(userId);

    if (!success) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};
