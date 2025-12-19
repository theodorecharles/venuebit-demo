export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';

  // Handle "YYYY-MM-DD" format by adding time to make it valid
  let date: Date;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    date = new Date(dateString + 'T12:00:00');
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (timeString: string): string => {
  if (!timeString) return '';

  // Handle "HH:MM" format
  if (timeString.match(/^\d{2}:\d{2}$/)) {
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  const date = new Date(timeString);
  if (isNaN(date.getTime())) return timeString;

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};

export const formatDateTime = (dateString: string, timeString?: string): string => {
  const formattedDate = formatDate(dateString);
  const formattedTime = timeString ? formatTime(timeString) : formatTime(dateString);
  return `${formattedDate} at ${formattedTime}`;
};

export const formatShortDate = (dateString: string): string => {
  if (!dateString) return '';

  let date: Date;
  if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
    date = new Date(dateString + 'T12:00:00');
  } else {
    date = new Date(dateString);
  }

  if (isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};
