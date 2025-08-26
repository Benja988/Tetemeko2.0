// src/utils/toBase64.ts

/**
 * Converts a File object (e.g., from <input type="file" />) into a base64 string.
 * Useful for uploading images to services like Cloudinary.
 *
 * @param file - File object to convert
 * @returns Promise<string> - base64 encoded string
 */
export const toBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to convert file to base64"));
      }
    };

    reader.onerror = () => reject(new Error("File reading failed"));
  });
};
