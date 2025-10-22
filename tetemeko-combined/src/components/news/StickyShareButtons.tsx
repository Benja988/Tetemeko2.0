'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaFacebookF, 
  
  FaLinkedinIn, 
  FaWhatsapp, 
  FaTelegramPlane, 
  FaShareAlt,
  FaTimes,
  FaLink
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StickyShareButtons: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    // Get the current URL
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentUrl);
    setIsCopied(true);
    toast.success('Link copied to clipboard!', {
      position: 'bottom-right',
      autoClose: 2000,
    });
    
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareButtons = [
    {
      icon: <FaFacebookF size={18} />,
      name: 'Facebook',
      url: 'https://www.facebook.com/sharer/sharer.php?u=',
      color: '#4267B2',
    },
    {
      icon: <FaXTwitter size={18} />,
      name: 'Twitter',
      url: 'https://X.com/intent/tweet?url=',
      color: '#1DA1F2',
    },
    {
      icon: <FaLinkedinIn size={18} />,
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/shareArticle?mini=true&url=',
      color: '#0077B5',
    },
    {
      icon: <FaWhatsapp size={18} />,
      name: 'WhatsApp',
      url: 'https://api.whatsapp.com/send?text=',
      color: '#25D366',
    },
    {
      icon: <FaTelegramPlane size={18} />,
      name: 'Telegram',
      url: 'https://t.me/share/url?url=',
      color: '#0088cc',
    },
  ];

  return (
    <>
      {/* Main share button */}
      <div className="fixed left-6 bottom-6 z-50">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-14 h-14 rounded-full bg-primary shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          aria-label="Share options"
        >
          {isExpanded ? <FaTimes size={20} /> : <FaShareAlt size={20} />}
        </button>
      </div>

      {/* Expanded share options */}
      {isExpanded && (
        <div className="fixed left-6 bottom-24 z-50 flex flex-col space-y-4 items-center">
          {/* Copy link button */}
          <div className="relative group">
            <button
              onClick={copyToClipboard}
              className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 shadow-md flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Copy link"
            >
              {isCopied ? <FiCopy size={18} className="text-green-500" /> : <FaLink size={16} />}
            </button>
            <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              {isCopied ? 'Copied!' : 'Copy link'}
            </span>
          </div>

          {/* Social share buttons */}
          {shareButtons.map((button, index) => (
            <div key={index} className="relative group">
              <a
                href={`${button.url}${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full shadow-md flex items-center justify-center text-white hover:opacity-90 transition-all duration-300 transform hover:scale-105"
                style={{ backgroundColor: button.color }}
                aria-label={`Share on ${button.name}`}
              >
                {button.icon}
              </a>
              <span className="absolute left-14 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                {button.name}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Toast container (if using react-toastify) */}
      {/* You'll need to set up the ToastContainer in your layout */}
    </>
  );
};

export default StickyShareButtons;