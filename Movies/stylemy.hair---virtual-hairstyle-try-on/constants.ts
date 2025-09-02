
import type { PresetStyle } from './types';

export const PRESET_STYLES: PresetStyle[] = [
  {
    id: 'classic-side-part',
    name: 'Classic Side Part',
    prompt: 'Give the person a neat, classic side part hairstyle. Keep the color natural.',
    thumbnail: '/style-thumbnails/classic-side-part.svg' // Placeholder path
  },
  {
    id: 'pompadour-quiff',
    name: 'Pompadour / Quiff',
    prompt: 'Transform the hair into a stylish pompadour with a quiff. The sides should be shorter.',
    thumbnail: '/style-thumbnails/pompadour.svg' // Placeholder path
  },
  {
    id: 'undercut-fade',
    name: 'Undercut with Fade',
    prompt: 'Apply a trendy undercut hairstyle with a smooth skin fade on the sides.',
    thumbnail: '/style-thumbnails/undercut.svg' // Placeholder path
  },
  {
    id: 'buzz-crew-cut',
    name: 'Buzz / Crew Cut',
    prompt: 'Give the person a very short and clean buzz cut.',
    thumbnail: '/style-thumbnails/buzz-cut.svg' // Placeholder path
  },
  {
    id: 'medium-layers',
    name: 'Medium Layered',
    prompt: 'Change the hairstyle to a medium-length layered cut with some texture and volume.',
    thumbnail: '/style-thumbnails/medium-layered.svg' // Placeholder path
  },
  {
    id: 'curly-top',
    name: 'Curly/Wavy Top',
    prompt: 'Style the hair with prominent curls or waves on top, keeping the sides relatively short.',
    thumbnail: '/style-thumbnails/curly-top.svg' // Placeholder path
  },
  {
    id: 'long-hair',
    name: 'Long Hair',
    prompt: 'Give the person long, flowing hair that goes past the shoulders.',
    thumbnail: '/style-thumbnails/long-hair.svg' // Placeholder path
  },
  {
    id: 'silver-fox',
    name: 'Silver Fox',
    prompt: 'Change the hair to a sophisticated, stylish cut with a salt-and-pepper or fully silver color.',
    thumbnail: '/style-thumbnails/silver-fox.svg' // Placeholder path
  }
];
