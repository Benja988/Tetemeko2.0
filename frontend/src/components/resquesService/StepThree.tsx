'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-datepicker/dist/react-datepicker.css';
import { StepProps } from '@/types/step-props';

export default function StepThree({ onBack, onSubmit, formData, setFormData }: StepProps) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState<Date | null>(formData.date ? new Date(formData.date) : null);
  const [time, setTime] = useState<Date | null>(
    formData.time ? new Date(`1970-01-01T${formData.time}`) : null
  );

  const handleSubmit = async () => {
    if (!date || !time) {
      toast.error('Please select both date and time');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setFormData({
      ...formData,
      date: date.toISOString().split('T')[0],
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    toast.success('Appointment scheduled successfully!');
    onSubmit?.();
  };

  const today = new Date();
  const isToday = date?.toDateString() === today.toDateString();

  const getMinTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // Buffer of 30 minutes
    return isToday ? now : new Date('1970-01-01T00:00:00');
  };

  const getMaxTime = () => new Date('1970-01-01T23:45:00');

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto px-4 py-6"
    >
      <ToastContainer position="top-center" autoClose={3000} />
      
      <motion.h2 
        className="text-2xl font-bold text-gray-800 mb-2 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        Schedule Your Appointment
      </motion.h2>
      <motion.p 
        className="text-gray-600 mb-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Select a convenient date and time for your service
      </motion.p>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="font-medium text-gray-800 mb-3">Select Date</h3>
          <DatePicker
            selected={date}
            onChange={setDate}
            minDate={today}
            inline
            className="border-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm"
        >
          <h3 className="font-medium text-gray-800 mb-3">Select Time</h3>
          <DatePicker
            selected={time}
            onChange={setTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            minTime={getMinTime()}
            maxTime={getMaxTime()}
            inline
            className="border-none"
          />
        </motion.div>
      </div>

      <div className="flex justify-between pt-4">
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
          onClick={handleSubmit}
          disabled={loading || !date || !time}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
          className={`px-6 py-2.5 rounded-lg transition flex items-center gap-2
            ${(!date || !time) ? 
              'bg-gray-300 text-gray-500 cursor-not-allowed' : 
              'bg-green-600 hover:bg-green-700 text-white'}`}
        >
          {loading ? 'Scheduling...' : 'Confirm'} {!loading && <FiCheck />}
        </motion.button>
      </div>
    </motion.div>
  );
}