// servicesData.ts

import { Volume2, Tv, Radio, Mic, Wifi, MonitorSmartphone } from 'lucide-react';

export const services = [
  {
    title: 'Radio Broadcasting',
    icon: <Radio className="w-8 h-8 text-white" />,
    description: 'Reach millions through professional FM and online radio stations.'
  },
  {
    title: 'TV Production',
    icon: <Tv className="w-8 h-8 text-white" />,
    description: 'High-quality TV content for news, entertainment, and documentaries.',
  },
  {
    title: 'Live Streaming',
    icon: <Wifi className="w-8 h-8 text-white" />,
    description: 'Stream your events live with seamless performance and HD quality.'
  },
  {
    title: 'Podcasting',
    icon: <Mic className="w-8 h-8 text-white" />,
    description: 'Record, edit, and distribute podcasts to engage global audiences.'
  },
  {
    title: 'Advertising Solutions',
    icon: <Volume2 className="w-8 h-8 text-white" />,
    description: 'Custom ad campaigns across radio, TV, and digital platforms.'
  },
  {
    title: 'Digital Media Marketing',
    icon: <MonitorSmartphone className="w-8 h-8 text-white" />,
    description: 'Boost your brand with targeted online marketing strategies.'
  }
];

