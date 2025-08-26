'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import StepIndicator from '@/components/resquesService/StepIndicator';
import StepOne from '@/components/resquesService/StepOne';
import StepTwo from '@/components/resquesService/StepTwo';
import StepThree from '@/components/resquesService/StepThree';
import Footer from '@/components/Footer';
import { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import Image from 'next/image';
import { Router } from 'next/router';
import Link from 'next/link';

export default function RequestServicesPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    date: '',
    time: '',
  });

  const onNext = () => setStep((prev) => prev + 1);
  const onBack = () => setStep((prev) => prev - 1);
  const onSubmit = () => setStep(4);

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <motion.section
        className="relative bg-gradient-to-br from-blue-900 to-indigo-900 py-20 px-4 text-white overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full filter blur-3xl opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            Professional <span className="text-blue-300">Media Services</span> On Demand
          </motion.h1>
          <motion.p
            className="text-xl text-blue-100 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Book studio sessions, live event coverage, and digital marketing services with our streamlined reservation system.
          </motion.p>
        </div>
      </motion.section>

      {/* Form Section */}
      <motion.section
        className="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="mb-10">
          <StepIndicator step={step} />
        </div>

        <motion.div
          className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100"
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        >
          {step === 1 && (
            <StepOne step={step} onNext={onNext} onBack={onBack} formData={formData} setFormData={setFormData} />
          )}
          {step === 2 && (
            <StepTwo step={step} onNext={onNext} onBack={onBack} formData={formData} setFormData={setFormData} />
          )}
          {step === 3 && (
            <StepThree step={step} onSubmit={onSubmit} onBack={onBack} formData={formData} setFormData={setFormData} />
          )}
          {step === 4 && (
            <motion.div
              className="text-center px-6 py-12 sm:px-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6">
                <FiCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Request Submitted!</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                We&apos;ve received your service request. Our team will contact you within 24 hours to confirm details.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  <FiArrowLeft />
                  <span>Back to Home</span>
                </Link>
                {/* <a
                  href="/dashboard"
                  className="px-6 py-3 border border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 rounded-lg transition flex items-center justify-center gap-2"
                >
                  View Dashboard
                </a> */}
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.section>

      {/* Services CTA Section */}
      <motion.section
        className="bg-gray-50 py-16 px-4 sm:px-6"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Explore Our Full Range of Services</h2>
              <p className="text-lg text-gray-600 mb-6">
                From live broadcasting to digital content production, we offer comprehensive media solutions tailored to your needs.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  'Live Event Coverage & Streaming',
                  'Professional Studio Production',
                  'Social Media Management',
                  'Digital Marketing Campaigns',
                  'Audio/Video Post-Production'
                ].map((service, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1 w-5 h-5 rounded-full bg-blue-500"></div>
                    <p className="text-gray-700">{service}</p>
                  </div>
                ))}
              </div>
              <a
                href="/services"
                className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition group"
              >
                View All Services
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="relative rounded-xl overflow-hidden shadow-xl aspect-video"
            >
              <Image
                src="/hero-images/studio-production.jpg"
                alt="Media production team working in studio"
                fill
                className="object-cover"
                quality={90}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent"></div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <Footer />
    </>
  );
}