import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";

const searchUsers = asyncHandler( async(req, res) => {
    try {
        const { searchString } = req.body
        if ( !searchString ) {
            throw new ApiError(400, "Need something to search...");
        }

        const userList = await User.find({
            username: { $regex: `^${searchString}` }
        })
        .select('username _id')
        .limit(4)

        return res
            .status(200)
            .json(new ApiResponse(200, { userList }, "Success"));
    } catch (error) {
        throw new ApiError(
            error?.statusCode || 500,
            error?.message || "Failed to fetch users"
        );
    }
})

export default searchUsers;