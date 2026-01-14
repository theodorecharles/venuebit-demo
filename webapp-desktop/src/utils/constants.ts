import { EventCategory } from '../types/event';

export const CATEGORIES: EventCategory[] = ['concerts', 'sports', 'theater', 'comedy'];

export const CATEGORY_DISPLAY_NAMES: Record<EventCategory, string> = {
  concerts: 'Concerts',
  sports: 'Sports',
  theater: 'Theater',
  comedy: 'Comedy',
};

export const CATEGORY_EMOJIS: Record<EventCategory, string> = {
  concerts: '🎵',
  sports: '⚽',
  theater: '🎭',
  comedy: '😂',
};

export const APP_VERSION = '1.0.0';
export const APP_NAME = 'VenueBit Desktop';
