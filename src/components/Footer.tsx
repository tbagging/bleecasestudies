import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";
import { useState } from "react";
import ContactForm from "./ContactForm";

const Footer = () => {
  const { footerContent } = useContent();
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  
  return (
    <footer 
      className="bg-primary text-primary-foreground py-12 relative"
      style={{
        backgroundImage: `url('/lovable-uploads/e1757da9-604a-414d-8251-255529943135.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-primary/80"></div>
      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
        <div className="mb-6">
          <p className="text-2xl font-body text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {footerContent.description}
          </p>
          
          <Button 
            onClick={() => setIsContactFormOpen(true)}
            variant="outline" 
            size="lg"
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors duration-300 text-xl"
          >
            {footerContent.buttonText}
          </Button>
          
          <ContactForm 
            isOpen={isContactFormOpen} 
            onClose={() => setIsContactFormOpen(false)} 
          />
        </div>
        
        <div className="border-t border-primary-foreground/30 pt-6">
          <p className="text-lg text-primary-foreground/70 font-body">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;