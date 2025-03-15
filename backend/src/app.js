import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { createServer } from "http";
import { Server } from "socket.io";
import redis from "./config/redis.js";
import { handleSocketEvents } from "./controllers/socket.controller.js"
import { authenticationHandler } from "./controllers/authentication.controller.js"
import { ApiError } from "./utils/ApiError.js";
import communicationRouter from './routes/communication.routes.js'

const app = express();

// Create an HTTP server
const server = createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CORS_ORIGIN,
        credentials: true
    }
});

// We are using a middleware
io.use( async (socket, next) => {
    const authHeader = socket.handshake.headers['authorization']
    console.log(authHeader)

    if ( await authenticationHandler(authHeader) == true ) {
        console.log("Connect")
        next();
    } else {
        console.log("disconnect")
        socket.disconnect(true);
    }
});

// Socket.IO connection handler
io.on("connection", (socket) => {

    console.log("🔥 New client connected:", socket.id);
    handleSocketEvents(socket, io);

    // Handle user disconnect
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});

// Explore more about cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"))
app.use(cookieParser())


// routes declaration
app.use("/api/v1/communications", communicationRouter)

export { app, server }
export { io }