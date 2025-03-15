import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js";
import jwt from "jsonwebtoken";

export const authenticationHandler = async (authHeader) => {

    const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
    
    if (!token) {
        return false;
    }

    try {
        const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        if ( !decodedToken ) return false;

        const user = await User.findById(decodedToken?._id)
        if ( !user ) return false;

        return true;
    } catch(error) {
        return false;
    }

}