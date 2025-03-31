
import { useLocation } from 'react-router-dom';
import { 
  usePageViewTracking, 
  useElementTracking, 
  trackClick 
} from '../services/analyticsService';

export const useAnalytics = () => {
  const location = useLocation();
  const currentPage = location.pathname.replace('/', '') || 'home';
  const { trackElement } = useElementTracking();
  
  // Initialize page view tracking
  usePageViewTracking(currentPage);
  
  // Track element clicks
  const trackElementClick = (elementName: string, metadata?: Record<string, any>) => {
    trackElement(elementName, currentPage, metadata);
  };
  
  return {
    trackElementClick
  };
};

export default useAnalytics;
