import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "jwt",
    { session: false },
    (err: any, user: any, info: any) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Authentication error", error: err });
      }

      if (!user) {
        return res.status(401).json({
          message: "Unauthorized",
          error: info?.message || "Invalid or missing token",
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    }
  )(req, res, next);
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user as any;
  if (user && user.accountType === "Admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied. Admin only." });
  }
};
