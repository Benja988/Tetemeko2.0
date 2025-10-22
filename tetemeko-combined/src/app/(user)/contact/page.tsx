'use client'
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ContactSection1 from "@/components/contact/ContactSection1";
import ContactSection2 from "@/components/contact/ContactSection2";
import ContactSection3 from "@/components/contact/ContactSection3";
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="relative">
            {/* Sticky Navbar */}
            <Navbar />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <ContactSection1 />
                <ContactSection2 />
                <ContactSection3 />
            </motion.div>

            <Footer />
        </div>
    );
}