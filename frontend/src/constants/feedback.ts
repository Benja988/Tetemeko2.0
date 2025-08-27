export interface Feedback {
  id: string;
  name: string;
  role: string;
  feedback: string;
  image: string;
}

export const feedbacks: Feedback[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'CEO, TechCorp',
    feedback:
      'Tetemeko Media Group has been instrumental in helping us scale our digital presence. Their creativity and professionalism are unmatched.',
    image: '/avatar.jpg',
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Marketing Manager, Designify',
    feedback:
      'Working with Tetemeko Media Group was a game-changer for our brand. Their innovative strategies delivered exceptional results.',
    image: '/avatar.jpg',
  },
  {
    id: '3',
    name: 'Michael Brown',
    role: 'Founder, StartupHub',
    feedback:
      'The team at Tetemeko Media Group is incredibly talented. They understood our vision and brought it to life with precision.',
    image: '/avatar.jpg',
  },
  {
    id: '4',
    name: 'Emily White',
    role: 'Creative Director, Artify',
    feedback:
      'Tetemeko Media Group exceeded our expectations. Their attention to detail and commitment to excellence are truly commendable.',
    image: '/avatar.jpg',
  },
  {
    id: '5',
    name: 'David Green',
    role: 'Product Manager, InnovateX',
    feedback:
      'Their expertise in media and marketing helped us achieve our goals faster than we imagined. Highly recommended!',
    image: '/avatar.jpg',
  },
];