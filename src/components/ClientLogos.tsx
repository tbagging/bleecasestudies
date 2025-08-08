import { useContent } from "@/contexts/ContentContext";

const ClientLogos = () => {
  const { clientLogos } = useContent();

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
                className="max-h-16 max-w-full object-contain opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;