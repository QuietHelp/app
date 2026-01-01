/**
 * Utility functions for chat features
 * Inspired by WhatsApp, Messenger, Instagram, and Omegle
 */

/**
 * Formats timestamp to relative time (e.g., "Just now", "2 min ago", "1 hour ago")
 * Similar to WhatsApp and Messenger
 */
export function formatMessageTime(timestamp: number | string): string {
  const now = Date.now();
  const messageTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const diffMs = now - messageTime;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 10) return 'Just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  // For older messages, show date and time
  const date = new Date(messageTime);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
  }
}

/**
 * Formats timestamp to full date and time for tooltips
 */
export function formatFullTimestamp(timestamp: number | string): string {
  const messageTime = typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp;
  const date = new Date(messageTime);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Groups messages by date for better organization
 * Useful for showing date separators like WhatsApp
 */
export function shouldShowDateSeparator(
  currentMessage: { timestamp: number | string },
  previousMessage?: { timestamp: number | string }
): boolean {
  if (!previousMessage) return true;

  const currentDate = new Date(
    typeof currentMessage.timestamp === 'string'
      ? new Date(currentMessage.timestamp).getTime()
      : currentMessage.timestamp
  );
  const previousDate = new Date(
    typeof previousMessage.timestamp === 'string'
      ? new Date(previousMessage.timestamp).getTime()
      : previousMessage.timestamp
  );

  return (
    currentDate.getDate() !== previousDate.getDate() ||
    currentDate.getMonth() !== previousDate.getMonth() ||
    currentDate.getFullYear() !== previousDate.getFullYear()
  );
}

/**
 * Formats date separator (e.g., "Today", "Yesterday", "December 25, 2024")
 */
export function formatDateSeparator(timestamp: number | string): string {
  const date = new Date(typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return 'Yesterday';
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  }
}

