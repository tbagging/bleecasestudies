import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = "+972542398076";
    
    // Simple approach - just open the phone number
    // This will work on mobile devices and desktop without API calls
    window.open(`tel:${phoneNumber}`, '_self');
    
    // For desktop users, also show a helpful message
    const isDesktop = !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isDesktop) {
      setTimeout(() => {
        alert(`Call us at: ${phoneNumber}\n\nOr message us on WhatsApp at this number!`);
      }, 100);
    }
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