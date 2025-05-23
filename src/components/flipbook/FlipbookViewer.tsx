
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - עמוד 32, עמוד 33, עמוד 34, עמוד 35, עמוד 36, עמוד 37, עמוד 38, עמוד 39, עמוד 40 ועמוד 41
const BOOK_PAGES = [
  "/lovable-uploads/6fc2cc3b-4db8-464f-880d-90939429f955.png", // עמוד 32
  "/lovable-uploads/561280c9-6bce-4561-9eb1-c0921af9e5b7.png", // עמוד 33
  "/lovable-uploads/f665f928-df09-46af-8503-9a658ef41957.png", // עמוד 34
  "/lovable-uploads/77d92669-1178-4c91-9977-ac9e5455dcfd.png", // עמוד 35
  "/lovable-uploads/d3fb3508-7d33-4974-bc6c-da1e7b3f0170.png", // עמוד 36
  "/lovable-uploads/c172de7f-74a3-4570-ba30-104b609f5d5a.png", // עמוד 37
  "/lovable-uploads/22c5ae78-f94a-4d0d-9025-2c409419f407.png", // עמוד 38
  "/lovable-uploads/3f1d784c-06ab-465a-96ba-24054872418e.png", // עמוד 39
  "/lovable-uploads/bdd3d13e-0d6a-49ab-9213-beeeaddeb00c.png", // עמוד 40
  "/lovable-uploads/9cbc460b-06fb-4dcc-b1ac-7f545f6ed4ea.png", // עמוד 41
];

const FlipbookViewer: React.FC = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const isHebrew = language === 'he';

  console.log('FlipbookViewer rendered successfully');
  console.log('Total pages:', BOOK_PAGES.length);
  console.log('Current page:', currentPage);

  // פונקציה לבדיקה אם העמוד הנוכחי הוא 32-33 (העמודים הראשונים)
  const isDoublePage = () => {
    return currentPage === 0; // עמודים 32-33 הם בתחילת המערך
  };

  const nextPage = () => {
    if (isDoublePage()) {
      // אם אנחנו בעמודים 32-33, קפוץ לעמוד 34
      setCurrentPage(2);
    } else if (currentPage < BOOK_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage === 2) {
      // אם אנחנו בעמוד 34, חזור לעמודים 32-33
      setCurrentPage(0);
    } else if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber: number) => {
    if (pageNumber >= 0 && pageNumber < BOOK_PAGES.length) {
      setCurrentPage(pageNumber);
    }
  };

  const zoomIn = () => {
    if (zoom < 2) {
      setZoom(zoom + 0.25);
    }
  };

  const zoomOut = () => {
    if (zoom > 0.5) {
      setZoom(zoom - 0.25);
    }
  };

  const resetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        if (!isHebrew) {
          nextPage();
        } else {
          prevPage();
        }
      } else if (event.key === 'ArrowLeft') {
        if (!isHebrew) {
          prevPage();
        } else {
          nextPage();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHebrew, currentPage]);

  const getCurrentPageDisplay = () => {
    if (isDoublePage()) {
      return isHebrew ? "עמודים 32-33" : "Pages 32-33";
    }
    const pageNum = currentPage + 32;
    return isHebrew ? `עמוד ${pageNum}` : `Page ${pageNum}`;
  };

  return (
    <div className="glass-card p-6">
      {/* כלי בקרה */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <CustomButton
            variant="outline"
            size="sm"
            icon={<ZoomOut className="w-4 h-4" />}
            onClick={zoomOut}
            disabled={zoom <= 0.5}
          >
            {isHebrew ? "הקטן" : "Zoom Out"}
          </CustomButton>
          
          <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded">
            {Math.round(zoom * 100)}%
          </span>
          
          <CustomButton
            variant="outline"
            size="sm"
            icon={<ZoomIn className="w-4 h-4" />}
            onClick={zoomIn}
            disabled={zoom >= 2}
          >
            {isHebrew ? "הגדל" : "Zoom In"}
          </CustomButton>
          
          <CustomButton
            variant="outline"
            size="sm"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={resetZoom}
          >
            {isHebrew ? "איפוס" : "Reset"}
          </CustomButton>
        </div>
        
        <div className="text-sm text-gray-600">
          {getCurrentPageDisplay()} {isHebrew ? `מתוך ${BOOK_PAGES.length} עמודים` : `of ${BOOK_PAGES.length} pages`}
        </div>
      </div>

      {/* אזור הפליפבוק */}
      <div className="relative overflow-hidden bg-gray-50 rounded-lg shadow-lg flex justify-center items-center" style={{ height: '700px' }}>
        <div 
          ref={flipbookRef} 
          className="flipbook-container"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {isDoublePage() ? (
            // תצוגת עמוד כפול עבור 32-33
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 33 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[1]} // עמוד 33
                  alt="Page 33"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 32 מימין */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[0]} // עמוד 32
                  alt="Page 32"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : (
            // תצוגת עמוד יחיד עבור שאר העמודים
            <div className="relative w-96 h-full flex items-center justify-center">
              <img 
                src={BOOK_PAGES[currentPage]} 
                alt={`Page ${currentPage + 32}`}
                className="max-w-full max-h-full object-contain rounded shadow-lg"
                style={{ maxHeight: '600px' }}
              />
            </div>
          )}
        </div>
        
        {/* כפתורי ניווט */}
        <div className="absolute inset-y-0 left-4 flex items-center">
          <CustomButton
            variant="blue"
            size="icon"
            onClick={prevPage}
            disabled={currentPage === 0}
            className="bg-white/90 text-shelley-blue hover:bg-white shadow-lg disabled:opacity-50"
          >
            <ChevronLeft className="w-6 h-6" />
          </CustomButton>
        </div>
        
        <div className="absolute inset-y-0 right-4 flex items-center">
          <CustomButton
            variant="blue"
            size="icon"
            onClick={nextPage}
            disabled={currentPage >= BOOK_PAGES.length - 1}
            className="bg-white/90 text-shelley-blue hover:bg-white shadow-lg disabled:opacity-50"
          >
            <ChevronRight className="w-6 h-6" />
          </CustomButton>
        </div>
      </div>

      {/* סרגל עמודים */}
      <div className="mt-6">
        <input
          type="range"
          min="0"
          max={BOOK_PAGES.length - 1}
          value={currentPage}
          onChange={(e) => goToPage(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>32-33</span>
          <span>{32 + BOOK_PAGES.length - 1}</span>
        </div>
      </div>

      {/* הזהרה */}
      <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          {isHebrew 
            ? "⚠️ התוכן מוגן בזכויות יוצרים. אסור להוריד, להעתיק או להפיץ"
            : "⚠️ Content is protected by copyright. Downloading, copying or sharing is prohibited"
          }
        </p>
      </div>
    </div>
  );
};

export default FlipbookViewer;
