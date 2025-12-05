import { Router } from "express";
import { getPosts, getEvents } from "../controllers/adminController";
import { getUsers } from "../controllers/userController";
import { authenticateToken, isAdmin } from "../middleware/auth";

const router = Router();

router.get("/users", authenticateToken, isAdmin, getUsers);
router.get("/posts", authenticateToken, isAdmin, getPosts);
router.get("/events", authenticateToken, isAdmin, getEvents);

export default router;
