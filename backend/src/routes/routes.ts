import express from "express";
import handleWebhook from "../controllers/webhooks/clerkWebhook.js";

const router = express.Router();

router.post(
    "/webhooks/clerk",
    express.raw({type: "application/json"}),
    handleWebhook
)

export default router;