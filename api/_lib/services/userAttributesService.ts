import { EventCategory } from '../types/event';

// In-memory store for user purchase history (tracks categories purchased)
const userPurchaseHistory = new Map<string, Set<EventCategory>>();

export interface UserAttributes {
  device_type: string;
  interest: string;
  location: string;
  operating_system: string;
  [key: string]: string;
}

export function recordUserPurchase(userId: string, category: EventCategory): void {
  if (!userPurchaseHistory.has(userId)) {
    userPurchaseHistory.set(userId, new Set());
  }
  userPurchaseHistory.get(userId)!.add(category);
  console.log(`[UserAttributes] Recorded ${category} purchase for user ${userId}`);
}

export function getUserInterests(userId: string): EventCategory[] {
  const categories = userPurchaseHistory.get(userId);
  return categories ? Array.from(categories) : [];
}

export function buildUserAttributes(userId: string, operatingSystem?: string): UserAttributes {
  const interests = getUserInterests(userId);

  return {
    device_type: 'mobile',
    interest: interests.join(','),
    location: 'us',
    operating_system: operatingSystem || 'web'
  };
}

export function clearUserPurchaseHistory(userId: string): void {
  userPurchaseHistory.delete(userId);
}

export function getTrackedUsers(): string[] {
  return Array.from(userPurchaseHistory.keys());
}
