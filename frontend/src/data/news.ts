// item.ts - Mock Data for Frontend Testing

// ✅ List Items (Bullet points for main articles)
export const listItems: string[] = [
  "Global conflicts increase tensions worldwide.",
  "New technological advancements are reshaping industries.",
  "Climate change impacts grow more severe each year.",
  "Economic shifts seen in developing markets.",
  "Education systems are evolving with new tech integration.",
  "Healthcare improvements lead to better global life expectancy.",
  "AI is revolutionizing various sectors from finance to healthcare.",
  "Space exploration sees new advancements with private partnerships.",
  "Global economy shows signs of recovery after pandemic shocks.",
  "Renewable energy adoption increases across Europe and Asia."
];

// ✅ Mock News Items - Matches Mongoose Schema
export const NewsItems = [
  {
    _id: "1",
    title: "Breaking News: Major Event Shakes the World",
    slug: "major-event",
    imageSrc: "https://picsum.photos/600/400?random=1",
    text: "A major event just happened, shaking the world and drawing global attention.",
    tag: "Breaking",
    category: "World",
    videoSrc: "/videos/FirstSection/breaking.mp4",
    listItems: [
      "Key impact on global markets.",
      "Political responses are emerging rapidly.",
      "Humanitarian efforts are being coordinated."
    ],
    relatedArticles: [
      { 
        slug: "michigan-school-shooter", 
        text: "Michigan school shooter sentenced to life in prison without parole", 
        imageSrc: "https://picsum.photos/300/200?random=2" 
      },
      { 
        slug: "six-french-teenagers", 
        text: "Six French teenagers convicted in connection with 2020 beheading of teacher Paty",
        imageSrc: "https://picsum.photos/300/200?random=3"
      },
      { 
        slug: "ryan-O’Neal,-star", 
        text: "Ryan O’Neal, star of ‘Love Story’ and ‘Peyton Place,’ dead",
        imageSrc: "https://picsum.photos/300/200?random=4"
      }
    ],
    createdAt: "2025-05-11T09:00:00.000Z",
    updatedAt: "2025-05-11T09:00:00.000Z"
  },
  {
    _id: "2",
    title: "Rishi Sunak is picking a fight on the migration issue that he probably cannot win",
    slug: "israel-hamas-war",
    imageSrc: "https://picsum.photos/600/400?random=5",
    text: "Rishi Sunak is facing major challenges in his latest political stand.",
    tag: "Analysis",
    category: "Politics",
    videoSrc: null,
    listItems: [
      "Controversial decisions spark debate.",
      "Migration policies under fire.",
      "Long-term impacts uncertain."
    ],
    relatedArticles: [
      { 
        slug: "appeals-court-maintains", 
        text: "Appeals court maintains most of Trump gag order in federal election subversion case", 
        imageSrc: "https://picsum.photos/300/200?random=6" 
      },
      { 
        slug: "european-union-agrees", 
        text: "European Union agrees to regulate potentially harmful effects of artificial intelligence",
        imageSrc: "https://picsum.photos/300/200?random=7"
      }
    ],
    createdAt: "2025-05-11T10:00:00.000Z",
    updatedAt: "2025-05-11T10:00:00.000Z"
  },
  {
    _id: "3",
    title: "Harvard president apologizes for her disastrous testimony at antisemitism hearing",
    slug: "politics",
    imageSrc: "https://picsum.photos/600/400?random=8",
    text: "The Harvard president issues an apology following backlash from her hearing testimony.",
    tag: "News",
    category: "World",
    videoSrc: "/videos/news/harvard.mp4",
    listItems: [
      "Backlash from student groups.",
      "Political figures express concern.",
      "Institutional changes anticipated."
    ],
    relatedArticles: [
      { 
        slug: "wartime-spread-of-drug-resistant", 
        text: "Wartime spread of drug-resistant infections in Ukraine is an ‘urgent crisis,’ CDC report says",
        imageSrc: "https://picsum.photos/300/200?random=9"
      },
      { 
        slug: "six-french-teenagers-convicted ", 
        text: "Six French teenagers convicted in connection with 2020 beheading of teacher Paty",
        imageSrc: "https://picsum.photos/300/200?random=10"
      }
    ],
    createdAt: "2025-05-11T11:00:00.000Z",
    updatedAt: "2025-05-11T11:00:00.000Z"
  },
  {
    _id: "4",
    title: "Tech Giants Invest in New AI Solutions for 2025",
    slug: "ai-investment",
    imageSrc: "https://picsum.photos/600/400?random=11",
    text: "Major tech companies are pouring billions into AI to shape the next decade.",
    tag: "Technology",
    category: "Tech",
    videoSrc: "/videos/news/ai-solutions.mp4",
    listItems: [
      "New AI models surpass human benchmarks.",
      "Ethical considerations are at the forefront.",
      "Investments focus on automation and machine learning."
    ],
    relatedArticles: [
      { 
        slug: "openai-releases-new-state-of-the-art", 
        text: "OpenAI releases new state-of-the-art chatbot model", 
        imageSrc: "https://picsum.photos/300/200?random=12" 
      },
      { 
        slug: "tesla-showcases-ai-driven-autonomous", 
        text: "Tesla showcases AI-driven autonomous vehicle tech",
        imageSrc: "https://picsum.photos/300/200?random=13"
      }
    ],
    createdAt: "2025-05-11T12:00:00.000Z",
    updatedAt: "2025-05-11T12:00:00.000Z"
  },
  {
    _id: "5",
    title: "Global Summit 2025: Leaders Address Climate Change Urgently",
    slug: "global-summit-2025",
    imageSrc: "https://picsum.photos/600/400?random=14",
    text: "World leaders gather for the Global Summit 2025 to tackle pressing climate issues.",
    tag: "Environment",
    category: "World",
    videoSrc: null,
    listItems: [
      "New climate policies proposed.",
      "Developing nations call for more support.",
      "Renewable energy investments prioritized."
    ],
    relatedArticles: [
      { 
        slug: "/your-slug-url", 
        text: "UN releases latest climate change report with alarming statistics", 
        imageSrc: "https://picsum.photos/300/200?random=15" 
      },
      { 
        slug: "/your-slug-url", 
        text: "Countries pledge more resources for sustainable development",
        imageSrc: "https://picsum.photos/300/200?random=16"
      }
    ],
    createdAt: "2025-05-11T13:00:00.000Z",
    updatedAt: "2025-05-11T13:00:00.000Z"
  },
  {
    _id: "6",
    title: "Quantum Computing Breakthrough Announced by MIT",
    slug: "quantum-computing-breakthrough",
    imageSrc: "https://picsum.photos/600/400?random=17",
    text: "MIT researchers unveil a new breakthrough in quantum computing that promises faster processing.",
    tag: "Technology",
    category: "Tech",
    videoSrc: "/videos/news/quantum.mp4",
    listItems: [
      "Quantum speeds now achievable at lower costs.",
      "Applications expected in AI and data science.",
      "New cryptography methods to be explored."
    ],
    relatedArticles: [
      { 
        slug: "/your-slug-url", 
        text: "The race for quantum supremacy heats up", 
        imageSrc: "https://picsum.photos/300/200?random=18" 
      },
      { 
        slug: "/your-slug-url", 
        text: "Major tech firms invest billions in quantum tech",
        imageSrc: "https://picsum.photos/300/200?random=19"
      }
    ],
    createdAt: "2025-05-11T14:00:00.000Z",
    updatedAt: "2025-05-11T14:00:00.000Z"
  },
  {
    _id: "7",
    title: "Artificial Intelligence Revolutionizes Healthcare",
    slug: "ai-healthcare",
    imageSrc: "https://picsum.photos/600/400?random=20",
    text: "AI technology is driving significant improvements in healthcare diagnostics and treatment.",
    tag: "Health",
    category: "Health",
    videoSrc: null,
    listItems: [
      "AI outperforms human doctors in cancer detection.",
      "Real-time monitoring for chronic patients.",
      "Predictive analytics reduce emergency admissions."
    ],
    relatedArticles: [
      { 
        slug: "/your-slug-url", 
        text: "How AI is changing the face of modern medicine", 
        imageSrc: "https://picsum.photos/300/200?random=21" 
      },
      { 
        slug: "/your-slug-url", 
        text: "New AI-driven devices approved for clinical use",
        imageSrc: "https://picsum.photos/300/200?random=22"
      }
    ],
    createdAt: "2025-05-11T15:00:00.000Z",
    updatedAt: "2025-05-11T15:00:00.000Z"
  },
  {
    _id: "8",
    title: "New Renewable Energy Projects Launch Across Asia",
    slug: "renewable-energy-asia",
    imageSrc: "https://picsum.photos/600/400?random=23",
    text: "Asian countries ramp up renewable energy projects in a bid to reduce carbon footprints.",
    tag: "Environment",
    category: "World",
    videoSrc: null,
    listItems: [
      "Solar farms expand in China and India.",
      "Wind energy projects accelerate in Southeast Asia.",
      "Governments incentivize clean energy transitions."
    ],
    relatedArticles: [
      { 
        slug: "/your-slug-url", 
        text: "Sustainable energy: The global shift towards renewables", 
        imageSrc: "https://picsum.photos/300/200?random=24" 
      },
      { 
        slug: "/your-slug-url", 
        text: "Asia leads the world in solar energy adoption",
        imageSrc: "https://picsum.photos/300/200?random=25"
      }
    ],
    createdAt: "2025-05-11T16:00:00.000Z",
    updatedAt: "2025-05-11T16:00:00.000Z"
  },
  {
    _id: "9",
    title: "Mars Rover Sends New Images of Red Planet",
    slug: "mars-rover-update",
    imageSrc: "https://picsum.photos/600/400?random=26",
    text: "NASA's Mars Rover sends back stunning new images of the Martian surface.",
    tag: "Space",
    category: "Science",
    videoSrc: "/videos/news/mars-rover.mp4",
    listItems: [
      "Rover captures high-resolution images of Martian terrain.",
      "Signs of past water formations are visible.",
      "NASA plans further exploration missions."
    ],
    relatedArticles: [
      { 
        slug: "/your-slug-url", 
        text: "The future of Mars exploration: What's next?", 
        imageSrc: "https://picsum.photos/300/200?random=27" 
      },
      { 
        slug: "/your-slug-url", 
        text: "NASA announces upcoming missions to study Martian climate",
        imageSrc: "https://picsum.photos/300/200?random=28"
      }
    ],
    createdAt: "2025-05-11T17:00:00.000Z",
    updatedAt: "2025-05-11T17:00:00.000Z"
  },
  {
    "_id": "10",
    "title": "The Global Impact of AI in Healthcare",
    "slug": "global-impact-ai-healthcare",
    "imageSrc": "https://picsum.photos/600/400?random=10",
    "text": "Artificial Intelligence is reshaping the healthcare sector, promising better diagnostics and patient care.",
    "tag": "Analysis",
    "category": "Health",
    "videoSrc": null,
    "listItems": [
      "Breakthroughs in medical imaging.",
      "Revolutionizing patient data analysis.",
      "Ethical considerations in AI diagnosis."
    ],
    "relatedArticles": [
      { 
        "slug": "/your-slug-url", 
        "text": "AI-Powered Surgery: What to Expect in 2025", 
        "imageSrc": "https://picsum.photos/300/200?random=11"
      },
      { 
        "slug": "/your-slug-url", 
        "text": "Virtual Healthcare: The Future of Patient Appointments",
        "imageSrc": "https://picsum.photos/300/200?random=12"
      }
    ],
    "createdAt": "2025-05-12T08:30:00.000Z",
    "updatedAt": "2025-05-12T08:30:00.000Z"
  },
  {
    "_id": "11",
    "title": "Breaking Down Global Trade Barriers",
    "slug": "global-trade-barriers",
    "imageSrc": "https://picsum.photos/600/400?random=13",
    "text": "Understanding the complexities of global trade and its implications on local economies.",
    "tag": "Analysis",
    "category": "Business",
    "videoSrc": null,
    "listItems": [
      "The rise of protectionism.",
      "Impact of tariffs on small businesses.",
      "The future of free trade agreements."
    ],
    "relatedArticles": [
      { 
        "slug": "/your-slug-url", 
        "text": "How Sanctions Affect Global Economies", 
        "imageSrc": "https://picsum.photos/300/200?random=14"
      },
      { 
        "slug": "/your-slug-url", 
        "text": "Understanding the Global Supply Chain Crisis",
        "imageSrc": "https://picsum.photos/300/200?random=15"
      }
    ],
    "createdAt": "2025-05-12T09:00:00.000Z",
    "updatedAt": "2025-05-12T09:00:00.000Z"
  },
  {
    "_id": "12",
    "title": "Editor's Picks: Top 10 Innovations of 2025",
    "slug": "top-10-innovations-2025",
    "imageSrc": "https://picsum.photos/600/400?random=16",
    "text": "A handpicked selection of the most impactful innovations shaping the world this year.",
    "tag": "Editor's Picks",
    "category": "Technology",
    "videoSrc": null,
    "listItems": [
      "Breakthroughs in quantum computing.",
      "The rise of sustainable energy solutions.",
      "Next-generation robotics."
    ],
    "relatedArticles": [
      { 
        "slug": "/your-slug-url", 
        "text": "The Rise of Quantum Internet", 
        "imageSrc": "https://picsum.photos/300/200?random=17"
      },
      { 
        "slug": "/your-slug-url", 
        "text": "Sustainable Cities: Blueprint for the Future",
        "imageSrc": "https://picsum.photos/300/200?random=18"
      }
    ],
    "createdAt": "2025-05-12T09:30:00.000Z",
    "updatedAt": "2025-05-12T09:30:00.000Z"
  },
  {
    "_id": "13",
    "title": "Why Remote Work is Here to Stay",
    "slug": "remote-work-future",
    "imageSrc": "https://picsum.photos/600/400?random=19",
    "text": "As companies adapt to new norms, remote work is proving to be more than just a pandemic trend.",
    "tag": "Opinion",
    "category": "Business",
    "videoSrc": null,
    "listItems": [
      "Increased productivity from home.",
      "Challenges of work-life balance.",
      "The need for digital transformation."
    ],
    "relatedArticles": [
      { 
        "slug": "/your-slug-url", 
        "text": "The Digital Nomad Lifestyle: Pros and Cons", 
        "imageSrc": "https://picsum.photos/300/200?random=20"
      },
      { 
        "slug": "/your-slug-url", 
        "text": "Future of Office Spaces in a Remote-First World",
        "imageSrc": "https://picsum.photos/300/200?random=21"
      }
    ],
    "createdAt": "2025-05-12T10:00:00.000Z",
    "updatedAt": "2025-05-12T10:00:00.000Z"
  },
  {
    "_id": "14",
    "title": "top-travel-destinations-2025",
    "imageSrc": "https://picsum.photos/600/400?random=22",
    "text": "Discover the most breathtaking places to visit in the coming year.",
    "tag": "Lifestyle",
    "category": "Travel",
    "videoSrc": null,
    "listItems": [
      "Unexplored gems in Southeast Asia.",
      "Luxury travel redefined.",
      "Eco-friendly travel experiences."
    ],
    "relatedArticles": [
      { 
        "slug": "/your-slug-url", 
        "text": "Travel Hacks for Budget Adventures", 
        "imageSrc": "https://picsum.photos/300/200?random=23"
      },
      { 
        "slug": "/your-slug-url", 
        "text": "How to Travel Sustainably in 2025",
        "imageSrc": "https://picsum.photos/300/200?random=24"
      }
    ],
    "createdAt": "2025-05-12T10:30:00.000Z",
    "updatedAt": "2025-05-12T10:30:00.000Z"
  },
  // 👉 Append these to your NewsItems array starting from ID 14

{
  _id: "14",
  title: "Why Remote Work is the Future of Productivity",
  slug: "remote-work-future",
  imageSrc: "https://picsum.photos/600/400?random=14",
  text: "The shift to remote work is not just temporary; it's redefining how businesses operate.",
  tag: "Opinion",
  category: "Opinions",
  videoSrc: null,
  listItems: [
    "Remote work boosts productivity.",
    "Flexible hours enhance work-life balance.",
    "Digital collaboration tools are essential."
  ],
  relatedArticles: [
    { 
      slug: "evolution-of-work", 
      text: "The Evolution of Work: From Office Cubicles to Home Desks", 
      imageSrc: "https://picsum.photos/300/200?random=14" 
    },
    { 
      slug: "technology-and-work",
      text: "How Technology is Shaping the Modern Workplace",
      imageSrc: "https://picsum.photos/300/200?random=15"
    }
  ],
  createdAt: "2025-05-12T10:00:00.000Z",
  updatedAt: "2025-05-12T10:00:00.000Z"
},
{
  _id: "15",
  title: "Is Social Media Ruining Our Social Skills?",
  slug: "social-media-impact",
  imageSrc: "https://picsum.photos/600/400?random=15",
  text: "While it connects us virtually, is social media harming real-life interactions?",
  tag: "Opinion",
  category: "Opinions",
  videoSrc: null,
  listItems: [
    "Increased screen time affects communication.",
    "Face-to-face interactions are declining.",
    "Virtual relationships are replacing physical ones."
  ],
  relatedArticles: [
    { 
      slug: "social-anxiety", 
      text: "The Rise of Social Anxiety in the Digital Age", 
      imageSrc: "https://picsum.photos/300/200?random=16" 
    },
    { 
      slug: "digital-detox",
      text: "Why You Should Consider a Digital Detox",
      imageSrc: "https://picsum.photos/300/200?random=17"
    }
  ],
  createdAt: "2025-05-12T11:00:00.000Z",
  updatedAt: "2025-05-12T11:00:00.000Z"
},
{
  _id: "16",
  title: "The Ethics of Artificial Intelligence",
  slug: "ai-ethics",
  imageSrc: "https://picsum.photos/600/400?random=16",
  text: "As AI becomes more integrated into society, we must address ethical concerns.",
  tag: "Opinion",
  category: "Opinions",
  videoSrc: null,
  listItems: [
    "Bias in AI algorithms.",
    "The threat to personal privacy.",
    "AI decision-making in critical areas."
  ],
  relatedArticles: [
    { 
      slug: "ai-and-privacy", 
      text: "How AI is Challenging Traditional Notions of Privacy", 
      imageSrc: "https://picsum.photos/300/200?random=18" 
    },
    { 
      slug: "machine-learning-ethics",
      text: "The Role of Ethics in Machine Learning Development",
      imageSrc: "https://picsum.photos/300/200?random=19"
    }
  ],
  createdAt: "2025-05-12T12:00:00.000Z",
  updatedAt: "2025-05-12T12:00:00.000Z"
},
{
  _id: "17",
  title: "Top 10 Travel Destinations for 2025",
  slug: "travel-2025",
  imageSrc: "https://picsum.photos/600/400?random=17",
  text: "Discover the most breathtaking destinations to visit in the coming year.",
  tag: "Lifestyle",
  category: "Lifestyle",
  videoSrc: null,
  listItems: [
    "Bali, Indonesia",
    "Kyoto, Japan",
    "Santorini, Greece"
  ],
  relatedArticles: [
    { 
      slug: "budget-travel", 
      text: "How to Travel the World on a Budget", 
      imageSrc: "https://picsum.photos/300/200?random=20" 
    },
    { 
      slug: "adventure-seekers",
      text: "Top Destinations for Adventure Seekers",
      imageSrc: "https://picsum.photos/300/200?random=21"
    }
  ],
  createdAt: "2025-05-12T13:00:00.000Z",
  updatedAt: "2025-05-12T13:00:00.000Z"
},
{
  _id: "18",
  title: "5 Habits for a Healthier Lifestyle",
  slug: "healthy-habits",
  imageSrc: "https://picsum.photos/600/400?random=18",
  text: "Simple habits that can transform your health and well-being.",
  tag: "Lifestyle",
  category: "Lifestyle",
  videoSrc: null,
  listItems: [
    "Consistent exercise routines.",
    "Mindful eating practices.",
    "Adequate sleep and hydration."
  ],
  relatedArticles: [
    { 
      slug: "work-life-balance", 
      text: "How to Maintain Work-Life Balance", 
      imageSrc: "https://picsum.photos/300/200?random=22" 
    },
    { 
      slug: "mindfulness-tips",
      text: "Mindfulness Tips for a Calmer Mind",
      imageSrc: "https://picsum.photos/300/200?random=23"
    }
  ],
  createdAt: "2025-05-12T14:00:00.000Z",
  updatedAt: "2025-05-12T14:00:00.000Z"
},
{
  _id: "19",
  title: "Why Minimalism is the New Luxury",
  slug: "minimalism-trend",
  imageSrc: "https://picsum.photos/600/400?random=19",
  text: "The minimalist lifestyle is taking over as people seek simplicity and calm.",
  tag: "Lifestyle",
  category: "Lifestyle",
  videoSrc: null,
  listItems: [
    "Living with less is more.",
    "Focusing on quality over quantity.",
    "Reducing clutter for mental clarity."
  ],
  relatedArticles: [
    { 
      slug: "home-decor", 
      text: "Minimalist Home Decor Ideas", 
      imageSrc: "https://picsum.photos/300/200?random=24" 
    },
    { 
      slug: "sustainable-living",
      text: "Sustainable Living: The Path to a Greener Future",
      imageSrc: "https://picsum.photos/300/200?random=25"
    }
  ],
  createdAt: "2025-05-12T15:00:00.000Z",
  updatedAt: "2025-05-12T15:00:00.000Z"
},
// Technology Stories
{
  _id: "20",
  title: "AI-Powered Cities: How Technology is Reshaping Urban Living",
  slug: "ai-powered-cities",
  imageSrc: "https://picsum.photos/600/400?random=20",
  text: "Smart cities are evolving with the integration of artificial intelligence, enhancing efficiency and sustainability.",
  tag: "Technology",
  category: "Technology",
  videoSrc: null,
  listItems: [
    "Smart traffic management.",
    "AI-enhanced public safety.",
    "Sustainable energy solutions."
  ],
  relatedArticles: [
    { 
      slug: "5g-impact", 
      text: "The Impact of 5G on Modern Infrastructure", 
      imageSrc: "https://picsum.photos/300/200?random=26" 
    },
    { 
      slug: "smart-homes",
      text: "Smart Homes: The Future of Comfortable Living",
      imageSrc: "https://picsum.photos/300/200?random=27"
    }
  ],
  createdAt: "2025-05-13T08:00:00.000Z",
  updatedAt: "2025-05-13T08:00:00.000Z"
},
{
  _id: "21",
  title: "Quantum Computing: he Next Frontier in Tech",
  slug: "quantum-computing",
  imageSrc: "https://picsum.photos/600/400?random=21",
  text: "Quantum computing promises to solve complex problems at speeds unimaginable with classical computers.",
  tag: "Technology",
  category: "Technology",
  videoSrc: null,
  listItems: [
    "Breaking encryption barriers.",
    "Advancing scientific research.",
    "Revolutionizing AI capabilities."
  ],
  relatedArticles: [
    { 
      slug: "cloud-computing", 
      text: "Cloud Computing in the Age of Quantum", 
      imageSrc: "https://picsum.photos/300/200?random=28" 
    },
    { 
      slug: "blockchain-evolution",
      text: "Blockchain and Quantum Security",
      imageSrc: "https://picsum.photos/300/200?random=29"
    }
  ],
  createdAt: "2025-05-13T09:00:00.000Z",
  updatedAt: "2025-05-13T09:00:00.000Z"
},
{
  _id: "22",
  title: "The Rise of Electric Vehicles: Are We Ready?",
  slug: "electric-vehicles",
  imageSrc: "https://picsum.photos/600/400?random=22",
  text: "Electric vehicles are gaining momentum, but infrastructure challenges still remain.",
  tag: "Technology",
  category: "Technology",
  videoSrc: null,
  listItems: [
    "Improved battery technology.",
    "Global EV adoption rates.",
    "Government incentives and policies."
  ],
  relatedArticles: [
    { 
      slug: "charging-stations", 
      text: "The Future of Charging Stations", 
      imageSrc: "https://picsum.photos/300/200?random=30" 
    },
    { 
      slug: "clean-energy",
      text: "How Clean Energy is Powering EVs",
      imageSrc: "https://picsum.photos/300/200?random=31"
    }
  ],
  createdAt: "2025-05-13T10:00:00.000Z",
  updatedAt: "2025-05-13T10:00:00.000Z"
},

// Business Stories
{
  _id: "23",
  title: "The Future of Work: Remote and Hybrid Models",
  slug: "future-of-work",
  imageSrc: "https://picsum.photos/600/400?random=23",
  text: "As technology evolves, the way we work is changing. Remote and hybrid models are the new normal.",
  tag: "Business",
  category: "Business",
  videoSrc: null,
  listItems: [
    "Increased work-life balance.",
    "Global talent acquisition.",
    "Enhanced productivity tools."
  ],
  relatedArticles: [
    { 
      slug: "startup-culture", 
      text: "How Startup Culture is Adapting to Hybrid Work", 
      imageSrc: "https://picsum.photos/300/200?random=32" 
    },
    { 
      slug: "remote-tools",
      text: "Top Remote Work Tools for 2025",
      imageSrc: "https://picsum.photos/300/200?random=33"
    }
  ],
  createdAt: "2025-05-13T11:00:00.000Z",
  updatedAt: "2025-05-13T11:00:00.000Z"
},
{
  _id: "24",
  title: "How Fintech is Disrupting Traditional Banking",
  slug: "fintech-disruption",
  imageSrc: "https://picsum.photos/600/400?random=24",
  text: "Fintech companies are reshaping the banking landscape with innovative technologies.",
  tag: "Business",
  category: "Business",
  videoSrc: null,
  listItems: [
    "Digital wallets and online banking.",
    "Blockchain for secure transactions.",
    "AI-driven financial services."
  ],
  relatedArticles: [
    { 
      slug: "blockchain-banking", 
      text: "Blockchain: The Backbone of Future Banking", 
      imageSrc: "https://picsum.photos/300/200?random=34" 
    },
    { 
      slug: "digital-payments",
      text: "The Rise of Digital Payment Solutions",
      imageSrc: "https://picsum.photos/300/200?random=35"
    }
  ],
  createdAt: "2025-05-13T12:00:00.000Z",
  updatedAt: "2025-05-13T12:00:00.000Z"
}


];
