'use client';

import { StepProps } from '@/types/step-props';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone } from 'react-icons/fi';

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

export default function StepOne({ onNext, formData, setFormData }: StepProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-md mx-auto px-4 py-6"
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-800 mb-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Personal Information
      </motion.h2>

      <div className="space-y-5">
        {[
          {
            id: 'name',
            label: 'Full Name',
            icon: <FiUser className="text-gray-500" />,
            type: 'text',
            placeholder: 'John Doe',
            value: formData.name
          },
          {
            id: 'email',
            label: 'Email Address',
            icon: <FiMail className="text-gray-500" />,
            type: 'email',
            placeholder: 'you@example.com',
            value: formData.email
          },
          {
            id: 'phone',
            label: 'Phone Number',
            icon: <FiPhone className="text-gray-500" />,
            type: 'tel',
            placeholder: '+254 712 345 678',
            value: formData.phone
          }
        ].map((field, i) => (
          <motion.div
            key={field.id}
            custom={i}
            variants={fieldVariants}
            initial="hidden"
            animate="visible"
          >
            <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {field.icon}
              </div>
              <input
                id={field.id}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-800 
                  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={field.value}
                onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              />
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-end pt-4"
        >
          <button
            onClick={onNext}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg 
              hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg
              flex items-center gap-2"
          >
            Continue
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}