
import * as React from 'react';

// Interface for analytics event
export interface AnalyticsEvent {
  id: string;
  type: string;
  page: string;
  element?: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Interface for page view data
export interface PageViewData {
  page: string;
  views: number;
  avgTime: string;
  bounceRate: string;
  lastUpdated: Date;
}

// Interface for time spent data
export interface TimeSpentData {
  page: string;
  time: number; // in seconds
  timestamp: Date;
}

// Interface for bounce rate data
export interface BounceRateData {
  page: string;
  rate: number; // percentage
  timestamp: Date;
}

// Interface for navigation flow data
export interface NavigationFlowData {
  from: string;
  to: string;
  count: number;
  timestamp: Date;
}

// Interface for click data
export interface ClickData {
  element: string;
  clicks: number;
  conversionRate: string;
  timestamp: Date;
}

// Interface for user journey dropoff data
export interface DropoffData {
  point: string;
  percentage: number;
  timestamp: Date;
}

// Local storage keys
const EVENTS_STORAGE_KEY = 'shelley_analytics_events';
const SESSION_START_KEY = 'shelley_session_start';
const PREVIOUS_PAGE_KEY = 'shelley_previous_page';
const PAGE_ENTRY_TIME_KEY = 'shelley_page_entry_time';

// Generate a unique ID for events
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Helper function to ensure we have a valid Date object
const ensureDate = (dateInput: Date | string | number): Date => {
  if (dateInput instanceof Date) {
    return dateInput;
  }
  return new Date(dateInput);
};

// Track a new analytics event
export const trackEvent = (
  type: string,
  page: string,
  element?: string,
  metadata?: Record<string, any>
): void => {
  try {
    const event: AnalyticsEvent = {
      id: generateId(),
      type,
      page,
      element,
      timestamp: new Date(),
      metadata,
    };

    // Get existing events from local storage
    const existingEventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    const existingEvents: AnalyticsEvent[] = existingEventsJson
      ? JSON.parse(existingEventsJson)
      : [];

    // Add new event and store back to local storage
    const updatedEvents = [...existingEvents, event];
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(updatedEvents));

    // For debugging purposes
    console.log('Analytics event tracked:', event);
  } catch (error) {
    console.error('Error tracking analytics event:', error);
  }
};

// Track page view
export const trackPageView = (page: string): void => {
  // Record page entry time
  const now = new Date();
  localStorage.setItem(PAGE_ENTRY_TIME_KEY, now.getTime().toString());

  // Get previous page
  const previousPage = localStorage.getItem(PREVIOUS_PAGE_KEY);

  // If there was a previous page, track navigation flow
  if (previousPage && previousPage !== page) {
    trackEvent('navigation', previousPage, undefined, { to: page });
  }

  // Set current page as the previous page for next navigation
  localStorage.setItem(PREVIOUS_PAGE_KEY, page);

  // Track the page view event
  trackEvent('pageview', page);

  // Check if this is a new session
  if (!localStorage.getItem(SESSION_START_KEY)) {
    localStorage.setItem(SESSION_START_KEY, now.getTime().toString());
    trackEvent('session_start', page);
  }
};

// Track element click
export const trackClick = (element: string, page: string, metadata?: Record<string, any>): void => {
  trackEvent('click', page, element, metadata);
};

// Get all tracked events
export const getEvents = (): AnalyticsEvent[] => {
  try {
    const eventsJson = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (!eventsJson) return [];
    
    const rawEvents = JSON.parse(eventsJson);
    
    // Ensure all timestamps are Date objects
    return rawEvents.map((event: any) => ({
      ...event,
      timestamp: ensureDate(event.timestamp)
    }));
  } catch (error) {
    console.error('Error retrieving analytics events:', error);
    return [];
  }
};

// Clear all tracked events (for testing or privacy)
export const clearEvents = (): void => {
  localStorage.removeItem(EVENTS_STORAGE_KEY);
};

// Get page views data
export const getPageViewsData = (): PageViewData[] => {
  const events = getEvents();
  const pages = new Map<string, { views: number, lastUpdated: Date }>();
  
  // Group pageview events by page
  events
    .filter(event => event.type === 'pageview')
    .forEach(event => {
      const page = event.page;
      const current = pages.get(page) || { views: 0, lastUpdated: ensureDate(event.timestamp) };
      
      pages.set(page, {
        views: current.views + 1,
        lastUpdated: ensureDate(
          Math.max(
            ensureDate(current.lastUpdated).getTime(), 
            ensureDate(event.timestamp).getTime()
          )
        )
      });
    });

  // Calculate bounce rates (percentage of single-page sessions)
  const pageEntries = new Map<string, number>();
  const pageExits = new Map<string, number>();
  let prevPage = null;
  
  // Sort events by timestamp
  const sortedEvents = [...events]
    .filter(event => event.type === 'pageview')
    .sort((a, b) => ensureDate(a.timestamp).getTime() - ensureDate(b.timestamp).getTime());
  
  // Calculate page entries and exits
  for (const event of sortedEvents) {
    const page = event.page;
    
    if (!prevPage) {
      // First page in session is an entry
      pageEntries.set(page, (pageEntries.get(page) || 0) + 1);
    } else if (prevPage !== page) {
      // Page change means exit from previous and entry to current
      pageExits.set(prevPage, (pageExits.get(prevPage) || 0) + 1);
      pageEntries.set(page, (pageEntries.get(page) || 0) + 1);
    }
    
    prevPage = page;
  }
  
  // Last page is always an exit
  if (prevPage) {
    pageExits.set(prevPage, (pageExits.get(prevPage) || 0) + 1);
  }
  
  // Calculate average time spent on each page
  const pageTimeSpent = new Map<string, number[]>();
  const clickEvents = events.filter(event => event.type === 'click');
  
  events
    .filter(event => event.type === 'pageview')
    .forEach(pageViewEvent => {
      const page = pageViewEvent.page;
      const pageViewTime = ensureDate(pageViewEvent.timestamp).getTime();
      
      // Find the next pageview or click event after this pageview
      const nextEvents = [...events]
        .filter(e => 
          (e.type === 'pageview' || e.type === 'click') && 
          ensureDate(e.timestamp).getTime() > pageViewTime
        )
        .sort((a, b) => ensureDate(a.timestamp).getTime() - ensureDate(b.timestamp).getTime());
      
      if (nextEvents.length > 0) {
        const nextEventTime = ensureDate(nextEvents[0].timestamp).getTime();
        const timeSpent = (nextEventTime - pageViewTime) / 1000; // in seconds
        
        if (timeSpent > 0 && timeSpent < 3600) { // Ignore sessions longer than an hour (likely left open)
          const times = pageTimeSpent.get(page) || [];
          times.push(timeSpent);
          pageTimeSpent.set(page, times);
        }
      }
    });
  
  // Convert the data to the expected format
  return Array.from(pages.entries()).map(([page, data]) => {
    // Calculate average time spent
    const times = pageTimeSpent.get(page) || [];
    const avgTimeSeconds = times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
    const avgTimeMinutes = Math.floor(avgTimeSeconds / 60);
    const avgTimeRemainingSeconds = Math.floor(avgTimeSeconds % 60);
    const avgTime = `${avgTimeMinutes.toString().padStart(2, '0')}:${avgTimeRemainingSeconds.toString().padStart(2, '0')}`;
    
    // Calculate bounce rate
    const entries = pageEntries.get(page) || 0;
    const exits = pageExits.get(page) || 0;
    const bounceRate = entries > 0 ? `${Math.round((exits / entries) * 100)}%` : '0%';
    
    return {
      page,
      views: data.views,
      avgTime,
      bounceRate,
      lastUpdated: data.lastUpdated
    };
  });
};

// Get time spent data
export const getTimeSpentData = (): TimeSpentData[] => {
  const pageViewsData = getPageViewsData();
  
  return pageViewsData.map(data => {
    const [minutes, seconds] = data.avgTime.split(':').map(Number);
    const totalSeconds = (minutes * 60) + seconds;
    
    return {
      page: data.page,
      time: totalSeconds,
      timestamp: data.lastUpdated
    };
  });
};

// Get bounce rate data
export const getBounceRateData = (): BounceRateData[] => {
  const pageViewsData = getPageViewsData();
  
  return pageViewsData.map(data => {
    const rateStr = data.bounceRate;
    const rate = parseInt(rateStr.replace('%', ''), 10);
    
    return {
      page: data.page,
      rate,
      timestamp: data.lastUpdated
    };
  });
};

// Get navigation flow data
export const getNavigationFlowData = (): NavigationFlowData[] => {
  const events = getEvents();
  const navigationFlows = new Map<string, { count: number, timestamp: Date }>();
  
  events
    .filter(event => event.type === 'navigation')
    .forEach(event => {
      if (event.metadata && 'to' in event.metadata) {
        const from = event.page;
        const to = event.metadata.to as string;
        const key = `${from}-${to}`;
        
        const current = navigationFlows.get(key) || { count: 0, timestamp: ensureDate(event.timestamp) };
        navigationFlows.set(key, {
          count: current.count + 1,
          timestamp: ensureDate(
            Math.max(
              ensureDate(current.timestamp).getTime(), 
              ensureDate(event.timestamp).getTime()
            )
          )
        });
      }
    });
  
  return Array.from(navigationFlows.entries()).map(([key, data]) => {
    const [from, to] = key.split('-');
    return {
      from,
      to,
      count: data.count,
      timestamp: data.timestamp
    };
  });
};

// Get click data
export const getClickData = (): ClickData[] => {
  const events = getEvents();
  const clicksMap = new Map<string, { clicks: number, timestamp: Date }>();
  
  events
    .filter(event => event.type === 'click' && event.element)
    .forEach(event => {
      if (event.element) {
        const element = event.element;
        const current = clicksMap.get(element) || { clicks: 0, timestamp: ensureDate(event.timestamp) };
        
        clicksMap.set(element, {
          clicks: current.clicks + 1,
          timestamp: ensureDate(
            Math.max(
              ensureDate(current.timestamp).getTime(), 
              ensureDate(event.timestamp).getTime()
            )
          )
        });
      }
    });
  
  // Get total pageviews for conversion rate calculation
  const totalPageViews = events.filter(event => event.type === 'pageview').length;
  
  return Array.from(clicksMap.entries())
    .map(([element, data]) => {
      // Simple conversion rate calculation
      const conversionRate = totalPageViews > 0 
        ? `${((data.clicks / totalPageViews) * 100).toFixed(1)}%` 
        : '0.0%';
      
      return {
        element,
        clicks: data.clicks,
        conversionRate,
        timestamp: data.timestamp
      };
    })
    .sort((a, b) => b.clicks - a.clicks); // Sort by most clicks
};

// Hook to track page views
export const usePageViewTracking = (page: string) => {
  React.useEffect(() => {
    // Track the page view when the component mounts
    trackPageView(page);
    
    // We'll consider the session expired after 30 minutes of inactivity
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
    
    // Check session timeout and reset if needed
    const checkSessionTimeout = () => {
      const sessionStartStr = localStorage.getItem(SESSION_START_KEY);
      if (sessionStartStr) {
        const sessionStart = parseInt(sessionStartStr, 10);
        const now = Date.now();
        
        if (now - sessionStart > SESSION_TIMEOUT) {
          // Session expired, start a new one
          localStorage.removeItem(SESSION_START_KEY);
          localStorage.setItem(SESSION_START_KEY, now.toString());
          trackEvent('session_start', page);
        }
      }
    };
    
    // Check session timeout on component mount
    checkSessionTimeout();
    
    // Create a visibility change listener to track when the user returns to the page
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkSessionTimeout();
      }
    };
    
    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [page]);
};

// Hook for tracking user interactions with elements
export const useElementTracking = () => {
  const trackElement = (element: string, page: string, metadata?: Record<string, any>) => {
    trackClick(element, page, metadata);
  };
  
  return { trackElement };
};
