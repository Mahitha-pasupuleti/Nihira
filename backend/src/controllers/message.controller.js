// To get all messages of current user(sender/reciever) and friend(sender/reciever)
// The sent messages should be on right, recieved messages should be on left
// They should be sorted in reverse order based on their recent timeline

import Message from "../models/message.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const getConversation = asyncHandler( async (req, res) => {
    
    try {
        const {userId, friendId, page = 1, pageSize = 20} = req.body
        const skip = (page-1) * pageSize

        if (!userId || !friendId) {
            throw new ApiError(400, "Both userId and friendId are required");
        }
        
        // If both exists fetch from mongodb, their messages
        const messages = await Message.find({
            $or: [
                { senderId: userId, recipientId: friendId },
                { senderId: friendId, recipientId: userId }
            ]
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(pageSize)

        // counting total Messages b/w user and friend
        const totalMessageCount = await Message.countDocuments({
            $or: [
                { senderId: userId, recipientId: friendId },
                { senderId: friendId, recipientId: userId }
            ]
        })

        const hasMore = skip + messages.length < totalMessageCount;

        return res
            .status(200)
            .json(new ApiResponse(200, { messages, hasMore }, "Success"));
    } catch (error) {
        throw new ApiError(
            error?.statusCode || 500,
            error?.message || "Failed to get conversation"
        );
    }
    
})

export default getConversation;