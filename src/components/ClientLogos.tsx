const ClientLogos = () => {
  const logos = [
    "Microsoft", "Google", "Amazon", "Meta", "Apple", "Netflix", 
    "Spotify", "Uber", "Airbnb", "Stripe", "Slack", "Zoom"
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-6">
        <h3 className="text-center text-sm font-medium text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by industry leaders
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
          {logos.map((logo, index) => (
            <div key={index} className="flex items-center justify-center h-12">
              <span className="text-lg font-semibold text-muted-foreground/60 hover:text-muted-foreground transition-colors">
                {logo}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogos;