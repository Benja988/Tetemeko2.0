'use client';

import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';

interface ComingSoonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  launchDate?: string;
  className?: string;
}

const ComingSoonModal: React.FC<ComingSoonModalProps> = ({
  isOpen,
  onClose,
  title = 'Coming Soon',
  description = "We're working hard to bring you something amazing. Stay tuned!",
  launchDate,
  className = '',
}) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  // Debounced onClose to prevent rapid toggling
  const debouncedOnClose = debounce(onClose, 300);

  // Manage body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      debouncedOnClose();
    }
  };

  // Handle email submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setIsEmailInvalid(true);
      return;
    }
    console.log('Email submitted:', email); // Replace with backend call
    setIsSubscribed(true);
    setEmail('');
    setIsEmailInvalid(false);
  };

  // Handle social sharing
  const handleSocialShare = (platform: string) => {
    console.log(`Sharing on ${platform}`);
    // Add proper share dialog logic here
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity duration-200 ${
        isOpen ? 'opacity-100' : 'opacity-0'
      }`}
      onClick={handleOverlayClick}
      style={{ willChange: 'opacity' }}
    >
      <div
        className={`relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-transform duration-200 ${
          isOpen ? 'scale-100' : 'scale-95'
        } ${className}`}
      >
        {/* Close Button */}
        <button
          onClick={debouncedOnClose}
          className="absolute top-3 right-3 p-1.5 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Main Content */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">{title}</h2>
          <p className="text-gray-600 mb-4">{description}</p>

          {launchDate && (
            <div className="bg-indigo-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm text-gray-700">
                  Expected launch: <span className="font-medium text-indigo-600">{launchDate}</span>
                </span>
              </div>
            </div>
          )}

          {!isSubscribed ? (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-3 font-medium">Get notified when we launch</p>
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setIsEmailInvalid(false);
                    }}
                    placeholder="Your email address"
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                      isEmailInvalid ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {isEmailInvalid && (
                    <span className="absolute -bottom-5 left-0 text-xs text-red-500">Please enter a valid email</span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Notify Me
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-green-50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-700 font-medium">You're on the list! We'll notify you when we launch.</span>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
              Twitter
            </button>
            <button
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
              Facebook
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          .transition-opacity,
          .transition-transform {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonModal;