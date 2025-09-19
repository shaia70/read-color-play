import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Security hook to prevent URL manipulation attacks
 * Removes suspicious payment-related URL parameters
 */
export const useUrlSecurity = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const suspiciousParams = ['payment', 'success', 'paid', 'access', 'verified'];
    
    let hasRemovedParams = false;
    
    // Remove any suspicious parameters that could be used to bypass payment
    suspiciousParams.forEach(param => {
      if (urlParams.has(param)) {
        console.warn(`SECURITY: Removing suspicious URL parameter: ${param}`);
        urlParams.delete(param);
        hasRemovedParams = true;
      }
    });
    
    // If we removed any parameters, update the URL without them
    if (hasRemovedParams) {
      const newSearch = urlParams.toString();
      const newUrl = location.pathname + (newSearch ? `?${newSearch}` : '');
      navigate(newUrl, { replace: true });
    }
  }, [location.search, navigate, location.pathname]);
};