import { EventCategory } from '../types/event';

// In-memory store for user purchase history (tracks categories purchased)
const userPurchaseHistory = new Map<string, Set<EventCategory>>();

export interface UserAttributes {
  device_type: string;
  interest: string;
  location: string;
  operating_system: string;
  [key: string]: string; // Index signature for Optimizely SDK compatibility
}

/**
 * Record a purchase for a user, tracking the event category
 */
export function recordUserPurchase(userId: string, category: EventCategory): void {
  if (!userPurchaseHistory.has(userId)) {
    userPurchaseHistory.set(userId, new Set());
  }
  userPurchaseHistory.get(userId)!.add(category);
  console.log(`[UserAttributes] Recorded ${category} purchase for user ${userId}`);
}

/**
 * Get the categories a user has purchased (for interest attribute)
 */
export function getUserInterests(userId: string): EventCategory[] {
  const categories = userPurchaseHistory.get(userId);
  return categories ? Array.from(categories) : [];
}

/**
 * Build user attributes for Optimizely decisions
 * @param userId - The user ID
 * @param operatingSystem - The operating system (android, ios, or web)
 */
export function buildUserAttributes(userId: string, operatingSystem?: string): UserAttributes {
  const interests = getUserInterests(userId);

  return {
    device_type: 'mobile',
    interest: interests.join(','), // e.g., "concerts,sports" or empty string
    location: 'us',
    operating_system: operatingSystem || 'web'
  };
}

/**
 * Clear purchase history for a user (useful for testing)
 */
export function clearUserPurchaseHistory(userId: string): void {
  userPurchaseHistory.delete(userId);
}

/**
 * Get all tracked users (useful for debugging)
 */
export function getTrackedUsers(): string[] {
  return Array.from(userPurchaseHistory.keys());
}
