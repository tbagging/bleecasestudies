import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = "972542398076"; // +972542398076 without the + sign
    
    // Try multiple WhatsApp URL formats to ensure compatibility
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    let whatsappUrl;
    if (isMobile) {
      // Mobile: Try to open WhatsApp app directly
      whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
    } else {
      // Desktop: Use WhatsApp Web
      whatsappUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}`;
    }
    
    window.open(whatsappUrl, '_blank');
    
    // Fallback: if the above doesn't work, provide alternative
    setTimeout(() => {
      if (!document.hasFocus()) return; // User likely navigated away
      
      const fallbackMessage = `Please contact us on WhatsApp: +972542398076`;
      if (confirm(`${fallbackMessage}\n\nWould you like to copy the number to clipboard?`)) {
        navigator.clipboard.writeText('+972542398076').catch(() => {
          prompt('Copy this WhatsApp number:', '+972542398076');
        });
      }
    }, 2000);
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle size={24} />
    </button>
  );
};

export default WhatsAppButton;