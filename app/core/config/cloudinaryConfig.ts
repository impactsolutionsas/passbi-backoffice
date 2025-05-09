import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLAUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.CLAUDINARY_API_SECRET,
});

export default cloudinary;