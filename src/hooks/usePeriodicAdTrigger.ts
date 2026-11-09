import { useState, useEffect } from 'react';

/**
 * Hook to trigger a periodic ad prompt every 3-5 minutes of active session time.
 * @param intervalMinutes Frequency of the ad trigger
 * @returns Object with ad visibility state and controls
 */
export const usePeriodicAdTrigger = (intervalMinutes: number = 4) => {
  const [isAdPromptVisible, setIsAdPromptVisible] = useState(false);
  const [lastTriggerTime, setLastTriggerTime] = useState(Date.now());

  useEffect(() => {
    // Convert minutes to milliseconds
    const intervalMs = intervalMinutes * 60 * 1000;
    
    const interval = setInterval(() => {
      // Only trigger if not already showing a prompt
      setIsAdPromptVisible((prev) => {
        if (!prev) {
          console.log('[Periodic Ad Trigger] Session interval reached, prompting user...');
          setLastTriggerTime(Date.now());
          return true;
        }
        return prev;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMinutes]);

  const closeAdPrompt = () => {
    setIsAdPromptVisible(false);
  };

  return {
    isAdPromptVisible,
    closeAdPrompt,
    lastTriggerTime
  };
};
