import { useContent } from "@/contexts/ContentContext";
import { useState, useEffect } from "react";

const ClientLogos = () => {
  const { clientLogos } = useContent();
  const [logoSizes, setLogoSizes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const checkLogoDimensions = async () => {
      const sizes: { [key: string]: string } = {};
      
      for (const logo of clientLogos) {
        try {
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = logo.url;
          });
          
          const aspectRatio = img.width / img.height;
          
          // If width is significantly larger than height (long logo), make it larger
          if (aspectRatio > 1.5) {
            sizes[logo.url] = "max-h-12 max-w-full"; // Larger for long logos
          } else {
            sizes[logo.url] = "max-h-10 max-w-full"; // Standard size for square/tall logos
          }
        } catch (error) {
          // Fallback to standard size if image fails to load
          sizes[logo.url] = "max-h-10 max-w-full";
        }
      }
      
      setLogoSizes(sizes);
    };

    if (clientLogos.length > 0) {
      checkLogoDimensions();
    }
  }, [clientLogos]);

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-sm font-title font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by industry leaders
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {clientLogos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center h-16 p-4">
              <img 
                src={logo.url} 
                alt={logo.name} 
                className={`${logoSizes[logo.url] || 'max-h-10 max-w-full'} object-contain opacity-60 hover:opacity-100 transition-opacity`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;