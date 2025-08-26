import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

export function ContactInfo() {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Reach Out</h3>
      <p className="text-sm text-gray-400 flex items-center gap-2 mb-2">
        <FaEnvelope /> <a href="mailto:info@tetemeko.com" className="hover:text-white transition">info@tetemekomediagroup.org</a>
      </p>
      <p className="text-sm text-gray-400 flex items-center gap-2 mb-2">
        <FaPhone /> +25471-916-1925
      </p>
      <p className="text-sm text-gray-400 flex items-center gap-2">
        <FaMapMarkerAlt /> Kisumu
      </p>
    </div>
  );
}
