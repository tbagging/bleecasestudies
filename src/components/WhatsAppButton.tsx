import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = "972542398076";
    
    // Create a simple link element and click it to avoid popup blockers
    const link = document.createElement('a');
    link.href = `https://wa.me/${phoneNumber}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    
    // Temporarily add to DOM, click, then remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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