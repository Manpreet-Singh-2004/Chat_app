import express from "express";
import 'dotenv/config'
import {clerkMiddleware} from "@clerk/express"
import router from "./routes/routes.js";
import cors from "cors";


const app = express();
const PORT = 3000

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(clerkMiddleware())
app.use(express.json())


app.use("/api",router)


app.get("/", (req, res) =>{
  res.json({ok: true, message: `Welcome to the home page, Port: ${PORT}`})
})


app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
