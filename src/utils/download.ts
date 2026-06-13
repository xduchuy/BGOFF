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
/**
 * Applies a linear $O(N)$ sliding-window box blur to the alpha channel of ImageData,
 * and composites it back by multiplying the original alpha by the blurred alpha.
 * This perfectly mimics the SVG edge-feathering filter on the CPU for cross-browser stability (e.g. Safari).
 */
function featherImageData(imageData: ImageData, radius: number): void {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const len = width * height;
  
  const alpha = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    alpha[i] = data[i * 4 + 3];
  }
  
  const temp = new Uint8Array(len);
  const r = Math.round(radius);
  if (r <= 0) return;

  // Horizontal blur pass
  for (let y = 0; y < height; y++) {
    const rowOffset = y * width;
    let sum = 0;
    let count = 0;
    
    // Initialize window
    for (let dx = -r; dx <= r; dx++) {
      if (dx >= 0 && dx < width) {
        sum += alpha[rowOffset + dx];
        count++;
      }
    }
    temp[rowOffset] = sum / count;
    
    for (let x = 1; x < width; x++) {
      const nextX = x + r;
      if (nextX < width) {
        sum += alpha[rowOffset + nextX];
        count++;
      }
      const prevX = x - r - 1;
      if (prevX >= 0) {
        sum -= alpha[rowOffset + prevX];
        count--;
      }
      temp[rowOffset + x] = sum / count;
    }
  }
  
  // Vertical blur pass & multiplication composite back
  for (let x = 0; x < width; x++) {
    let sum = 0;
    let count = 0;
    
    // Initialize window
    for (let dy = -r; dy <= r; dy++) {
      if (dy >= 0 && dy < height) {
        sum += temp[dy * width + x];
        count++;
      }
    }
    
    const firstIdx = x * 4 + 3;
    data[firstIdx] = Math.round(data[firstIdx] * ((sum / count) / 255));
    
    for (let y = 1; y < height; y++) {
      const nextY = y + r;
      if (nextY < height) {
        sum += temp[nextY * width + x];
        count++;
      }
      const prevY = y - r - 1;
      if (prevY >= 0) {
        sum -= temp[prevY * width + x];
        count--;
      }
      
      const idx = (y * width + x) * 4 + 3;
      data[idx] = Math.round(data[idx] * ((sum / count) / 255));
    }
  }
}

export async function downloadImage(
  imageSrc: string,
  filename: string,
  backgroundType: 'transparent' | 'white' | 'black' | 'gradient' | 'custom',
  customColor?: string,
  featherAmount: number = 0
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

    // 1. Draw and process the subject cutout on a temporary canvas to apply feathering without background interference
    const subjectCanvas = document.createElement('canvas');
    subjectCanvas.width = canvas.width;
    subjectCanvas.height = canvas.height;
    const sCtx = subjectCanvas.getContext('2d');
    if (!sCtx) {
      throw new Error('Failed to get 2D context for subject processing.');
    }

    sCtx.drawImage(img, 0, 0);

    // Apply manual edge feathering if enabled (cross-browser compatible CPU fallback)
    if (featherAmount > 0) {
      const imageData = sCtx.getImageData(0, 0, subjectCanvas.width, subjectCanvas.height);
      featherImageData(imageData, featherAmount);
      sCtx.putImageData(imageData, 0, 0);
    }

    // 2. Draw Background on main canvas
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

    // 3. Composite the processed subject onto the main canvas
    ctx.drawImage(subjectCanvas, 0, 0);

    // 4. Export and Trigger Download
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
