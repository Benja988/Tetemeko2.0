'use client';

import { motion } from 'framer-motion';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Jane Doe',
    role: 'Verified Buyer',
    photo: '/prof.jpg',
    message: 'The marketplace offers a fantastic selection and excellent customer service. Highly recommended!',
  },
  {
    name: 'John Smith',
    role: 'Frequent Shopper',
    photo: '/prof.jpg',
    message: 'Fast delivery and smooth payment experience every time. I love shopping here.',
  },
  {
    name: 'Emily Johnson',
    role: 'Happy Customer',
    photo: '/prof.jpg',
    message: 'The quality of products is amazing, and the support team helped me with all my questions.',
  },
];

export default function MarketPlaceSection5() {
  return (
    <section className="bg-primary py-16 px-6 md:px-10 font-poppins text-white">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-extrabold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          What Our Customers Say
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {testimonials.map(({ name, role, photo, message }, idx) => (
            <motion.article
              key={idx}
              className="bg-[#142533] rounded-xl p-6 shadow-lg flex flex-col items-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: idx * 0.3, duration: 0.6, ease: 'easeOut' }}
              tabIndex={0}
              aria-label={`Testimonial from ${name}, ${role}`}
            >
              <div className="flex items-center mb-4 space-x-4">
                <img
                  src={photo}
                  alt={`${name} photo`}
                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-600"
                  loading="lazy"
                />
                <div className="text-left">
                  <p className="font-semibold text-lg">{name}</p>
                  <p className="text-indigo-400 text-sm">{role}</p>
                </div>
              </div>

              <blockquote className="relative text-gray-300 italic text-center px-4">
                <FaQuoteLeft className="inline-block mr-2 text-indigo-500" />
                {message}
                <FaQuoteRight className="inline-block ml-2 text-indigo-500" />
              </blockquote>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
