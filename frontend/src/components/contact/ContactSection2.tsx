'use client';
import { FaPhoneAlt, FaEnvelope, FaUserTie, FaClock, FaWhatsapp } from "react-icons/fa";
import { motion } from 'framer-motion';

export default function ContactSection2() {
  const contacts = [
    {
      department: "General Inquiries",
      person: "Customer Support",
      phone: "+255 700 123 456",
      whatsapp: "+255 700 123 456",
      email: "info@tetemekomedia.com",
      hours: "Mon–Fri, 9AM–5PM",
    },
    {
      department: "Technical Support",
      person: "Joshua M.",
      phone: "+255 744 555 111",
      whatsapp: "+255 744 555 111",
      email: "support@tetemekomedia.com",
      hours: "24/7 Support Available",
    },
    {
      department: "Advertising & Sales",
      person: "Zainab K.",
      phone: "+255 711 333 222",
      whatsapp: "+255 711 333 222",
      email: "ads@tetemekomedia.com",
      hours: "Mon–Fri, 10AM–6PM",
    },
    {
      department: "Studio Bookings",
      person: "Kelvin R.",
      phone: "+255 786 888 000",
      whatsapp: "+255 786 888 000",
      email: "booking@tetemekomedia.com",
      hours: "Mon–Sat, 8AM–8PM",
    },
  ];

  return (
    <section className="bg-primary py-16 px-4 sm:px-6 text-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Contact</span> Directory
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Find the right department and contact person for your specific needs
          </p>
        </motion.div>

        <div className="space-y-6 md:space-y-4">
          {/* Table header for desktop */}
          <div className="hidden md:grid grid-cols-5 bg-primary text-white font-semibold rounded-xl overflow-hidden border border-gray-700">
            <div className="py-4 px-6">Department</div>
            <div className="py-4 px-6">Contact</div>
            <div className="py-4 px-6">Phone/WhatsApp</div>
            <div className="py-4 px-6">Email</div>
            <div className="py-4 px-6">Availability</div>
          </div>

          {contacts.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              {/* Mobile Card */}
              <div className="md:hidden bg-primary border border-gray-700 rounded-xl shadow-sm p-6 mb-4">
                <h3 className="text-lg font-bold text-white mb-3">{c.department}</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FaUserTie className="text-gray-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Contact Person</p>
                      <p className="font-medium">{c.person}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaPhoneAlt className="text-gray-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Phone</p>
                      <p className="font-medium">{c.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaWhatsapp className="text-gray-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">WhatsApp</p>
                      <p className="font-medium">{c.whatsapp}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaEnvelope className="text-gray-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="font-medium">{c.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FaClock className="text-gray-300 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-400">Availability</p>
                      <p className="font-medium">{c.hours}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop Row */}
              <div className="hidden md:grid grid-cols-5 bg-primary border-t border-gray-700 last:rounded-b-xl text-white">
                <div className="py-5 px-6 font-medium">{c.department}</div>
                <div className="py-5 px-6 flex items-center gap-2">
                  <FaUserTie className="text-gray-300" />
                  {c.person}
                </div>
                <div className="py-5 px-6">
                  <div className="flex items-center gap-2 mb-1">
                    <FaPhoneAlt className="text-gray-300" />
                    {c.phone}
                  </div>
                  <div className="flex items-center gap-2">
                    <FaWhatsapp className="text-gray-300" />
                    {c.whatsapp}
                  </div>
                </div>
                <div className="py-5 px-6 flex items-center gap-2">
                  <FaEnvelope className="text-gray-300" />
                  {c.email}
                </div>
                <div className="py-5 px-6 flex items-center gap-2">
                  <FaClock className="text-gray-300" />
                  {c.hours}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
