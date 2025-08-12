export const extractDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('hsl(var(--muted))');
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const colorCounts: { [key: string]: number } = {};
        
        // Sample every 4th pixel for performance
        for (let i = 0; i < data.length; i += 16) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          
          // Skip transparent or very light pixels
          if (a < 128 || (r > 240 && g > 240 && b > 240)) continue;
          
          // Convert to HSL and use hue for grouping
          const hsl = rgbToHsl(r, g, b);
          const hue = Math.round(hsl[0] / 30) * 30; // Group by 30-degree segments
          const sat = Math.round(hsl[1] * 100);
          const light = Math.round(hsl[2] * 100);
          
          // Ensure minimum saturation and lightness for vibrant colors
          if (sat < 20 || light < 15 || light > 85) continue;
          
          const key = `${hue}-${Math.round(sat / 20) * 20}-${Math.round(light / 20) * 20}`;
          colorCounts[key] = (colorCounts[key] || 0) + 1;
        }
        
        if (Object.keys(colorCounts).length === 0) {
          resolve('hsl(var(--primary))');
          return;
        }
        
        // Find most common color
        const dominantColor = Object.entries(colorCounts)
          .sort(([,a], [,b]) => b - a)[0][0];
        
        const [hue, sat, light] = dominantColor.split('-').map(Number);
        
        // Adjust for card background use - lighter and less saturated
        const adjustedSat = Math.min(sat, 40);
        const adjustedLight = Math.max(light, 85);
        
        resolve(`hsl(${hue}, ${adjustedSat}%, ${adjustedLight}%)`);
      } catch (error) {
        console.error('Error extracting color:', error);
        resolve('hsl(var(--muted))');
      }
    };
    
    img.onerror = () => {
      resolve('hsl(var(--muted))');
    };
    
    img.src = imageSrc;
  });
};

const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s, l];
};