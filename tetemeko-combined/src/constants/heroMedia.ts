
  // heroMedia.ts
export const HERO_MEDIA = [
  { type: 'video', src: '/hero-images/globe.mp4' },
  { type: 'image', src: '/hero-images/podcast1.jpg' },
  { type: 'video', src: '/hero-images/GlobeEarth.mp4' },
  { type: 'image', src: '/hero-images/station1.jpg', alt: 'Antenna on a rooftop'},
  { type: 'video', src: '/hero-images/mars.mp4' },
  { type: 'image', src: '/hero-images/station2.jpg' },
  { type: 'image', src: '/hero-images/station3.jpg' },
  { type: 'image', src: '/hero-images/station4.jpg' },
  { type: 'image', src: '/hero-images/station5.jpg' },
] as const

// gridHelpers.ts
export const GRID_SIZE = 5
export const DIRECTIONS = ['top', 'bottom', 'left', 'right'] as const
export const FROM_DIR: Record<typeof DIRECTIONS[number], { x?: number; y?: number }> = {
  top: { y: -50 },
  bottom: { y: 50 },
  left: { x: -50 },
  right: { x: 50 },
}
