import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const sleep = (delay = 1000) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

export function getRainbowColorNameById(id: number) {
  const RAINBOW_COLOR_NAMES = [
    'FF0000', // Red
    'FF7F00', // Orange
    'FFFF00', // Yellow
    '00FF00', // Green
    '0000FF', // Blue
    '4B0082', // Indigo
    '9400D3', // Violet
  ];

  const numColors = RAINBOW_COLOR_NAMES.length;
  const colorIndex = id % numColors;
  
  return RAINBOW_COLOR_NAMES[colorIndex];
}
