import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import connectToSocket  from "./src/controllers/socketManager.js";
import userRoutes from "./src/routes/users.routes.js";
const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.use((req, res, next) => {
    console.log("Incoming Request:", req.method, req.url);
    next();
});
app.set("port", (process.env.PORT || 8000))
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({  extended: true }));

app.use("/api/v1/users", userRoutes);
app.get("/", (req, res)=>{
    return res.json({ "hello": "world" })
});
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("CONNECTED TO DB");
        server.listen(app.get("port"), () => {
            console.log(`LISTENING ON PORT ${app.get("port")}`)
        });
    } catch (error) {
        console.error("FAILED TO START SERVER", error);
        process.exit(1);
    }
}



start();
