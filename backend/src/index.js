// require('dotenv').config({path: './env'})
import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";
import { server } from "./app.js";

dotenv.config({
    path: './.env' // './.env' works as well
})

connectDB()
.then(() => {
    server.on("ERROR", (error) => {
        console.log("ERROR: ", error);
        throw error
    })
    server.listen(process.env.PORT || 8000, () => {
        console.log('🚀 Server is running at port : ' + process.env.PORT );
    })
})
.catch((err) => {
    console.log("❌ Mongo DB connection failed !!! ", err);
});