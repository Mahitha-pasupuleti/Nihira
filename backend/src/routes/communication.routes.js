import { Router } from "express";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { handleSocketEvents } from "../controllers/socket.controller.js"
import getConversation from "../controllers/message.controller.js";
import searchUsers from "../controllers/searchUsers.controller.js";
import { getUsernameById } from "../services/user.redisService.js";

const router = Router();

router.route("/register").post(registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refreshAccessToken").post(refreshAccessToken)

// Protected route to send messages
router.route("/send").post(verifyJWT, handleSocketEvents);

// Protected route to fetch chat history
router.route("/conversation").post(verifyJWT, getConversation);

router.route("/search").post(verifyJWT, searchUsers);

router.route("/username").post(getUsernameById);

export default router