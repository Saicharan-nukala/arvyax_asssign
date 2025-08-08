import { useEffect, useRef, useCallback } from 'react';

export function useAutosave(callback, delay = 5000) {
  const timeoutId = useRef(null);
  const callbackRef = useRef(callback);

  // Keep callback reference fresh
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const trigger = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    
    timeoutId.current = setTimeout(() => {
      callbackRef.current();
    }, delay);
  }, [delay]);

  const cancel = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
      timeoutId.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  // Return object with trigger and cancel methods
  const api = useCallback(() => {
    // This allows calling triggerAutosave() directly
  }, []);
  
  api.cancel = cancel;
  api.trigger = trigger;

  return api;
}
