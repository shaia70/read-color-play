
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/09c72d09-4d5d-452b-ab59-b1ec7ba426c4.png", // עמוד 0
  "/lovable-uploads/2c7a8f8e-97d7-4b2b-8e2f-1c4a5d6e9f3b.png", // עמוד 1
  "/lovable-uploads/8a3e5f1d-6c9b-4a2e-9d7f-5b8c1e4a6d9f.png", // עמוד 2
  "/lovable-uploads/4b9c6d2f-8e1a-4d5b-9c8f-7a3e5b1d4c9a.png", // עמוד 3
  "/lovable-uploads/7e8f9a1c-5d2b-4e9a-8c6f-9d1a4b7e5c8f.png", // עמוד 4
  "/lovable-uploads/1c4a7d9b-9e6f-4a8c-7d5b-8e1c4a7d9b6f.png", // עמוד 5
  "/lovable-uploads/9f6e8c1a-4d7b-4e9c-6a8f-7d1b4e9c6a8f.png", // עמוד 6
  "/lovable-uploads/5b8e1c4a-7d9f-4a6c-8e1b-4a7d9f6c8e1b.png", // עמוד 7
  "/lovable-uploads/8c6f9d1a-4e7b-4c9a-6f8d-1a4e7b9c6f8d.png", // עמוד 8
  "/lovable-uploads/2a5d8f1c-9e6b-4d8a-5f1c-9e6b8a5f1c9e.png", // עמוד 9
  "/lovable-uploads/6f9c2e5a-8d1b-4f9c-2e5a-8d1b5c2e5a8d.png", // עמוד 10
  "/lovable-uploads/4e7a9d2c-6f1b-4e7a-9d2c-6f1b2c9d2c6f.png", // עמוד 11
  "/lovable-uploads/8b5f2e9a-1d4c-4b5f-2e9a-1d4c9a2e9a1d.png", // עמוד 12
  "/lovable-uploads/7c9a3f6e-2d5b-4c9a-3f6e-2d5b6e3f6e2d.png", // עמוד 13
  "/lovable-uploads/1a4e8c2f-9d6b-4a4e-8c2f-9d6b2f8c2f9d.png", // עמוד 14
  "/lovable-uploads/5f8d1c4a-7e9b-4f8d-1c4a-7e9b4a1c4a7e.png", // עמוד 15
  "/lovable-uploads/9c6f2e5a-8d1b-4c6f-2e5a-8d1b5a2e5a8d.png", // עמוד 16
  "/lovable-uploads/3a7e9c2f-6d4b-4a7e-9c2f-6d4b2f9c2f6d.png", // עמוד 17
  "/lovable-uploads/8e1c5a9f-4d7b-4e1c-5a9f-4d7b9f5a9f4d.png", // עמוד 18
  "/lovable-uploads/2f6a8e1c-9d4b-4f6a-8e1c-9d4b1c8e1c9d.png", // עמוד 19
  "/lovable-uploads/510f15a6-71a8-4d13-b284-38c8b2f99082.png", // עמוד 20
  "/lovable-uploads/08f38d0e-9913-46af-9db4-6408e24256eb.png", // עמוד 21
  "/lovable-uploads/5344cc21-7d0e-403e-b330-9eec2213e239.png", // עמוד 22
  "/lovable-uploads/b89821f3-ed19-4310-a3c0-7d0e2869f88d.png", // עמוד 23
  "/lovable-uploads/5cf2ef8e-64e2-45b5-857e-148f6cee5f4c.png", // עמוד 24
  "/lovable-uploads/d08e7a20-aab1-44c3-bfef-53c2a6ed98ae.png", // עמוד 25
  "/lovable-uploads/b2c5f8a0-a1c1-4f91-9fc3-501b1fd1c583.png", // עמוד 26
  "/lovable-uploads/b50bb3ea-fecd-40a0-a540-c38d90b922ef.png", // עמוד 27
  "/lovable-uploads/a94675c7-1656-427b-a786-5d9da97124d1.png", // עמוד 28
  "/lovable-uploads/9f3ebfe5-ba46-4368-a637-cba2a821bbcf.png", // עמוד 29
  "/lovable-uploads/c1b50e04-3013-4092-a8ff-87fe7e1cb57c.png", // עמוד 30
  "/lovable-uploads/67633b20-8549-479b-bec9-aec0ca52c2fc.png", // עמוד 31
  "/lovable-uploads/0152855e-f606-4a4d-a3bb-04c17eec7fbd.png", // עמוד 32
  "/lovable-uploads/9d8e0b27-61d5-48e7-8334-c21d6cd02675.png", // עמוד 33
  "/lovable-uploads/b1e57728-c409-4972-9b55-9ae77d3d475f.png", // עמוד 34
  "/lovable-uploads/affb3673-1579-407e-9c89-95aea3d34771.png", // עמוד 35
  "/lovable-uploads/63706d3d-7930-46bc-aed9-d1dbde772c0d.png", // עמוד 36
  "/lovable-uploads/234e01a2-5127-4b9b-879c-9a7d36eeb16f.png", // עמוד 37
  "/lovable-uploads/0e73f95a-8f36-4555-8c9e-6f49b6c6b4d9.png", // עמוד 38
  "/lovable-uploads/68fe855d-756f-42f6-94a0-c72da07244db.png", // עמוד 39
  "/lovable-uploads/bdd3d13e-0d6a-49ab-9213-beeeaddeb00c.png", // עמוד 40
  "/lovable-uploads/db4b97d6-5279-4828-99e5-3a42e6e972f3.png", // עמוד 41
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
          {isHebrew ? `עמוד ${currentPage + 1} מתוך ${BOOK_PAGES.length}` : `Page ${currentPage + 1} of ${BOOK_PAGES.length}`}
        </div>
      </div>

      {/* אזור הפליפבוק */}
      <div className="relative overflow-hidden bg-gray-50 rounded-lg shadow-lg flex justify-center items-center" style={{ height: '700px' }}>
        <div 
          ref={flipbookRef} 
          className="flipbook-container"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
        >
          <div className="relative w-96 h-full flex items-center justify-center">
            <img 
              src={BOOK_PAGES[currentPage]} 
              alt={`Page ${currentPage + 1}`}
              className="max-w-full max-h-full object-contain rounded shadow-lg"
              style={{ maxHeight: '600px' }}
            />
          </div>
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
          <span>1</span>
          <span>{BOOK_PAGES.length}</span>
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
