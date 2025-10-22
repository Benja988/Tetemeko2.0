'use client';

import { motion } from 'framer-motion';
import { FiShoppingCart, FiPackage, FiCreditCard, FiSmile } from 'react-icons/fi';

const steps = [
  {
    icon: <FiShoppingCart size={36} aria-label="Shopping cart icon" role="img" />,
    title: 'Browse Products',
    description: 'Explore a wide range of products across multiple categories to find exactly what you need.',
  },
  {
    icon: <FiPackage size={36} aria-label="Package icon" role="img" />,
    title: 'Place Your Order',
    description: 'Add your favorite items to the cart and place your order securely with multiple payment options.',
  },
  {
    icon: <FiCreditCard size={36} aria-label="Credit card icon" role="img" />,
    title: 'Fast & Secure Payment',
    description: 'Pay quickly and safely with trusted payment methods, including credit cards and mobile wallets.',
  },
  {
    icon: <FiSmile size={36} aria-label="Smiley face icon" role="img" />,
    title: 'Enjoy Your Purchase',
    description: 'Receive your products promptly and enjoy quality service with our customer satisfaction guarantee.',
  },
];

type StepCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
};

function StepCard({ icon, title, description, index }: StepCardProps) {
  return (
    <motion.article
      className="bg-[#142533] rounded-xl p-10 shadow-lg border border-indigo-600 flex flex-col items-center text-white"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.2, duration: 0.6, ease: 'easeOut' }}
      tabIndex={0} // Make the card focusable for keyboard users
    >
      <div className="text-indigo-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </motion.article>
  );
}

export default function MarketPlaceSection3() {
  return (
    <section className="bg-primary py-16 px-4 md:px-10 font-poppins">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-extrabold text-white mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-10">
          {steps.map(({ icon, title, description }, index) => (
            <StepCard
              key={index}
              icon={icon}
              title={title}
              description={description}
              index={index}
            />
          ))}
        </div>

        {/* CTA button */}
        <motion.div
          className="mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: steps.length * 0.2 }}
        >
          <a
            href="/marketplace"
            className="inline-block px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition"
            aria-label="Browse the marketplace"
          >
            Browse Marketplace
          </a>
        </motion.div>
      </div>
    </section>
  );
}
