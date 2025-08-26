export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  category: string;
  tags: string[];
  type: 'blog' | 'news';
  date?: string; // Optional field for date if needed
  imageUrl: string;
  publishedAt: string; // You can keep it as string (ISO date format) or change it to Date if you prefer working with Date objects
  updatedAt: string;   // Same for this field, can be kept as string (ISO date format)
}

export const posts: Post[] = [
  {
    id: '1',
    title: 'Next.js 14 Released: What’s New?',
    slug: 'nextjs-14-whats-new',
    content: `
    Next.js 14 is here, and it comes packed with groundbreaking features for frontend developers. Among the most notable is the introduction of Partial Prerendering (PPR), which allows developers to mix static and dynamic content on a page more efficiently than ever before. This can dramatically improve page load times and overall performance for large, dynamic web apps.
    
    Another highlight is the production-ready release of TurboPack, Vercel’s new Rust-based JavaScript bundler. TurboPack replaces Webpack in many scenarios and claims to be up to 10x faster in large-scale projects. The development experience has been greatly improved with instant feedback and optimized incremental builds.
    
    Routing has also received improvements, including nested layouts with async loading states and simplified route grouping. App Router is now the default in new projects, and many features that were experimental in version 13 are now stable.
    
    This release also continues Next.js’s commitment to full-stack capabilities, with better support for server actions, edge functions, and seamless integration with backend services via Vercel.
    
    If you’re building a scalable, modern web app, upgrading to Next.js 14 is a strong move. Be sure to check the migration guide and test features before moving into production.
    `,
    excerpt: 'Explore the highlights of the Next.js 14 release and why it matters to developers building modern web apps.',
    author: {
      name: 'Jane Doe',
      avatarUrl: '/prof.jpg',
    },
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Web Dev'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-05T14:30:00Z',
  },
  {
    id: '2',
    title: 'Tech Industry Layoffs Continue in Q2 2025',
    slug: 'tech-layoffs-q2-2025',
    content: `
    Q2 of 2025 is proving to be yet another difficult quarter for the tech industry, as layoffs continue across major players such as Meta, Amazon, and smaller startups. Economic challenges, rising interest rates, and a post-COVID correction have all been cited as contributing factors.
    
    In April alone, over 25,000 tech workers were laid off globally. Many of these cuts are targeting roles in marketing, recruiting, and product operations. Engineering teams have not been immune either, particularly those focused on experimental or long-term initiatives.
    
    Companies are shifting toward leaner operations and profitability over growth-at-all-costs. The shift is especially noticeable in VC-backed startups, where funding rounds are harder to secure than in previous years.
    
    Analysts suggest that while the situation is challenging now, it may also lead to the birth of new startups as ex-employees venture out with their own ideas. Historically, downturns have sparked innovation cycles — and 2025 might be no different.
    `,
    excerpt: 'Q2 of 2025 sees continued tech layoffs. Here’s what’s happening across the industry.',
    author: {
      name: 'John Smith',
      avatarUrl: '/prof.jpg',
    },
    category: 'Business News',
    tags: ['Layoffs', 'Tech', 'Economy'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-10T09:15:00Z',
    updatedAt: '2025-04-10T09:15:00Z',
  },
  {
    id: '3',
    title: 'Mastering Tailwind CSS in 2025',
    slug: 'tailwind-css-guide-2025',
    content: `
    Tailwind CSS has become the go-to utility-first framework for styling web applications. In 2025, it's more powerful and flexible than ever, with plugins, dark mode support, and responsive variants that make building modern UIs a breeze.
    
    This guide dives into advanced Tailwind techniques such as component extraction, custom themes, and leveraging Tailwind with frameworks like Next.js and Nuxt. One of the best practices includes using Tailwind’s \`@apply\` directive for repeated patterns to ensure maintainability.
    
    You’ll also learn how to build design systems using Tailwind’s configuration file, allowing you to define a consistent brand color palette, typography, and breakpoints. With JIT mode now the default, performance is no longer a bottleneck — styles are generated on the fly as you type.
    
    We also cover accessibility best practices, integrating with headless UI components, and building responsive, adaptive layouts without writing a single custom class.
    
    Whether you're new to Tailwind or looking to refine your skills, this comprehensive guide is a must-read in 2025.
    `,
    excerpt: 'A modern guide to building efficient UIs with Tailwind CSS in 2025.',
    author: {
      name: 'Alice Green',
      avatarUrl: '/prof.jpg',
    },
    category: 'UI/UX Design',
    tags: ['Tailwind', 'CSS', 'Frontend'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-03-25T16:45:00Z',
    updatedAt: '2025-03-28T12:00:00Z',
  },
  {
    id: '4',
    title: 'Breaking: Apple to Announce AI-Powered Siri at WWDC',
    slug: 'apple-ai-siri-wwdc',
    content: `
    Apple is expected to make a major announcement at WWDC 2025, unveiling a completely overhauled Siri powered by generative AI. According to insiders, the new Siri will leverage on-device machine learning models similar to OpenAI's GPT and Google’s Gemini to provide more natural, contextual, and proactive responses.
    
    This move comes as competitors like Google and Samsung have already integrated advanced AI into their assistants. Apple, known for its cautious approach to AI, is now ready to leap forward.
    
    Some rumored features include multi-turn conversations, personalized memory, and integration with iOS apps like Calendar, Notes, and Messages. The assistant may also support custom voice profiles and run efficiently on Apple Silicon.
    
    This development marks Apple’s largest AI-focused investment in years, with the goal of reasserting its dominance in the smart assistant space. WWDC 2025 is shaping up to be a landmark event for Apple, and developers across the world are eager to see what’s next.
    `,
    excerpt: 'Apple gears up for a major AI announcement at WWDC 2025. What we know so far.',
    author: {
      name: 'Mike Lang',
      avatarUrl: '/prof.jpg',
    },
    category: 'Tech News',
    tags: ['Apple', 'AI', 'Siri'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-15T11:30:00Z',
    updatedAt: '2025-04-15T11:30:00Z',
  },
  {
    id: '5',
    title: 'Next.js 14 Released: What’s New?',
    slug: 'nextjs-14-whats-new',
    content: `
    Next.js 14 is here, and it comes packed with groundbreaking features for frontend developers. Among the most notable is the introduction of Partial Prerendering (PPR), which allows developers to mix static and dynamic content on a page more efficiently than ever before. This can dramatically improve page load times and overall performance for large, dynamic web apps.
    
    Another highlight is the production-ready release of TurboPack, Vercel’s new Rust-based JavaScript bundler. TurboPack replaces Webpack in many scenarios and claims to be up to 10x faster in large-scale projects. The development experience has been greatly improved with instant feedback and optimized incremental builds.
    
    Routing has also received improvements, including nested layouts with async loading states and simplified route grouping. App Router is now the default in new projects, and many features that were experimental in version 13 are now stable.
    
    This release also continues Next.js’s commitment to full-stack capabilities, with better support for server actions, edge functions, and seamless integration with backend services via Vercel.
    
    If you’re building a scalable, modern web app, upgrading to Next.js 14 is a strong move. Be sure to check the migration guide and test features before moving into production.
    `,
    excerpt: 'Explore the highlights of the Next.js 14 release and why it matters to developers building modern web apps.',
    author: {
      name: 'Jane Doe',
      avatarUrl: '/prof.jpg',
    },
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Web Dev'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-05T14:30:00Z',
  },
  {
    id: '6',
    title: 'Tech Industry Layoffs Continue in Q2 2025',
    slug: 'tech-layoffs-q2-2025',
    content: `
    Q2 of 2025 is proving to be yet another difficult quarter for the tech industry, as layoffs continue across major players such as Meta, Amazon, and smaller startups. Economic challenges, rising interest rates, and a post-COVID correction have all been cited as contributing factors.
    
    In April alone, over 25,000 tech workers were laid off globally. Many of these cuts are targeting roles in marketing, recruiting, and product operations. Engineering teams have not been immune either, particularly those focused on experimental or long-term initiatives.
    
    Companies are shifting toward leaner operations and profitability over growth-at-all-costs. The shift is especially noticeable in VC-backed startups, where funding rounds are harder to secure than in previous years.
    
    Analysts suggest that while the situation is challenging now, it may also lead to the birth of new startups as ex-employees venture out with their own ideas. Historically, downturns have sparked innovation cycles — and 2025 might be no different.
    `,
    excerpt: 'Q2 of 2025 sees continued tech layoffs. Here’s what’s happening across the industry.',
    author: {
      name: 'John Smith',
      avatarUrl: '/prof.jpg',
    },
    category: 'Business News',
    tags: ['Layoffs', 'Tech', 'Economy'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-10T09:15:00Z',
    updatedAt: '2025-04-10T09:15:00Z',
  },
  {
    id: '7',
    title: 'Mastering Tailwind CSS in 2025',
    slug: 'tailwind-css-guide-2025',
    content: `
    Tailwind CSS has become the go-to utility-first framework for styling web applications. In 2025, it's more powerful and flexible than ever, with plugins, dark mode support, and responsive variants that make building modern UIs a breeze.
    
    This guide dives into advanced Tailwind techniques such as component extraction, custom themes, and leveraging Tailwind with frameworks like Next.js and Nuxt. One of the best practices includes using Tailwind’s \`@apply\` directive for repeated patterns to ensure maintainability.
    
    You’ll also learn how to build design systems using Tailwind’s configuration file, allowing you to define a consistent brand color palette, typography, and breakpoints. With JIT mode now the default, performance is no longer a bottleneck — styles are generated on the fly as you type.
    
    We also cover accessibility best practices, integrating with headless UI components, and building responsive, adaptive layouts without writing a single custom class.
    
    Whether you're new to Tailwind or looking to refine your skills, this comprehensive guide is a must-read in 2025.
    `,
    excerpt: 'A modern guide to building efficient UIs with Tailwind CSS in 2025.',
    author: {
      name: 'Alice Green',
      avatarUrl: '/prof.jpg',
    },
    category: 'UI/UX Design',
    tags: ['Tailwind', 'CSS', 'Frontend'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-03-25T16:45:00Z',
    updatedAt: '2025-03-28T12:00:00Z',
  },
  {
    id: '8',
    title: 'Breaking: Apple to Announce AI-Powered Siri at WWDC',
    slug: 'apple-ai-siri-wwdc',
    content: `
    Apple is expected to make a major announcement at WWDC 2025, unveiling a completely overhauled Siri powered by generative AI. According to insiders, the new Siri will leverage on-device machine learning models similar to OpenAI's GPT and Google’s Gemini to provide more natural, contextual, and proactive responses.
    
    This move comes as competitors like Google and Samsung have already integrated advanced AI into their assistants. Apple, known for its cautious approach to AI, is now ready to leap forward.
    
    Some rumored features include multi-turn conversations, personalized memory, and integration with iOS apps like Calendar, Notes, and Messages. The assistant may also support custom voice profiles and run efficiently on Apple Silicon.
    
    This development marks Apple’s largest AI-focused investment in years, with the goal of reasserting its dominance in the smart assistant space. WWDC 2025 is shaping up to be a landmark event for Apple, and developers across the world are eager to see what’s next.
    `,
    excerpt: 'Apple gears up for a major AI announcement at WWDC 2025. What we know so far.',
    author: {
      name: 'Mike Lang',
      avatarUrl: '/prof.jpg',
    },
    category: 'Tech News',
    tags: ['Apple', 'AI', 'Siri'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-15T11:30:00Z',
    updatedAt: '2025-04-15T11:30:00Z',
  },
  {
    id: '9',
    title: 'Next.js 14 Released: What’s New?',
    slug: 'nextjs-14-whats-new',
    content: `
    Next.js 14 is here, and it comes packed with groundbreaking features for frontend developers. Among the most notable is the introduction of Partial Prerendering (PPR), which allows developers to mix static and dynamic content on a page more efficiently than ever before. This can dramatically improve page load times and overall performance for large, dynamic web apps.
    
    Another highlight is the production-ready release of TurboPack, Vercel’s new Rust-based JavaScript bundler. TurboPack replaces Webpack in many scenarios and claims to be up to 10x faster in large-scale projects. The development experience has been greatly improved with instant feedback and optimized incremental builds.
    
    Routing has also received improvements, including nested layouts with async loading states and simplified route grouping. App Router is now the default in new projects, and many features that were experimental in version 13 are now stable.
    
    This release also continues Next.js’s commitment to full-stack capabilities, with better support for server actions, edge functions, and seamless integration with backend services via Vercel.
    
    If you’re building a scalable, modern web app, upgrading to Next.js 14 is a strong move. Be sure to check the migration guide and test features before moving into production.
    `,
    excerpt: 'Explore the highlights of the Next.js 14 release and why it matters to developers building modern web apps.',
    author: {
      name: 'Jane Doe',
      avatarUrl: '/prof.jpg',
    },
    category: 'Web Development',
    tags: ['Next.js', 'React', 'Web Dev'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-01T10:00:00Z',
    updatedAt: '2025-04-05T14:30:00Z',
  },
  {
    id: '10',
    title: 'Tech Industry Layoffs Continue in Q2 2025',
    slug: 'tech-layoffs-q2-2025',
    content: `
    Q2 of 2025 is proving to be yet another difficult quarter for the tech industry, as layoffs continue across major players such as Meta, Amazon, and smaller startups. Economic challenges, rising interest rates, and a post-COVID correction have all been cited as contributing factors.
    
    In April alone, over 25,000 tech workers were laid off globally. Many of these cuts are targeting roles in marketing, recruiting, and product operations. Engineering teams have not been immune either, particularly those focused on experimental or long-term initiatives.
    
    Companies are shifting toward leaner operations and profitability over growth-at-all-costs. The shift is especially noticeable in VC-backed startups, where funding rounds are harder to secure than in previous years.
    
    Analysts suggest that while the situation is challenging now, it may also lead to the birth of new startups as ex-employees venture out with their own ideas. Historically, downturns have sparked innovation cycles — and 2025 might be no different.
    `,
    excerpt: 'Q2 of 2025 sees continued tech layoffs. Here’s what’s happening across the industry.',
    author: {
      name: 'John Smith',
      avatarUrl: '/prof.jpg',
    },
    category: 'Business News',
    tags: ['Layoffs', 'Tech', 'Economy'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-10T09:15:00Z',
    updatedAt: '2025-04-10T09:15:00Z',
  },
  {
    id: '11',
    title: 'Mastering Tailwind CSS in 2025',
    slug: 'tailwind-css-guide-2025',
    content: `
    Tailwind CSS has become the go-to utility-first framework for styling web applications. In 2025, it's more powerful and flexible than ever, with plugins, dark mode support, and responsive variants that make building modern UIs a breeze.
    
    This guide dives into advanced Tailwind techniques such as component extraction, custom themes, and leveraging Tailwind with frameworks like Next.js and Nuxt. One of the best practices includes using Tailwind’s \`@apply\` directive for repeated patterns to ensure maintainability.
    
    You’ll also learn how to build design systems using Tailwind’s configuration file, allowing you to define a consistent brand color palette, typography, and breakpoints. With JIT mode now the default, performance is no longer a bottleneck — styles are generated on the fly as you type.
    
    We also cover accessibility best practices, integrating with headless UI components, and building responsive, adaptive layouts without writing a single custom class.
    
    Whether you're new to Tailwind or looking to refine your skills, this comprehensive guide is a must-read in 2025.
    `,
    excerpt: 'A modern guide to building efficient UIs with Tailwind CSS in 2025.',
    author: {
      name: 'Alice Green',
      avatarUrl: '/prof.jpg',
    },
    category: 'UI/UX Design',
    tags: ['Tailwind', 'CSS', 'Frontend'],
    type: 'blog',
    imageUrl: '/team.jpg',
    publishedAt: '2025-03-25T16:45:00Z',
    updatedAt: '2025-03-28T12:00:00Z',
  },
  {
    id: '12',
    title: 'Breaking: Apple to Announce AI-Powered Siri at WWDC',
    slug: 'apple-ai-siri-wwdc',
    content: `
    Apple is expected to make a major announcement at WWDC 2025, unveiling a completely overhauled Siri powered by generative AI. According to insiders, the new Siri will leverage on-device machine learning models similar to OpenAI's GPT and Google’s Gemini to provide more natural, contextual, and proactive responses.
    
    This move comes as competitors like Google and Samsung have already integrated advanced AI into their assistants. Apple, known for its cautious approach to AI, is now ready to leap forward.
    
    Some rumored features include multi-turn conversations, personalized memory, and integration with iOS apps like Calendar, Notes, and Messages. The assistant may also support custom voice profiles and run efficiently on Apple Silicon.
    
    This development marks Apple’s largest AI-focused investment in years, with the goal of reasserting its dominance in the smart assistant space. WWDC 2025 is shaping up to be a landmark event for Apple, and developers across the world are eager to see what’s next.
    `,
    excerpt: 'Apple gears up for a major AI announcement at WWDC 2025. What we know so far.',
    author: {
      name: 'Mike Lang',
      avatarUrl: '/prof.jpg',
    },
    category: 'Tech News',
    tags: ['Apple', 'AI', 'Siri'],
    type: 'news',
    imageUrl: '/team.jpg',
    publishedAt: '2025-04-15T11:30:00Z',
    updatedAt: '2025-04-15T11:30:00Z',
  },
];
