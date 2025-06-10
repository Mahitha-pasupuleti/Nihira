import redisClient from "../config/redis.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; // Assuming you're using this

export const getUsernameById = async (req, res) => {
    const userId = req.body.userId;

    try {
        // 1. Check Redis first
        let username = await redisClient.get(userId);

        // 2. If not in Redis, fetch from DB and cache it
        if (!username) {
            const user = await User.findById(userId).select("username");

            if (!user) {
                throw new ApiError(404, "User with given ID doesn't exist");
            }

            username = user.username;
            redisClient.set(userId, username, 'EX', 7200); // Cache the username for future
        }

        // 3. Return the username
        return res.status(200).json(
            new ApiResponse(200, { username }, "Username fetched successfully")
        );

    } catch (error) {
        console.error("❌ Error in getUsernameById:", error);
        throw new ApiError(500, "Something went wrong internally while fetching from redis");
    }
};
