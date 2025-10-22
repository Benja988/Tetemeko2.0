'use client';

import { motion } from 'framer-motion';
import { 
  SiNike, 
  SiAdidas, 
  SiApple, 
  SiSamsung, 
  SiSony, 
  SiDell 
} from 'react-icons/si';
import { FiCamera } from 'react-icons/fi'; // fallback for Canon

const brands = [
  { name: 'Nike', icon: <SiNike size={48} /> },
  { name: 'Adidas', icon: <SiAdidas size={48} /> },
  { name: 'Apple', icon: <SiApple size={48} /> },
  { name: 'Samsung', icon: <SiSamsung size={48} /> },
  { name: 'Sony', icon: <SiSony size={48} /> },
  { name: 'Dell', icon: <SiDell size={48} /> },
  { name: 'Canon', icon: <FiCamera size={48} /> }, // fallback icon
];

export default function MarketPlaceSection4() {
  return (
    <section className="bg-primary py-16 px-6 md:px-10 font-poppins text-white">
      <div className="max-w-7xl mx-auto text-center">
        <motion.h2
          className="text-4xl font-extrabold mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          Featured Brands
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-8 items-center justify-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
            hidden: { opacity: 0, y: 20 },
          }}
        >
          {brands.map(({ name, icon }, idx) => (
            <motion.div
              key={idx}
              className="flex items-center justify-center p-4 cursor-pointer filter grayscale hover:filter-none transition duration-300"
              variants={{
                visible: { opacity: 1, y: 0 },
                hidden: { opacity: 0, y: 20 },
              }}
              aria-label={`Brand logo of ${name}`}
              title={name}
            >
              {icon}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
