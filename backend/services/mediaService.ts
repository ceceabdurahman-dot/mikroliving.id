import { HttpError } from "../errors/httpError";
import { cloudinary, isCloudinaryConfigured } from "../config/cloudinary";
import { logger } from "../utils/logger";
import { toPublicIdBase } from "../utils/strings";

export async function uploadProjectImage(fileName: string, dataUrl: string) {
  if (!isCloudinaryConfigured()) {
    throw new HttpError(500, "Cloudinary is not configured on the server.");
  }

  try {
    const uploadResult = await cloudinary.uploader.upload(dataUrl, {
      folder: "mikroliving/projects",
      resource_type: "image",
      public_id: `${toPublicIdBase(fileName)}-${Date.now()}`,
    });

    return {
      success: true,
      imageUrl: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    };
  } catch (error) {
    logger.error("cloudinary_upload_failed", {
      file_name: fileName,
      error,
    });
    throw new HttpError(500, "Failed to upload image to Cloudinary.");
  }
}

export function getOptimizedImageUrl(publicId: string, width?: unknown, height?: unknown) {
  if (!isCloudinaryConfigured()) {
    throw new HttpError(500, "Cloudinary is not configured on the server.");
  }

  const url = cloudinary.url(publicId, {
    width: Number(width) || 800,
    height: Number(height) || 500,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
  });

  return { url };
}
