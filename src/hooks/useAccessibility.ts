import * as React from 'react';

type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

interface AccessibilitySettings {
  fontSize: FontSize;
  highContrast: boolean;
  reduceAnimations: boolean;
  hideImages: boolean;
  keyboardNavigation: boolean;
}

const DEFAULT_SETTINGS: AccessibilitySettings = {
  fontSize: 'normal',
  highContrast: false,
  reduceAnimations: false,
  hideImages: false,
  keyboardNavigation: false,
};

export function useAccessibility() {
  const [settings, setSettings] = React.useState<AccessibilitySettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    
    const saved = localStorage.getItem('accessibility-settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  // Apply settings to document
  React.useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.setAttribute('data-font-size', settings.fontSize);
    
    // High contrast
    root.setAttribute('data-high-contrast', settings.highContrast.toString());
    
    // Reduce animations
    root.setAttribute('data-reduce-animations', settings.reduceAnimations.toString());
    if (settings.reduceAnimations) {
      root.style.setProperty('--animation-duration', '0.01s');
      root.style.setProperty('--transition-duration', '0.01s');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }
    
    // Hide images
    root.setAttribute('data-hide-images', settings.hideImages.toString());
    
    // Keyboard navigation
    root.setAttribute('data-keyboard-navigation', settings.keyboardNavigation.toString());
    
    // Respect system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || settings.reduceAnimations) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
    
    // Save to localStorage
    localStorage.setItem('accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return {
    ...settings,
    setFontSize: (size: FontSize) => updateSetting('fontSize', size),
    toggleHighContrast: () => updateSetting('highContrast', !settings.highContrast),
    toggleReduceAnimations: () => updateSetting('reduceAnimations', !settings.reduceAnimations),
    toggleHideImages: () => updateSetting('hideImages', !settings.hideImages),
    toggleKeyboardNavigation: () => updateSetting('keyboardNavigation', !settings.keyboardNavigation),
    resetSettings: () => setSettings(DEFAULT_SETTINGS),
  };
}