'use client';

import { StepProps } from '@/types/step-props';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';

const services = [
  {
    id: 'radio-advertising',
    title: 'Radio Advertising',
    description: 'Reach thousands of listeners with our targeted radio spots',
    icon: '📻'
  },
  {
    id: 'podcast-hosting',
    title: 'Podcast Hosting',
    description: 'Professional podcast production and distribution services',
    icon: '🎙️'
  },
  {
    id: 'event-coverage',
    title: 'Live Event Coverage',
    description: 'Broadcast your event to a wider audience',
    icon: '🎪'
  },
  {
    id: 'production-services',
    title: 'Production Services',
    description: 'High-quality audio and video production',
    icon: '🎬'
  }
];

export default function StepTwo({ onNext, onBack, formData, setFormData }: StepProps) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <motion.h2 
        className="text-2xl font-bold text-gray-800 mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Select Your Service
      </motion.h2>
      <motion.p 
        className="text-gray-600 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Choose the service that best fits your needs
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {services.map((service, i) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1 }}
            whileHover={{ y: -5 }}
            className={`p-4 border rounded-xl cursor-pointer transition-all
              ${formData.service === service.id ? 
                'border-indigo-500 bg-indigo-50 shadow-md' : 
                'border-gray-200 hover:border-indigo-300 hover:shadow-sm'}`}
            onClick={() => setFormData({ ...formData, service: service.id })}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{service.icon}</span>
              <div>
                <h3 className="font-semibold text-gray-800">{service.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Additional Details
        </label>
        <textarea
          id="description"
          placeholder="Tell us more about your project needs..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none 
            focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </motion.div>

      <div className="flex justify-between pt-8">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg 
            transition flex items-center gap-2"
        >
          <FiArrowLeft /> Back
        </motion.button>
        <motion.button
          onClick={onNext}
          disabled={!formData.service}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-2.5 rounded-lg transition flex items-center gap-2
            ${formData.service ? 
              'bg-indigo-600 hover:bg-indigo-700 text-white' : 
              'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Next <FiArrowRight />
        </motion.button>
      </div>
    </motion.div>
  );
}