import { Button } from "@/components/ui/button";
import { useContent } from "@/contexts/ContentContext";

const Footer = () => {
  const { footerContent } = useContent();
  return (
    <footer className="bg-teal-600 text-white py-12">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <div className="mb-6">
          <p className="text-xl font-body text-teal-100 max-w-3xl mx-auto mb-8">
            {footerContent.description}
          </p>
          
          <Button 
            variant="outline" 
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white hover:text-teal-600 transition-colors duration-300"
          >
            {footerContent.buttonText}
          </Button>
        </div>
        
        <div className="border-t border-teal-500 pt-6">
          <p className="text-teal-200 font-body">
            {footerContent.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;