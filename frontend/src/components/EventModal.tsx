'use client';

import { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaCalendarAlt } from 'react-icons/fa';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  date: string;
}

const EventModal: FC<EventModalProps> = ({ isOpen, onClose, title, description, date }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <div
              className="bg-blue-900 text-white rounded-xl max-w-lg w-full p-6 relative shadow-xl border border-blue-700"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-blue-400"
              >
                <FaTimes size={18} />
              </button>

              <h2 className="text-2xl font-bold mb-2">{title}</h2>

              {/* Date */}
              <div className="flex items-center text-blue-200 text-sm mb-4 gap-2">
                <FaCalendarAlt />
                <span>{date}</span>
              </div>

              <p className="text-blue-200 text-sm leading-relaxed">{description}</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EventModal;
