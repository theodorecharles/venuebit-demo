export const FEATURE_FLAGS = {
  TICKET_EXPERIENCE: 'ticket_experience',
} as const;

export const VARIATIONS = {
  CONTROL: 'control',
  ENHANCED: 'enhanced',
} as const;

export type VariationType = typeof VARIATIONS[keyof typeof VARIATIONS];
