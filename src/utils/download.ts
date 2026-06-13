/**
 * Loads an image from a URL/Src path.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // Avoid CORS issues if external URLs are ever used
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Merges the isolated subject image with the selected background using Canvas API,
 * and triggers a client-side download.
 * 
 * @param imageSrc Object URL of the transparent isolated subject.
 * @param filename Desired name of the exported file (without extension).
 * @param backgroundType Preset background type: 'transparent' | 'white' | 'black' | 'gradient' | 'custom'
 * @param customColor Hex value of the custom background color, used if backgroundType is 'custom'.
 */
export async function downloadImage(
  imageSrc: string,
  filename: string,
  backgroundType: 'transparent' | 'white' | 'black' | 'gradient' | 'custom',
  customColor?: string
): Promise<void> {
  try {
    const img = await loadImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D context for exporting.');
    }

    // 1. Draw Background
    if (backgroundType !== 'transparent') {
      ctx.fillStyle = '#ffffff'; // Default fallback

      if (backgroundType === 'white') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backgroundType === 'black') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backgroundType === 'custom' && customColor) {
        ctx.fillStyle = customColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else if (backgroundType === 'gradient') {
        // Create diagonal gradient from top-left (Primary: #001736) to bottom-right (Cream: #e7e1ae)
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, '#001736');
        gradient.addColorStop(1, '#e7e1ae');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
    }

    // 2. Draw Subject Overlay
    ctx.drawImage(img, 0, 0);

    // 3. Export and Trigger Download
    const exportFormat = backgroundType === 'transparent' ? 'image/png' : 'image/jpeg';
    const fileExtension = backgroundType === 'transparent' ? 'png' : 'jpg';
    
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error('Failed to export canvas blob.');
      }
      
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${filename}_bgoff.${fileExtension}`;
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 100);
    }, exportFormat, 0.95);

  } catch (error) {
    console.error('Error during image export and download:', error);
    throw error;
  }
}
