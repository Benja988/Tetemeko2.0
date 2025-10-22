import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

export function SocialLinks() {
  return (
    <div>
      <h3 className="text-lg font-bold text-white mb-4">Follow Us</h3>
      <div className="flex space-x-4 text-xl">
        <a href="#" className="text-gray-400 hover:text-white transition"><FaFacebookF /></a>
        <a href="#" className="text-gray-400 hover:text-white transition"><FaXTwitter /></a>
        <a href="#" className="text-gray-400 hover:text-white transition"><FaInstagram /></a>
        <a href="#" className="text-gray-400 hover:text-white transition"><FaLinkedinIn /></a>
      </div>
    </div>
  );
}
