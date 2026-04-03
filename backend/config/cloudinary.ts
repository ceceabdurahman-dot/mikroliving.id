import { v2 as cloudinary } from "cloudinary";
import { CLOUDINARY_CONFIG } from "./env";

cloudinary.config({
  cloud_name: CLOUDINARY_CONFIG.cloudName,
  api_key: CLOUDINARY_CONFIG.apiKey,
  api_secret: CLOUDINARY_CONFIG.apiSecret,
});

export function isCloudinaryConfigured() {
  return Boolean(
    CLOUDINARY_CONFIG.cloudName &&
      CLOUDINARY_CONFIG.apiKey &&
      CLOUDINARY_CONFIG.apiSecret,
  );
}

export { cloudinary };
