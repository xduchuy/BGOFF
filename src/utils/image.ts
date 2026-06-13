/**
 * Resizes an image file if its width or height exceeds maxDimension.
 * Maintains aspect ratio and returns a Blob representing the resized image.
 * 
 * @param file The original image file selected by the user.
 * @param maxDimension The maximum length of the longest edge (default 1536px).
 * @returns A Promise resolving to the resized image Blob, or the original file if no resizing was needed.
 */
export async function resizeImage(file: File, maxDimension: number = 1536): Promise<Blob> {
  return new Promise((resolve, reject) => {
    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Only images are supported.'));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const width = img.naturalWidth;
      const height = img.naturalHeight;

      // If both dimensions are within the threshold, use the original file
      if (width <= maxDimension && height <= maxDimension) {
        resolve(file);
        return;
      }

      // Calculate new dimensions preserving aspect ratio
      let targetWidth = width;
      let targetHeight = height;

      if (width > height) {
        if (width > maxDimension) {
          targetHeight = Math.round((height * maxDimension) / width);
          targetWidth = maxDimension;
        }
      } else {
        if (height > maxDimension) {
          targetWidth = Math.round((width * maxDimension) / height);
          targetHeight = maxDimension;
        }
      }

      // Perform resizing using Canvas API
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get 2D context for image resizing.'));
        return;
      }

      // Use good image scaling interpolation
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw the image scaled
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      // Export canvas as Blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Canvas export to Blob failed.'));
          }
        },
        file.type, // Maintain original format (e.g. image/jpeg, image/png)
        0.9        // High quality setting for JPEGs
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to load image file.'));
    };

    img.src = objectUrl;
  });
}
