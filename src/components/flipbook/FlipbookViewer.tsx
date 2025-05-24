import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מתחיל עם כריכה קידמית, עמוד 1 (בודד), עמודים 2-3 (כפול), 4-5 (כפול), וכו'
const BOOK_PAGES = [
  "/lovable-uploads/a18fc5c6-521d-4fae-be3b-c99f0e5bf718.png", // כריכה קידמית
  "/lovable-uploads/7dad7b21-033b-4fa7-a2cd-d74d3d6086a1.png", // עמוד 1 (שער)
  "/lovable-uploads/40312726-fbc0-4f44-b4d6-d5bf7ea97a3a.png", // עמוד 2
  "/lovable-uploads/7925aef4-ab3f-46e5-90c9-eb4736e0235f.png", // עמוד 4
  "/lovable-uploads/48a5f650-91d1-4e86-9c3a-9b578d94f20d.png", // עמוד 6
  "/lovable-uploads/24f7e704-fc2d-4f8f-9658-5cbebbb0d6c0.png", // עמוד 8
  "/lovable-uploads/c73ba785-3ead-4138-9c8a-8370640683e7.png", // עמוד 10
  "/lovable-uploads/5c762a1c-1f13-4c02-8387-8f78a52c7faa.png", // עמוד 12
  "/lovable-uploads/b2f8a18d-d484-4647-9ee2-41fa2aec0f80.png", // עמוד 14
  "/lovable-uploads/f25ba9cf-c9c3-4171-af8a-0a445667c84e.png", // עמוד 16
  "/lovable-uploads/2df9fd1a-43a3-422b-a644-8c32d7aab8b8.png", // עמוד 18
  "/lovable-uploads/f274593e-0b39-4037-b92d-65c82bc6b2f8.png", // עמוד 20
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
const PAGE_3_URL = "/lovable-uploads/e32dbfdb-237a-4e84-b6f1-987a18027f60.png"; // עמוד 3
const PAGE_5_URL = "/lovable-uploads/e1737b4c-27a7-4d34-9164-4c7daf1dbd45.png"; // עמוד 5
const PAGE_7_URL = "/lovable-uploads/9bfac8af-89e6-4c3e-aea3-f84c98e784b0.png"; // עמוד 7
const PAGE_9_URL = "/lovable-uploads/b9f5d2e3-adfc-4106-a523-e3125e2cbdcf.png"; // עמוד 9
const PAGE_11_URL = "/lovable-uploads/7957327a-bfbc-4bdc-9ea3-2d0c5320e60c.png"; // עמוד 11
const PAGE_13_URL = "/lovable-uploads/ab5e52fa-1be9-45c2-b12c-a9d0a2610775.png"; // עמוד 13
const PAGE_15_URL = "/lovable-uploads/06cba8cb-fe0a-41f2-a4fb-1e4cc1ba2406.png"; // עמוד 15
const PAGE_17_URL = "/lovable-uploads/c09ee251-2de5-4eda-b26d-57fe191d7f1b.png"; // עמוד 17
const PAGE_19_URL = "/lovable-uploads/4521ba9a-4b64-4f18-b368-268b3ae3ffa3.png"; // עמוד 19
const PAGE_21_URL = "/lovable-uploads/3a7b57d8-694f-43f2-a920-9b1e5dbfb8fd.png"; // עמוד 21
const PAGE_23_URL = "/lovable-uploads/49050bae-5ee5-451d-957b-b77716b34d34.png"; // עמוד 23
const PAGE_25_URL = "/lovable-uploads/f2b2e023-869e-49da-b3be-6c33b2f1f788.png"; // עמוד 25
const PAGE_27_URL = "/lovable-uploads/a615e9d5-fddf-4b50-ac80-59471d8c7e47.png"; // עמוד 27
const PAGE_29_URL = "/lovable-uploads/7ef0c8e5-dfc0-431f-9d75-90b1c70b2f7d.png"; // עמוד 29
const PAGE_31_URL = "/lovable-uploads/83fd1757-2d44-4fae-95a8-6df307919993.png"; // עמוד 31
const PAGE_33_URL = "/lovable-uploads/561280c9-6bce-4561-9eb1-c0921af9e5b7.png"; // עמוד 33

const FlipbookViewer: React.FC = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(2); // Changed from 1 to 2 for 200% default zoom
  const flipbookRef = useRef<HTMLDivElement>(null);
  const isHebrew = language === 'he';

  console.log('FlipbookViewer rendered successfully');
  console.log('Total pages:', BOOK_PAGES.length);
  console.log('Current page:', currentPage);

  // פונקציה לבדיקה אם העמוד הנוכחי הוא עמודים כפולים
  const isDoublePage = () => {
    return currentPage >= 2 && currentPage <= 17; // עמודים 2-3, 4-5, 6-7, 8-9, 10-11, 12-13, 14-15, 16-17, 18-19, 20-21, 22-23, 24-25, 26-27, 28-29, 30-31, 32-33
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
    const handleKeyDown = (e: KeyboardEvent) => {
      // מניעת F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, Print Screen
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's') ||
        e.key === 'PrintScreen'
      ) {
        e.preventDefault();
        return false;
      }

      // ניווט בספר
      if (e.key === 'ArrowRight') {
        if (!isHebrew) {
          nextPage();
        } else {
          prevPage();
        }
      } else if (e.key === 'ArrowLeft') {
        if (!isHebrew) {
          prevPage();
        } else {
          nextPage();
        }
      }
    };

    // זיהוי פתיחת כלי מפתחים
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        console.clear();
        console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
        console.log('%cThis is a browser feature intended for developers. Content is protected.', 'color: red; font-size: 16px;');
      }
    };

    // בדיקה מתמשכת לזיהוי כלי מפתחים
    const devToolsCheck = setInterval(detectDevTools, 1000);

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      clearInterval(devToolsCheck);
    };
  }, [isHebrew, currentPage]);

  const getCurrentPageDisplay = () => {
    if (currentPage === 0) {
      return isHebrew ? "כריכה קידמית" : "Front Cover";
    } else if (currentPage === 1) {
      return isHebrew ? "עמוד 1" : "Page 1";
    } else if (currentPage === 2) {
      return isHebrew ? "עמודים 2-3" : "Pages 2-3";
    } else if (currentPage === 3) {
      return isHebrew ? "עמודים 4-5" : "Pages 4-5";
    } else if (currentPage === 4) {
      return isHebrew ? "עמודים 6-7" : "Pages 6-7";
    } else if (currentPage === 5) {
      return isHebrew ? "עמודים 8-9" : "Pages 8-9";
    } else if (currentPage === 6) {
      return isHebrew ? "עמודים 10-11" : "Pages 10-11";
    } else if (currentPage === 7) {
      return isHebrew ? "עמודים 12-13" : "Pages 12-13";
    } else if (currentPage === 8) {
      return isHebrew ? "עמודים 14-15" : "Pages 14-15";
    } else if (currentPage === 9) {
      return isHebrew ? "עמודים 16-17" : "Pages 16-17";
    } else if (currentPage === 10) {
      return isHebrew ? "עמודים 18-19" : "Pages 18-19";
    } else if (currentPage === 11) {
      return isHebrew ? "עמודים 20-21" : "Pages 20-21";
    } else if (currentPage === 12) {
      return isHebrew ? "עמודים 22-23" : "Pages 22-23";
    } else if (currentPage === 13) {
      return isHebrew ? "עמודים 24-25" : "Pages 24-25";
    } else if (currentPage === 14) {
      return isHebrew ? "עמודים 26-27" : "Pages 26-27";
    } else if (currentPage === 15) {
      return isHebrew ? "עמודים 28-29" : "Pages 28-29";
    } else if (currentPage === 16) {
      return isHebrew ? "עמודים 30-31" : "Pages 30-31";
    } else if (currentPage === 17) {
      return isHebrew ? "עמודים 32-33" : "Pages 32-33";
    } else if (currentPage === BOOK_PAGES.length - 1) {
      return isHebrew ? "כריכה אחורית" : "Back Cover";
    }
    const pageNum = currentPage + 16;
    return isHebrew ? `עמוד ${pageNum}` : `Page ${pageNum}`;
  };

  // פונקציה ליצירת תמונה מוגנת
  const createProtectedImage = (src: string, alt: string, className: string, style?: React.CSSProperties) => (
    <img 
      src={src}
      alt={alt}
      className={className}
      style={style}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      draggable={false}
      style={{
        ...style,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        WebkitTouchCallout: 'none',
        WebkitUserDrag: 'none',
        KhtmlUserSelect: 'none'
      }}
    />
  );

  const getPageContent = () => {
    if (currentPage === 0) {
      return (
        <div className="relative w-96 h-full flex items-center justify-center">
          {createProtectedImage(
            BOOK_PAGES[0],
            "Front Cover",
            "max-w-full max-h-full object-contain rounded shadow-lg",
            { maxHeight: '600px' }
          )}
        </div>
      );
    } else if (currentPage === 1) {
      return (
        <div className="relative w-96 h-full flex items-center justify-center">
          {createProtectedImage(
            BOOK_PAGES[1],
            "Page 1",
            "max-w-full max-h-full object-contain rounded shadow-lg",
            { maxHeight: '600px' }
          )}
        </div>
      );
    } else if (currentPage === 2) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[2],
              "Page 2",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_3_URL,
              "Page 3",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 3) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[3],
              "Page 4",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_5_URL,
              "Page 5",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 4) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[4],
              "Page 6",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_7_URL,
              "Page 7",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 5) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[5],
              "Page 8",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_9_URL,
              "Page 9",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 6) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              PAGE_11_URL,
              "Page 11",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[6],
              "Page 10",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 7) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[7],
              "Page 12",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_13_URL,
              "Page 13",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 8) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[8],
              "Page 14",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_15_URL,
              "Page 15",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 9) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[9],
              "Page 16",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_17_URL,
              "Page 17",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 10) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[10],
              "Page 18",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_19_URL,
              "Page 19",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 11) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[11],
              "Page 20",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_21_URL,
              "Page 21",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 12) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              PAGE_23_URL,
              "Page 23",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[12],
              "Page 22",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 13) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[13],
              "Page 24",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_25_URL,
              "Page 25",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 14) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[14],
              "Page 26",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_27_URL,
              "Page 27",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 15) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[15],
              "Page 28",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_29_URL,
              "Page 29",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 16) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[16],
              "Page 30",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_31_URL,
              "Page 31",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else if (currentPage === 17) {
      return (
        <div className="relative flex items-center justify-center gap-2">
          <div className="relative">
            {createProtectedImage(
              BOOK_PAGES[17],
              "Page 32",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
          <div className="relative">
            {createProtectedImage(
              PAGE_33_URL,
              "Page 33",
              "max-w-full max-h-full object-contain rounded shadow-lg",
              { maxHeight: '600px', maxWidth: '300px' }
            )}
          </div>
        </div>
      );
    } else {
      return (
        <div className="relative w-96 h-full flex items-center justify-center">
          {createProtectedImage(
            BOOK_PAGES[currentPage],
            `Page ${currentPage + 16}`,
            "max-w-full max-h-full object-contain rounded shadow-lg",
            { maxHeight: '600px' }
          )}
        </div>
      );
    }
  };

  return (
    <div 
      className="glass-card p-6"
      onContextMenu={(e) => e.preventDefault()}
      onSelectStart={(e) => e.preventDefault()}
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      }}
    >
      {/* FlipbookControls */}
      <div className="flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <CustomButton
            variant="outline"
            size="sm"
            onClick={zoomOut}
            disabled={zoom <= 0.5}
            icon={<ZoomOut className="w-4 h-4" />}
          >
            {isHebrew ? "הקטן" : "Zoom Out"}
          </CustomButton>
          
          <span className="mx-2 text-sm font-medium">
            {Math.round(zoom * 100)}%
          </span>
          
          <CustomButton
            variant="outline"
            size="sm"
            onClick={zoomIn}
            disabled={zoom >= 2}
            icon={<ZoomIn className="w-4 h-4" />}
          >
            {isHebrew ? "הגדל" : "Zoom In"}
          </CustomButton>
          
          <CustomButton
            variant="outline"
            size="sm"
            onClick={resetZoom}
            icon={<RotateCcw className="w-4 h-4" />}
          >
            {isHebrew ? "איפוס" : "Reset"}
          </CustomButton>
        </div>
        
        <div className="text-center">
          <span className="text-lg font-semibold">
            {getCurrentPageDisplay()}
          </span>
          <span className="text-sm text-gray-500 block">
            {isHebrew ? `מתוך ${BOOK_PAGES.length}` : `of ${BOOK_PAGES.length}`}
          </span>
        </div>
      </div>

      {/* אזור הפליפבוק */}
      <div className="relative overflow-hidden bg-gray-50 rounded-lg shadow-lg flex justify-center items-center" style={{ height: '700px' }}>
        <div 
          ref={flipbookRef} 
          className="flipbook-container"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          {getPageContent()}
        </div>
        
        {/* FlipbookNavigation */}
        <CustomButton
          variant="ghost"
          size="lg"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
          onClick={isHebrew ? nextPage : prevPage}
          disabled={isHebrew ? currentPage >= BOOK_PAGES.length - 1 : currentPage <= 0}
          icon={<ChevronLeft className="w-6 h-6" />}
        >
          {""}
        </CustomButton>
        
        <CustomButton
          variant="ghost"
          size="lg"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-lg"
          onClick={isHebrew ? prevPage : nextPage}
          disabled={isHebrew ? currentPage <= 0 : currentPage >= BOOK_PAGES.length - 1}
          icon={<ChevronRight className="w-6 h-6" />}
        >
          {""}
        </CustomButton>
      </div>

      {/* FlipbookPageSlider */}
      <div className="mt-4 px-4">
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium min-w-0">
            {isHebrew ? "עמוד:" : "Page:"}
          </span>
          <input
            type="range"
            min="0"
            max={BOOK_PAGES.length - 1}
            value={currentPage}
            onChange={(e) => goToPage(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(currentPage / (BOOK_PAGES.length - 1)) * 100}%, #E5E7EB ${(currentPage / (BOOK_PAGES.length - 1)) * 100}%, #E5E7EB 100%)`
            }}
          />
          <span className="text-sm text-gray-500 min-w-0">
            {currentPage + 1} / {BOOK_PAGES.length}
          </span>
        </div>
      </div>

      {/* FlipbookWarning */}
      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          {isHebrew 
            ? "השתמש בחצים או בכפתורי הניווט לדפדוף בין העמודים"
            : "Use arrow keys or navigation buttons to flip through pages"
          }
        </p>
      </div>
    </div>
  );
};

export default FlipbookViewer;
