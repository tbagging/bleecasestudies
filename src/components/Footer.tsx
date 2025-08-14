import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";

const Footer = () => {
  const { footerContent } = useContent();
  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <p className="text-xl font-body text-primary-foreground/90 max-w-3xl mx-auto mb-8">
            {footerContent.description}
          </p>
          
          <Button 
            variant="outline" 
            size="lg"
            className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary transition-colors duration-300"
          >
            {footerContent.buttonText}
          </Button>
        </div>
        
        <div className="border-t border-primary-foreground/30 pt-6">
          <p className="text-primary-foreground/70 font-body">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;