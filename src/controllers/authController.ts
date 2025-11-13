import { Request, Response } from "express";
import { createUser, findUserByEmail } from "../services/userService";
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

    const frontendUrls = process.env.FRONTEND_URLS
      ? process.env.FRONTEND_URLS.split(",")
      : ["http://localhost:4200"]; //remember to change this to the actual local url

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
      : ["http://localhost:4200"]; //reember to change this to the actual local url

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
