// Image compression utility to reduce file sizes before storage
export const compressImage = async (file: File, maxSizeKB: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions to reduce file size
      let { width, height } = img;
      const maxDimension = 1200; // Max width or height

      if (width > maxDimension || height > maxDimension) {
        const ratio = Math.min(maxDimension / width, maxDimension / height);
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);

      // Start with high quality and reduce until size is acceptable
      let quality = 0.9;
      let compressedDataUrl = canvas.toDataURL('image/jpeg', quality);

      // Keep reducing quality until we're under the size limit
      while (quality > 0.1) {
        const sizeKB = (compressedDataUrl.length * 3) / 4 / 1024; // Rough base64 size calculation
        if (sizeKB <= maxSizeKB) break;
        
        quality -= 0.1;
        compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      }

      // Final check - if still too large, reduce dimensions further
      if ((compressedDataUrl.length * 3) / 4 / 1024 > maxSizeKB) {
        canvas.width = width * 0.8;
        canvas.height = height * 0.8;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
      }

      resolve(compressedDataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Please select a valid image file.' };
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB limit before compression
    return { isValid: false, error: 'Image file is too large. Please select an image smaller than 10MB.' };
  }
  
  return { isValid: true };
};

export const testLocalStorageCapacity = (): { available: boolean; error?: string } => {
  try {
    const testKey = 'storage_test';
    const testData = 'x'.repeat(1024); // 1KB test
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return { available: true };
  } catch (error) {
    return { 
      available: false, 
      error: 'Storage limit exceeded. Please reduce the number of images or contact support.' 
    };
  }
};
