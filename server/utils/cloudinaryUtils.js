/**
 * Extracts the Cloudinary public_id from a URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public_id or null if not valid
 */
export const extractPublicId = (url) => {
  try {
    // Cloudinary URLs look like:
    // https://res.cloudinary.com/<cloud>/image/upload/v123/folder/filename.ext
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    
    // After /upload/ we have: v123456/folder/filename.ext
    const afterUpload = parts[1];
    // Remove the version number (v123456/)
    const withoutVersion = afterUpload.replace(/^v\d+\//, "");
    // Remove file extension
    const publicId = withoutVersion.replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (error) {
    return null;
  }
};
