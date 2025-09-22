import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME||"dm7wfcuvr",
  api_key: process.env.CLOUDINARY_API_KEY||"151657923663325",
  api_secret: process.env.CLOUDINARY_API_SECRET||"PHl_x4RxV48ATTPzsfICz5T4EHY",
});

export default cloudinary;