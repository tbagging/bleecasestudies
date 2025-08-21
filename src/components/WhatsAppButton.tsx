import { MessageCircle, Copy } from "lucide-react";
import { useState } from "react";

const WhatsAppButton = () => {
  const [showCopied, setShowCopied] = useState(false);
  
  const handleClick = async () => {
    const phoneNumber = "+972542398076";
    
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = phoneNumber;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 flex items-center gap-2"
        aria-label="Copy WhatsApp number"
      >
        {showCopied ? (
          <>
            <Copy size={24} />
            <span className="text-sm font-medium">Copied!</span>
          </>
        ) : (
          <MessageCircle size={24} />
        )}
      </button>
      
      {!showCopied && (
        <div className="absolute bottom-full right-0 mb-2 bg-black text-white text-sm px-3 py-1 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Click to copy: +972542398076
        </div>
      )}
    </div>
  );
};

export default WhatsAppButton;