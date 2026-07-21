/**
 * Formats an ISO date string into a highly readable, relative time string.
 * Uses exact time deltas for premium user experience and clear timelines.
 * 
 * @param isoString ISO formatted date string
 * @returns Human readable relative time (e.g. "Just now", "2m ago", "Yesterday")
 */
export function getRelativeTime(isoString: string): string {
  try {
    const now = new Date();
    const past = new Date(isoString);
    const diffMs = now.getTime() - past.getTime();
    if (diffMs < 0) return 'Just now';
    
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return 'Just now';
    
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return past.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'Some time ago';
  }
}

export interface FormattedEventDate {
  month: string;
  day: string;
  weekday: string;
  displayDateShort: string;
  displayDateLong: string;
  time: string;
}

/**
 * Formats event date and time details into a standardized structure.
 * 
 * @param eventDate Raw event date string or Date object
 * @param eventTime Optional raw event time string
 * @returns Formatted details including month, day, weekday, short & long date, and time
 */
export function formatEventDateTime(
  eventDate: string | Date | undefined,
  eventTime?: string
): FormattedEventDate {
  if (!eventDate) {
    return {
      month: 'TBD',
      day: '?',
      weekday: 'TBD',
      displayDateShort: 'Date TBD',
      displayDateLong: 'Date To Be Announced',
      time: eventTime || 'Time TBD'
    };
  }

  try {
    const dateObj = typeof eventDate === 'string' ? new Date(eventDate) : eventDate;
    if (isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date');
    }
    const month = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const day = dateObj.getDate().toString();
    const weekday = dateObj.toLocaleDateString(undefined, { weekday: 'short' });
    
    const dateStrShort = dateObj.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });

    const dateStrLong = dateObj.toLocaleDateString(undefined, { 
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });

    let timeStr = eventTime || 'Time TBD';
    if (!eventTime) {
      timeStr = dateObj.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    return {
      month,
      day,
      weekday,
      displayDateShort: `${weekday}, ${dateStrShort}`,
      displayDateLong: dateStrLong,
      time: timeStr
    };
  } catch (e) {
    return {
      month: 'ERR',
      day: '!',
      weekday: 'Err',
      displayDateShort: 'Invalid Date',
      displayDateLong: 'Invalid Date',
      time: eventTime || 'Time TBD'
    };
  }
}

