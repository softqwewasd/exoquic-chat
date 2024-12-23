import { useCallback, useEffect, useRef } from 'react';

export function useTypingIndicator({ onTypingChange, delay = 500 }) {
  const typingTimeoutRef = useRef(null);

  const handleTyping = useCallback(() => {
    // Clear any existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set typing to true immediately
    onTypingChange(true);

    // Set typing to false after delay
    typingTimeoutRef.current = setTimeout(() => {
      onTypingChange(false);
    }, delay);
  }, [onTypingChange, delay]);

  // Clean up the timeout when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return { onInput: handleTyping };
} 