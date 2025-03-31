
declare interface Window {
  grecaptcha: {
    enterprise: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: object) => number;
    };
    ready: (callback: () => void) => void;
    execute: (siteKey: string, options: { action: string }) => Promise<string>;
    render: (container: string | HTMLElement, options: object) => number;
    reset: (widgetId: number) => void;
  };
  validateRecaptchaCallback?: () => void;
}
