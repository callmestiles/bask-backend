import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";
import streamifier from "streamifier";

interface UploadResult {
  url: string;
  publicId: string;
  mediaType: "image" | "video";
}

export const uploadToCloudinary = (
  fileBuffer: Buffer,
  resourceType?: "image" | "video"
): Promise<UploadResult> => {
  return new Promise((resolve, reject) => {
    // Determine folder based on resource type
    const folder =
      resourceType === "video" ? "bask/post_videos" : "bask/post_pictures";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "auto", // Automatically detect if it's image or video
      },
      (error, result: UploadApiResponse | undefined) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else if (result) {
          const mediaType =
            result.resource_type === "video" ? "video" : "image";
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            mediaType: mediaType,
          });
        } else {
          reject(new Error("Upload failed - no result returned"));
        }
      }
    );

    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};

export const deleteFromCloudinary = async (
  publicId: string
): Promise<boolean> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === "ok";
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    return false;
  }
};
