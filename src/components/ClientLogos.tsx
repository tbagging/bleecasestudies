const ClientLogos = () => {
  // In a real app, this would come from your state management or API
  const logos = [
    { name: "TechCorp", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=TechCorp" },
    { name: "InnovateCo", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=InnovateCo" },
    { name: "GlobalTech", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=GlobalTech" },
    { name: "DataFlow", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=DataFlow" },
    { name: "CloudSync", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=CloudSync" },
    { name: "NextGen", url: "https://via.placeholder.com/120x60/34767E/ffffff?text=NextGen" }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-sm font-title font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by industry leaders
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center h-16 p-4">
              <img 
                src={logo.url} 
                alt={logo.name} 
                className="max-h-12 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;