import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateCreatePost = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
];

export const validateUpdatePost = [
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Content cannot be empty")
    .isLength({ max: 5000 })
    .withMessage("Content must not exceed 5000 characters"),
];

export const validatePostId = [
  param("postId").isUUID().withMessage("Invalid post ID format"),
];

export const validateUserId = [
  param("userId").isUUID().withMessage("Invalid user ID format"),
];

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
