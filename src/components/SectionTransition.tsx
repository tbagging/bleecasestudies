const SectionTransition = () => {
  return (
    <div className="relative h-24 overflow-hidden">
      <svg 
        className="absolute bottom-0 w-full h-24" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,20 L1200,120 L0,120 Z" 
          className="fill-primary"
        />
      </svg>
      <svg 
        className="absolute bottom-0 w-full h-24" 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none"
      >
        <path 
          d="M0,20 C150,80 350,20 600,60 C850,80 1050,20 1200,40 L1200,120 L0,120 Z" 
          className="fill-background opacity-90"
        />
      </svg>
    </div>
  );
};

export default SectionTransition;