import express from "express";
import 'dotenv/config'
import {clerkMiddleware} from "@clerk/express"
import router from "./routes/routes.js";
import cors from "cors";
import handleWebhook from "./controllers/webhooks/clerkWebhook.js";


const app = express();

const PORT = 3000

// Global Tester Start
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] Incoming Request: ${req.method} ${req.originalUrl}`);
  next();
});
// Global tester end

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.post(
  "/api/webhooks/clerk",
  express.raw({ type: "application/json" }),
  handleWebhook
);

app.use(clerkMiddleware())

// app.use((req, res, next) => {
//   if (req.path === '/api/webhooks/clerk') {
//     next();
//   } else {
//     express.json()(req, res, next);
//   }
// });


app.use(express.json())


app.use("/api",router)


app.get("/", (req, res) =>{
  res.json({ok: true, message: `Welcome to the home page, Port: ${PORT}`})
})


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
