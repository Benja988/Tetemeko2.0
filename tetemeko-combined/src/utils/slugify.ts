// utils/slugify.ts
export const slugify = (text: string): string =>
  text
    .toString()                           // Ensure input is a string
    .normalize('NFKD')                    // Normalize accents (e.g., é → e)
    .replace(/[\u0300-\u036f]/g, '')      // Remove diacritics
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')          // Replace non-alphanumeric with hyphen
    .replace(/^-+|-+$/g, '');             // Remove leading/trailing hyphens
