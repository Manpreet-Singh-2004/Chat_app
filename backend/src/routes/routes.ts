import express from "express";
import handleWebhook from "../controllers/webhooks/clerkWebhook.js";
import userProfile from "../controllers/user/UserData.js";
import getUsers from "../controllers/user/GetUsers.js";
import {getChatId} from "../controllers/chat/Chat.js";
import authMiddleware from '../middleware/auth.js'
import {acceptDMInvite} from "../controllers/invite/AcceptDMInvite.js";
import {declineDMInvite} from "../controllers/invite/DeclineDMInvite.js";
import {inviteToDM} from "../controllers/invite/inviteController.js";
import { getAuth } from '@clerk/express';

const router = express.Router();

router.post(
    "/webhooks/clerk",
    express.raw({type: "application/json"}),
    handleWebhook
)

router.get(
    "/health",
    (req, res) =>{
        res.json({ok: true, message: "Alive and working fine"})
    }
)

// Get a single profile
router.get("/user/profile", userProfile)
// Get all users
router.get("/users", authMiddleware.getAuthenticatedUser ,getUsers)

// -- Chats and DMs
// Invite
router.post("/chats/invite", authMiddleware.getAuthenticatedUser, inviteToDM)

// Response to invites
router.post("/chats/dm/:chatId/accept", authMiddleware.getAuthenticatedUser, acceptDMInvite)
router.post("/chats/dm/:chatId/decline", authMiddleware.getAuthenticatedUser, declineDMInvite)

// Get Chat
router.get("/chats/:chatId", authMiddleware.getAuthenticatedUser, getChatId)

// Lookup Chat by participants
// router.post("/chats/dm/lookup", authMiddleware.getAuthenticatedUser ,getChatId)

export default router;