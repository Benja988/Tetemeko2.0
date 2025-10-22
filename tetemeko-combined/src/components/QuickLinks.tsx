import {
  FaBroadcastTower, FaNewspaper, FaPodcast, FaStore, FaEnvelope, FaArrowRight,
} from 'react-icons/fa';

export function QuickLinks() {
  const links = [
    { label: 'Stations', href: '/stations', icon: <FaBroadcastTower /> },
    { label: 'News', href: '/news', icon: <FaNewspaper /> },
    { label: 'Podcasts', href: '/podcasts', icon: <FaPodcast /> },
    { label: 'Marketplace', href: '/marketplace', icon: <FaStore /> },
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
      <ul className="space-y-3 text-sm">
        {links.map(({ label, href, icon }) => (
          <li key={label}>
            <a href={href} className="flex items-center gap-3 hover:text-white transition">
              {icon} {label}
            </a>
          </li>
        ))}
        <li>
          <a href="/contact" className="flex items-center justify-between group hover:text-white transition">
            <span className="flex items-center gap-3">
              <FaEnvelope className="text-base" /> Contact
            </span>
            <FaArrowRight className="text-xs opacity-60 group-hover:translate-x-1 group-hover:opacity-100 transform transition" />
          </a>
        </li>
      </ul>
    </div>
  );
}
