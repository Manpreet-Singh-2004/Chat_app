import express from "express";
import handleWebhook from "../controllers/webhooks/clerkWebhook.js";

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

export default router;