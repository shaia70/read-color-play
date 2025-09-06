import { useState } from "react";
import { Eye, Type, Contrast, Zap, Keyboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccessibility } from "@/hooks/useAccessibility";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const {
    fontSize,
    highContrast,
    reduceAnimations,
    hideImages,
    keyboardNavigation,
    setFontSize,
    toggleHighContrast,
    toggleReduceAnimations,
    toggleHideImages,
    toggleKeyboardNavigation,
    resetSettings
  } = useAccessibility();

  const isRTL = language === 'he';

  const accessibilityItems = [
    {
      id: 'fontSize',
      label: isRTL ? 'גודל טקסט' : 'Text Size',
      icon: <Type className="h-4 w-4" />,
      type: 'select',
      value: fontSize,
      options: [
        { value: 'small', label: isRTL ? 'קטן' : 'Small' },
        { value: 'normal', label: isRTL ? 'רגיל' : 'Normal' },
        { value: 'large', label: isRTL ? 'גדול' : 'Large' },
        { value: 'extra-large', label: isRTL ? 'גדול מאוד' : 'Extra Large' }
      ],
      action: setFontSize
    },
    {
      id: 'contrast',
      label: isRTL ? 'ניגודיות גבוהה' : 'High Contrast',
      icon: <Contrast className="h-4 w-4" />,
      type: 'toggle',
      active: highContrast,
      action: toggleHighContrast
    },
    {
      id: 'animations',
      label: isRTL ? 'צמצום אנימציות' : 'Reduce Animations',
      icon: <Zap className="h-4 w-4" />,
      type: 'toggle',
      active: reduceAnimations,
      action: toggleReduceAnimations
    },
    {
      id: 'images',
      label: isRTL ? 'הסתר תמונות' : 'Hide Images',
      icon: <Eye className="h-4 w-4" />,
      type: 'toggle',
      active: hideImages,
      action: toggleHideImages
    },
    {
      id: 'keyboard',
      label: isRTL ? 'ניווט מקלדת' : 'Keyboard Navigation',
      icon: <Keyboard className="h-4 w-4" />,
      type: 'toggle',
      active: keyboardNavigation,
      action: toggleKeyboardNavigation
    }
  ];

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "border-2 transition-all duration-200",
          isOpen && "bg-primary text-primary-foreground",
          "hover:bg-primary hover:text-primary-foreground"
        )}
        aria-label={isRTL ? "פתח תפריט נגישות" : "Open accessibility menu"}
        aria-expanded={isOpen}
      >
        <Eye className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className={cn(
              "absolute top-full z-50 mt-2 w-80 rounded-lg border bg-card p-4 shadow-lg",
              isRTL ? "right-0" : "left-0"
            )}
          >
            <div className="space-y-4">
              <div className="border-b pb-2">
                <h3 className="font-semibold text-sm">
                  {isRTL ? 'הגדרות נגישות' : 'Accessibility Settings'}
                </h3>
              </div>

              {accessibilityItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  
                   {item.type === 'toggle' ? (
                     <Button
                       variant={item.active ? "default" : "outline"}
                       size="sm"
                       onClick={() => (item.action as () => void)()}
                       className="h-8 px-3"
                     >
                       {item.active 
                         ? (isRTL ? 'פעיל' : 'On')
                         : (isRTL ? 'כבוי' : 'Off')
                       }
                     </Button>
                   ) : item.type === 'select' ? (
                     <select
                       value={item.value}
                       onChange={(e) => (item.action as (value: string) => void)(e.target.value)}
                       className="rounded border px-2 py-1 text-sm bg-background"
                     >
                       {item.options?.map((option) => (
                         <option key={option.value} value={option.value}>
                           {option.label}
                         </option>
                       ))}
                     </select>
                   ) : null}
                </div>
              ))}

              <div className="border-t pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetSettings}
                  className="w-full text-sm"
                >
                  {isRTL ? 'איפוס הגדרות' : 'Reset Settings'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}