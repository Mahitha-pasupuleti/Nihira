import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken()

        // Save RefreshToken in DB
        user.refreshToken = refreshToken
        user.save( { validateBeforeSave: false } ) // Otherwise password required and other required fields will throw an error as per User model

        return { accessToken, refreshToken }

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler( async (req, res) => {

    const {username, password} = req.body
    console.log("username: ", username);

    const existedUser = await User.findOne({ username });

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const user = await User.create({
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
  
})


const loginUser = asyncHandler( async (req, res) => {
    /*
    req body -> data
    check username or email not null
    find the user
    password check
    access and refresh token
    send cookiesf
    */

    const { username, password } = req.body;

    if ( !username ) {
        throw new ApiError(400, "username is required")
    }

    const user = await User.findOne({
        $or: [{username}]
    })

    if (!user) {
        throw new ApiError(404, "User does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid password");
    }

    console.log(user._id)

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken  // sending accessToken & refreshToken is considered good based on the requirment
            },
            "User logged in successfully"
        )
    )

})


const logoutUser = asyncHandler( async ( req, res ) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true  // when we use new: true the response we get from the db query is the latest refreshToken value rather than the old one
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(201, {}, "User logged out successfully"))
})

const refreshAccessToken = asyncHandler ( async ( req, res ) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken.replace("Bearer ", "")
    if ( !incomingRefreshToken ) {
        throw new ApiError(401, "Unauthorized request")
    }

    try {
        const decodedToken = jwt.verify( incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET )
        if ( !decodedToken ) {
            throw new ApiError(404, "Invalid refresh token")
        }
    
        const user = await User.findById(decodedToken?._id)
        if ( !user ) {
            throw new ApiError(401, "Unauthorized request")
        }
    
        if ( incomingRefreshToken != user?.refreshToken ) {
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(201, { accessToken, refreshToken }, "Access token refreshed"))
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
})


export { 
    registerUser, 
    loginUser,
    logoutUser,
    refreshAccessToken
}