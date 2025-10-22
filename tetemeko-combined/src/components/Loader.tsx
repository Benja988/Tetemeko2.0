// src/components/Loader.tsx

import React from 'react';

interface LoaderProps {
  message?: string;
  size?: number; // size in pixels
}

const Loader: React.FC<LoaderProps> = ({ message = 'Loading...', size = 48 }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <svg
        className="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        style={{ width: size, height: size, color: 'var(--color-spinner)' }}
        aria-label="Loading spinner"
        role="img"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="var(--color-light)"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="var(--color-spinner)"
          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
        />
      </svg>
      <p
        className="mt-4 text-lg font-medium select-none"
        style={{ color: 'var(--color-spinner)' }}
      >
        {message}
      </p>
    </div>
  );
};

export default Loader;
