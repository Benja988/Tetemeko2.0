'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { services } from '@/constants/services';
import { FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Breadcrumbs from '@/components/Breadcrumbs';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 0.77, 0.47, 0.97]
    }
  }
};

const serviceDetails = services.map(service => ({
  ...service,
  fullDescription: `${service.description} We specialize in creating impactful solutions that drive engagement and deliver measurable results. Our team of experts works closely with you to understand your unique needs and craft tailored strategies that exceed expectations.`,
  features: [
    'Customized strategy development',
    'Advanced analytics & reporting',
    'Ongoing optimization',
    'Dedicated support team',
    'Performance tracking'
  ],
  image: '/placeholder-service.jpg' 
}));

export default function ServicesPage() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '#' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
        <Navbar />
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 to-gray-950" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
        </div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-blue-400/10 animate-float"
              style={{
                width: `${Math.random() * 6 + 3}px`,
                height: `${Math.random() * 6 + 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 15 + 8}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={breadcrumbItems} />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wider text-blue-400 bg-blue-900/30 rounded-full mb-6 uppercase">
              Our Expertise
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Comprehensive <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Media Services</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              We deliver cutting-edge solutions that blend innovative technology with creative storytelling to transform your digital presence.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-32 md:space-y-48"
          >
            {serviceDetails.map((service, index) => (
              <ServiceDetail 
                key={index} 
                service={service} 
                index={index} 
                reverse={index % 2 !== 0} 
              />
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-gray-950 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
        </div>
        
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">elevate</span> your project?
            </h2>
            <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto">
              Let's discuss how our services can help you achieve your goals and create something remarkable together.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Start Your Project <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

type ServiceDetailProps = {
  service: {
    icon: React.ReactNode;
    title: string;
    description: string;
    fullDescription: string;
    features: string[];
    image: string;
  };
  index: number;
  reverse: boolean;
};

const ServiceDetail = ({ service, index, reverse }: ServiceDetailProps) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`flex flex-col ${reverse ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
    >
      {/* Image */}
      <div className="w-full md:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl group"
        >
          <div className="relative aspect-video md:aspect-square overflow-hidden">
            {/* Replace with your actual Image component */}
            <div className="w-full h-full bg-gradient-to-br from-blue-900/30 to-purple-900/30 flex items-center justify-center">
              <div className="text-5xl text-blue-400/50">
                {service.icon}
              </div>
            </div>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-4 left-4 w-24 h-24 -z-10 rounded-full bg-blue-500/10 blur-xl" />
          <div className="absolute bottom-4 right-4 w-32 h-32 -z-10 rounded-full bg-purple-500/10 blur-xl" />
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="w-full md:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl text-white shadow-lg">
              {service.icon}
            </div>
            <span className="text-sm font-semibold text-blue-400 bg-blue-900/30 px-3 py-1 rounded-full">
              Service {index + 1}
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {service.title}
          </h2>
          
          <p className="text-lg text-gray-400 mb-6 leading-relaxed">
            {service.fullDescription}
          </p>
          
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-blue-300">What's included:</h3>
            <ul className="space-y-3">
              {service.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <FiCheckCircle className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="group inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700/50 backdrop-blur-sm border border-gray-700 hover:border-blue-500/30 px-6 py-3 rounded-xl transition-all duration-300"
          >
            <span>Learn more about this service</span>
            <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};