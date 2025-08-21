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
          <DialogTitle className="text-2xl font-bold text-primary font-sans text-center">Speak to an Expert</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-6">
          {/* Reach out Directly Section */}
          <div className="lg:col-span-2 order-1">
            <div className="bg-primary rounded-lg p-6 text-primary-foreground h-full">
              <div className="bg-accent/10 backdrop-blur-sm rounded-lg p-6 text-center h-full flex flex-col justify-center">
                <h3 className="text-xl font-bold mb-4">Reach out Directly</h3>
                
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <img 
                    src="/lovable-uploads/b00fba53-4f82-4959-a863-4f027e313a63.png" 
                    alt="Expert profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <p className="mb-6">Tomer our CEO would love to hear from you by:</p>
                
                <div className="space-y-3">
                  <a 
                    href="mailto:contact@blee.com" 
                    className="flex items-center justify-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-lg p-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                    Email
                  </a>
                  
                  <a 
                    href="https://wa.me/1234567890" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary-foreground/20 hover:bg-primary-foreground/30 transition-colors rounded-lg p-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.831 3.501"/>
                    </svg>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3 order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="font-bold">First name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                required
                className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="font-bold">Last name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="font-bold">Email *</Label>
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
            <Label htmlFor="phone" className="font-bold">Phone</Label>
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
            <Label htmlFor="organization" className="font-bold">Organization</Label>
            <Input
              id="organization"
              value={formData.organization}
              onChange={(e) => handleInputChange("organization", e.target.value)}
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position" className="font-bold">Position</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => handleInputChange("position", e.target.value)}
              className="border-b-2 border-x-0 border-t-0 rounded-none bg-transparent"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="font-bold">How can we help?</Label>
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
            className="w-full bg-black text-white hover:bg-gray-800 rounded-full py-6 text-lg disabled:opacity-50"
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