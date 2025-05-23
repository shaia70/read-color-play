import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מתחיל עם עמודים 22-23 (כפול), עמודים 24-25 (כפול), עמודים 26-27 (כפול), עמודים 28-29 (כפול), עמודים 30-31 (כפול), עמודים 32-33 (כפול), ואז עמודים בודדים
const BOOK_PAGES = [
  "/lovable-uploads/7d24f700-8905-44af-8976-7b9ab537e302.png", // עמוד 22
  "/lovable-uploads/ac950728-39db-4260-9abb-d147d990acf0.png", // עמוד 24
  "/lovable-uploads/7014a748-a36c-4378-8215-64b2a9363212.png", // עמוד 26
  "/lovable-uploads/3dbbbdf6-c284-4b33-9bc6-f67e90d70dae.png", // עמוד 28
  "/lovable-uploads/caa4fd83-6912-4b59-af63-22d956815ddf.png", // עמוד 30
  "/lovable-uploads/6fc2cc3b-4db8-464f-880d-90939429f955.png", // עמוד 32
  "/lovable-uploads/f665f928-df09-46af-8503-9a658ef41957.png", // עמוד 34
  "/lovable-uploads/77d92669-1178-4c91-9977-ac9e5455dcfd.png", // עמוד 35
  "/lovable-uploads/d3fb3508-7d33-4974-bc6c-da1e7b3f0170.png", // עמוד 36
  "/lovable-uploads/c172de7f-74a3-4570-ba30-104b609f5d5a.png", // עמוד 37
  "/lovable-uploads/22c5ae78-f94a-4d0d-9025-2c409419f407.png", // עמוד 38
  "/lovable-uploads/3f1d784c-06ab-465a-96ba-24054872418e.png", // עמוד 39
  "/lovable-uploads/bdd3d13e-0d6a-49ab-9213-beeeaddeb00c.png", // עמוד 40
  "/lovable-uploads/9cbc460b-06fb-4dcc-b1ac-7f545f6ed4ea.png", // עמוד 41
];

// תמונות נפרדות לעמודים הכפולים
const PAGE_23_URL = "/lovable-uploads/49050bae-5ee5-451d-957b-b77716b34d34.png"; // עמוד 23
const PAGE_25_URL = "/lovable-uploads/f2b2e023-869e-49da-b3be-6c33b2f1f788.png"; // עמוד 25
const PAGE_27_URL = "/lovable-uploads/a615e9d5-fddf-4b50-ac80-59471d8c7e47.png"; // עמוד 27
const PAGE_29_URL = "/lovable-uploads/7ef0c8e5-dfc0-431f-9d75-90b1c70b2f7d.png"; // עמוד 29
const PAGE_31_URL = "/lovable-uploads/83fd1757-2d44-4fae-95a8-6df307919993.png"; // עמוד 31
const PAGE_33_URL = "/lovable-uploads/561280c9-6bce-4561-9eb1-c0921af9e5b7.png"; // עמוד 33

const FlipbookViewer: React.FC = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const flipbookRef = useRef<HTMLDivElement>(null);
  const isHebrew = language === 'he';

  console.log('FlipbookViewer rendered successfully');
  console.log('Total pages:', BOOK_PAGES.length);
  console.log('Current page:', currentPage);

  // פונקציה לבדיקה אם העמוד הנוכחי הוא עמודים כפולים
  const isDoublePage = () => {
    return currentPage >= 0 && currentPage <= 5; // עמודים 22-23, 24-25, 26-27, 28-29, 30-31, 32-33
  };

  const nextPage = () => {
    if (currentPage < BOOK_PAGES.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
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
    if (currentPage === 0) {
      return isHebrew ? "עמודים 22-23" : "Pages 22-23";
    } else if (currentPage === 1) {
      return isHebrew ? "עמודים 24-25" : "Pages 24-25";
    } else if (currentPage === 2) {
      return isHebrew ? "עמודים 26-27" : "Pages 26-27";
    } else if (currentPage === 3) {
      return isHebrew ? "עמודים 28-29" : "Pages 28-29";
    } else if (currentPage === 4) {
      return isHebrew ? "עמודים 30-31" : "Pages 30-31";
    } else if (currentPage === 5) {
      return isHebrew ? "עמודים 32-33" : "Pages 32-33";
    }
    // התאמת חישוב מספר העמוד - עמוד 34 הוא באינדקס 6
    const pageNum = currentPage + 28;
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
          {currentPage === 0 ? (
            // תצוגת עמודים 22-23
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 23 משמאל */}
              <div className="relative">
                <img 
                  src={PAGE_23_URL}
                  alt="Page 23"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 22 מימין */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[0]} // עמוד 22
                  alt="Page 22"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : currentPage === 1 ? (
            // תצוגת עמודים 24-25
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 24 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[1]} // עמוד 24
                  alt="Page 24"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 25 מימין */}
              <div className="relative">
                <img 
                  src={PAGE_25_URL}
                  alt="Page 25"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : currentPage === 2 ? (
            // תצוגת עמודים 26-27
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 26 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[2]} // עמוד 26
                  alt="Page 26"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 27 מימין */}
              <div className="relative">
                <img 
                  src={PAGE_27_URL}
                  alt="Page 27"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : currentPage === 3 ? (
            // תצוגת עמודים 28-29
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 28 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[3]} // עמוד 28
                  alt="Page 28"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 29 מימין */}
              <div className="relative">
                <img 
                  src={PAGE_29_URL}
                  alt="Page 29"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : currentPage === 4 ? (
            // תצוגת עמודים 30-31
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 30 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[4]} // עמוד 30
                  alt="Page 30"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 31 מימין */}
              <div className="relative">
                <img 
                  src={PAGE_31_URL}
                  alt="Page 31"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
            </div>
          ) : currentPage === 5 ? (
            // תצוגת עמודים 32-33
            <div className="relative flex items-center justify-center gap-2">
              {/* עמוד 32 משמאל */}
              <div className="relative">
                <img 
                  src={BOOK_PAGES[5]} // עמוד 32
                  alt="Page 32"
                  className="max-w-full max-h-full object-contain rounded shadow-lg"
                  style={{ maxHeight: '600px', maxWidth: '300px' }}
                />
              </div>
              {/* עמוד 33 מימין */}
              <div className="relative">
                <img 
                  src={PAGE_33_URL}
                  alt="Page 33"
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
                alt={`Page ${currentPage + 28}`}
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
          <span>22-23</span>
          <span>{22 + BOOK_PAGES.length + 1}</span>
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
