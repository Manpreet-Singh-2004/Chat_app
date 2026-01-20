import express from "express";
import handleWebhook from "../controllers/webhooks/clerkWebhook.js";
import userProfile from "../controllers/user/UserData.js";
import getUsers from "../controllers/user/GetUsers.js";
import {getChatId} from "../controllers/chat/Chat.js";
import authMiddleware from '../middleware/auth.js'
import acceptDMInvite from "../controllers/invite/AcceptDMInvite.js";
import declineDMInvite from "../controllers/invite/DeclineDMInvite.js";
import inviteToDM from "../controllers/invite/inviteController.js";
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

router.get("/user/profile", userProfile)
router.get("/users", authMiddleware.getAuthenticatedUser ,getUsers)
router.get("/chats/dm/", authMiddleware.getAuthenticatedUser ,getChatId)

export default router;