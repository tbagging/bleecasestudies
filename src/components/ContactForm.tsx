import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactForm = ({ isOpen, onClose }: ContactFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    message: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://hook.us2.make.com/fdasjp9j89mg2mwo5l5vmh98bcjktug3");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('contact-webhook', {
        body: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          organization: formData.organization,
          position: formData.position,
          message: formData.message,
          webhookUrl: webhookUrl,
          timestamp: new Date().toISOString()
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }

      // Check if the response indicates a webhook delivery failure
      if (data && data.error) {
        throw new Error(data.message || 'Webhook delivery failed');
      }

      toast({
        title: "Form Submitted Successfully",
        description: "We'll get back to you soon!",
      });
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        message: ""
      });
      
      onClose();
      
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary font-title text-center">Speak to an expert</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          {/* Reach out Directly Section */}
          <div className="lg:col-span-2 order-2 lg:order-1">
            <div className="bg-primary rounded-lg p-6 text-primary-foreground h-full relative overflow-hidden" style={{backgroundImage: 'url(/lovable-uploads/cf7219b1-65cc-4ad2-892e-33ca3dc54528.png)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
              <div className="absolute inset-0 bg-primary/70 rounded-lg"></div>
              <div className="relative z-10 p-6 text-center h-full flex flex-col justify-center">
                <img 
                  src="/lovable-uploads/e05b80ef-55e5-45e6-85b7-ec1d92c3c898.png" 
                  alt="BLEE Logo" 
                  className="w-32 h-auto mx-auto mb-4"
                />
                <h3 className="text-xl font-bold mb-4">Or reach out directly</h3>
                
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/b00fba53-4f82-4959-a863-4f027e313a63.png" 
                    alt="Expert profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <p className="mb-6 font-bold">Tomer our CEO would love to hear from you by:</p>
                
                <div className="space-y-3">
                  <a 
                    href="mailto:tomer@bleehackathons.com" 
                    className="flex items-center justify-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-lg p-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                  </a>
                  
                  <a 
                    href="tel:7722825731"
                    className="flex items-center justify-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-lg p-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                    </svg>
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold text-primary">First name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold text-primary">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold text-primary">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="font-bold text-primary">Phone</Label>
            <div className="flex">
              <Select defaultValue="+1">
                <SelectTrigger className="w-20 border-b-2 border-x-0 border-t-0 rounded-none bg-transparent">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="+1">🇺🇸 +1</SelectItem>
                  <SelectItem value="+44">🇬🇧 +44</SelectItem>
                  <SelectItem value="+972">🇮🇱 +972</SelectItem>
                </SelectContent>
              </Select>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="flex-1 border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="organization" className="font-bold text-primary">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => handleInputChange("organization", e.target.value)}
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="font-bold text-primary">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-bold text-primary">How can we help?</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="If you have a specific hackathon in mind, tell us everything you can about it."
              rows={4}
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent resize-none"
            />
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            variant="outline"
            className="w-full bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300 rounded-full py-6 text-xl disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;