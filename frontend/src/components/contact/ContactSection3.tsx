'use client';
import { useState } from "react";
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

export default function ContactSection3() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      if (!formData.name || !formData.email || !formData.message) {
        setStatus("error");
      } else {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      }
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact-form" className="bg-primary py-16 px-4 sm:px-6 text-white">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Send Us a <span className="text-white">Message</span>
          </h2>
          <p className="text-gray-300 max-w-xl mx-auto">
            Fill out the form below and our team will get back to you as soon as possible
          </p>
        </motion.div>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-6 bg-primary/90 p-6 sm:p-8 rounded-xl shadow-sm border border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Your Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full bg-primary text-white placeholder-gray-400 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-primary text-white placeholder-gray-400 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
                required
              />
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="I want to advertise"
              className="w-full bg-primary text-white placeholder-gray-400 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">Message *</label>
            <textarea
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              placeholder="Type your message here..."
              className="w-full bg-primary text-white placeholder-gray-400 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition"
              required
            ></textarea>
          </div>

          {/* Feedback */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-green-600/20 text-green-400 p-4 rounded-lg border border-green-600"
            >
              <FiCheckCircle className="text-green-400 text-xl" />
              <p className="font-medium">Thank you! We'll get back to you shortly.</p>
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-600/20 text-red-400 p-4 rounded-lg border border-red-600"
            >
              <FiAlertCircle className="text-red-400 text-xl" />
              <p className="font-medium">Please fill out all required fields.</p>
            </motion.div>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className={`w-full flex items-center justify-center gap-2 font-semibold px-6 py-3 rounded-lg transition-all ${
              isSubmitting 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-md hover:shadow-lg'
            }`}
          >
            {isSubmitting ? (
              'Sending...'
            ) : (
              <>
                <FiSend />
                Send Message
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
}
