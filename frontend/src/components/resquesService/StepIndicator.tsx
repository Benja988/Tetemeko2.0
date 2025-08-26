'use client';

import { motion } from 'framer-motion';
import { FiInfo, FiList, FiCalendar, FiCheck } from 'react-icons/fi';

const steps = [
  { label: "Basic Info", icon: <FiInfo /> },
  { label: "Service Type", icon: <FiList /> },
  { label: "Schedule", icon: <FiCalendar /> },
  { label: "Confirmation", icon: <FiCheck /> },
];

export default function StepIndicator({ step }: { step: number }) {
  return (
    <div className="w-full px-4 sm:px-8 mb-8">
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
            initial={{ width: '0%' }}
            animate={{ 
              width: `${((step - 1) / (steps.length - 1)) * 100}%`,
              transition: { duration: 0.6, ease: 'easeOut' }
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative z-10 flex justify-between">
          {steps.map((s, index) => {
            const isCompleted = index + 1 < step;
            const isActive = index + 1 === step;
            const isPending = index + 1 > step;

            return (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center 
                  ${isCompleted ? 'bg-green-500 text-white' : ''}
                  ${isActive ? 'bg-white border-4 border-indigo-600 text-indigo-600 shadow-lg' : ''}
                  ${isPending ? 'bg-gray-100 text-gray-400 border-2 border-gray-300' : ''}
                  transition-all duration-300`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500 }}
                    >
                      <FiCheck size={20} />
                    </motion.div>
                  ) : (
                    <div className={isActive ? 'scale-110' : ''}>
                      {s.icon}
                    </div>
                  )}
                </div>
                <span className={`text-xs sm:text-sm mt-2 font-medium 
                  ${isCompleted ? 'text-green-600' : ''}
                  ${isActive ? 'text-indigo-600 font-semibold' : ''}
                  ${isPending ? 'text-gray-400' : ''}`}
                >
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}