// import {v2 as cloudinary} from "cloudinary"
// import { response } from "express"
// import fs from "fs"

// // Configuration
// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         if (!localFilePath) return null
//         //upload the flie on cloudinary
//         const uploadResult = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: "auto"
//         })
//         // file has been uploaded sucessfully
//         console.log("file is uploaded on cloudinary ", uploadResult.url);
//         fs.unlinkSync(localFilePath)
//         return uploadResult
//     } catch (error) {
//         fs.unlinkSync(localFilePath) // remove the locally saved temporary file as the upload operation got failed
//         return null;
//     }
// }

// export { uploadOnCloudinary }