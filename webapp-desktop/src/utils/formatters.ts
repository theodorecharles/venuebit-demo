// Date formatting utilities

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatTime = (timeString: string): string => {
  const [hours, minutes] = timeString.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

export const formatDateTime = (dateString: string, timeString: string): string => {
  return `${formatDate(dateString)} at ${formatTime(timeString)}`;
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
};

// Price formatting utilities

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatPriceRange = (minPrice?: number, maxPrice?: number): string => {
  if (minPrice === undefined || maxPrice === undefined) {
    return 'Price TBD';
  }
  if (minPrice === maxPrice) {
    return formatPrice(minPrice);
  }
  return `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`;
};

export const formatPriceDetailed = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

// Order status formatting

export const formatOrderStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    completed: 'Completed',
    cancelled: 'Cancelled',
    refunded: 'Refunded',
  };
  return statusMap[status] || status;
};

export const getOrderStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: 'text-warning',
    confirmed: 'text-success',
    completed: 'text-success',
    cancelled: 'text-error',
    refunded: 'text-error',
  };
  return colorMap[status] || 'text-text-secondary';
};

// Seat description formatting

export const formatSeatDescription = (section: string, row: string, seatNumber: number): string => {
  return `${section} • Row ${row} • Seat ${seatNumber}`;
};

// Image URL helper
import { getImageBaseUrl } from '../api/client';

export const getFullImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${getImageBaseUrl()}${imageUrl}`;
};
