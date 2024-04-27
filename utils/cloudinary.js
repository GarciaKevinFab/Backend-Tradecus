// cloudinaryConfig.js
import cloudinary from "cloudinary";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadImage = async (imageBuffer) => {
//   try {
//     const result = await cloudinary.uploader.upload(
//       imageBuffer.toString("base64"),
//       {
//         folder: "bookstore", // Reemplaza 'bokkstore' con el nombre de tu carpeta en Cloudinary
//       }
//     );
//     return { secureUrl: result.secure_url, publicId: result.public_id };
//   } catch (error) {
//     console.error("Error al cargar la imagen a Cloudinary:", error);
//     throw error; // Propaga el error para obtener más detalles en el controlador
//   }
// };

//función que sube varias imágenes
const uploadImages = async (imageBuffers) => {
    try {
        const uploadPromises = imageBuffers.map(async (imageBuffer) => {
            const result = await cloudinary.uploader.upload(imageBuffer.toString("base64"), {
                folder: "bookstore", // Reemplaza 'bookstore' con el nombre de tu carpeta en Cloudinary
            });
            return { secureUrl: result.secure_url, publicId: result.public_id };
        });

        const uploadedImages = await Promise.all(uploadPromises);
        return uploadedImages;
    } catch (error) {
        console.error("Error al cargar las imágenes a Cloudinary:", error);
        throw error; // Propaga el error para obtener más detalles en el controlador
    }
};

export { uploadImages };