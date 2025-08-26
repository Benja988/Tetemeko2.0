'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReserveButton from './ReserveButton'
import { 
  FiHeadphones, 
  FiClock, 
  FiCalendar, 
  FiMapPin, 
  FiPhone 
} from 'react-icons/fi'

const faqs = [
  {
    question: "How can I contact your support team?",
    answer: "You can contact us through the form on this page, or email us directly at support@tetemeko.com. We're available Monday to Friday, 9am - 6pm EAT.",
    icon: <FiHeadphones className="text-blue-500" />,
    category: "Support"
  },
  {
    question: "How long does it take to get a response?",
    answer: "We usually respond within 24 hours during business days. For urgent matters, please call our hotline at +254 700 000 000.",
    icon: <FiClock className="text-blue-500" />,
    category: "Support"
  },
  {
    question: "Can I schedule a meeting or demo?",
    answer: "Absolutely! Use our booking system to schedule a consultation or mention your interest in a demo in the contact form and we'll arrange a time that suits you.",
    icon: <FiCalendar className="text-blue-500" />,
    category: "Booking"
  },
  {
    question: "Where are your studios located?",
    answer: "Our main studio is in Nairobi, with regional studios in Kisumu and Mombasa. We also offer remote broadcasting services across East Africa.",
    icon: <FiMapPin className="text-blue-500" />,
    category: "Locations"
  },
  {
    question: "How can I advertise with Tetemeko Media?",
    answer: "We offer various advertising packages across our radio, TV, and digital platforms. Contact our sales team at sales@tetemeko.com for a customized proposal.",
    icon: <FiPhone className="text-blue-500" />,
    category: "Advertising"
  }
]

const categories = ["All", ...new Set(faqs.map(faq => faq.category))]

export default function FAQs() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const [activeCategory, setActiveCategory] = useState("All")

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const filteredFAQs = activeCategory === "All" 
    ? faqs 
    : faqs.filter(faq => faq.category === activeCategory)

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-5">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -100 }}
            animate={{ 
              opacity: [0, 0.1, 0],
              y: '150vh'
            }}
            transition={{ 
              duration: 15 + Math.random() * 15, 
              delay: Math.random() * 5, 
              repeat: Infinity,
              repeatDelay: Math.random() * 10
            }}
            className="absolute text-gray-300 text-4xl"
            style={{
              left: `${Math.random() * 100}%`,
              fontSize: `${2 + Math.random() * 3}rem`,
            }}
          >
            ?
          </motion.div>
        ))}
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find quick answers to common questions about our services
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <AnimatePresence mode="popLayout">
            {filteredFAQs.map((faq, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`rounded-xl overflow-hidden border ${
                  openIndex === index 
                    ? 'border-blue-300 shadow-lg bg-blue-50/30' 
                    : 'border-gray-200 hover:border-blue-200 bg-white'
                } transition-all`}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                  aria-expanded={openIndex === index}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-xl transition-transform group-hover:scale-110">
                      {faq.icon}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: openIndex === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="text-gray-500 group-hover:text-blue-500"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ 
                        opacity: 1, 
                        height: 'auto',
                        transition: { 
                          opacity: { duration: 0.2 },
                          height: { duration: 0.3 }
                        }
                      }}
                      exit={{ 
                        opacity: 0, 
                        height: 0,
                        transition: { 
                          opacity: { duration: 0.1 },
                          height: { duration: 0.2 }
                        }
                      }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-gray-600">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <ReserveButton />
        </motion.div>
      </div>
    </section>
  )
}