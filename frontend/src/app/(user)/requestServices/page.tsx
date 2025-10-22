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
      {/* Services CTA Section */}
<motion.section
  className="relative bg-gray-900 text-white py-20 px-6 lg:px-12"
  initial={{ opacity: 0 }}
  whileInView={{ opacity: 1 }}
  viewport={{ once: true }}
>
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
    {/* Left Side - Services Text */}
    <div>
      {/* Section Header */}
      <div className="mb-12">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Our Services
        </h2>
        <p className="mt-4 text-lg text-gray-300 max-w-xl">
          Empowering your business with innovative solutions built for speed, 
          scale, and security.
        </p>
      </div>

      {/* Services List */}
      <div className="space-y-8">
        {/* Service 1 */}
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 flex-shrink-0">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M12 20h9" />
              <path d="M12 4h9" />
              <path d="M4 9h16v6H4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Web Development</h3>
            <p className="text-gray-400">
              Scalable, responsive, and secure websites tailored to your
              business needs.
            </p>
          </div>
        </div>

        {/* Service 2 */}
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-pink-600 flex-shrink-0">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M14.31 8l5.74 9.94" />
              <path d="M9.69 8h11.48" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Cloud Solutions</h3>
            <p className="text-gray-400">
              Deploy and manage apps in the cloud with high availability and
              performance.
            </p>
          </div>
        </div>

        {/* Service 3 */}
        <div className="flex items-start space-x-4">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-orange-600 flex-shrink-0">
            <svg
              className="w-7 h-7 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Cybersecurity</h3>
            <p className="text-gray-400">
              Protecting your digital assets with cutting-edge security
              measures.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-12">
        <a
          href="#contact"
          className="inline-block px-8 py-4 text-lg font-medium rounded-full bg-blue-600 text-white shadow-md hover:bg-blue-700 transition"
        >
          Get Started
        </a>
      </div>
    </div>

    {/* Right Side - Service Images (fanned style) */}
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative w-full max-w-md">
        {/* Card 1 */}
        <img
          src="/network090.jpg"
          alt="Web Development"
          className="rounded-2xl shadow-2xl transform rotate-[-6deg] translate-x-[-20px] z-10"
        />
        {/* Card 2 */}
        <img
          src="/network098.jpg"
          alt="Cloud Solutions"
          className="rounded-2xl shadow-2xl absolute top-4 left-4 transform rotate-[-6deg] z-20"
        />
        {/* Card 3 */}
        <img
          src="/googleDeepmind.jpg"
          alt="Cloud Solutions"
          className="rounded-2xl shadow-2xl absolute top-14 left-14 transform rotate-[-6deg] z-20"
        />
        {/* <img
          src="/googleDeepmind.jpg"
          alt="Cybersecurity"
          className="rounded-2xl shadow-2xl absolute top-12 left-12 transform rotate-[6deg] z-10"
        /> */}
      </div>
    </div>
  </div>
</motion.section>



      <Footer />
    </>
  );
}