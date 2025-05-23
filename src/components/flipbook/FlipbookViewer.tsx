
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  // עמודים 0-19
  "/lovable-uploads/53dcc77b-f824-4621-81a5-e715adf178ef.png", // עמוד 0
  "/lovable-uploads/56eb4bdb-5724-47f7-8696-ef162c9a14d8.png", // עמוד 1
  "/lovable-uploads/d0cc02c7-7e1a-4998-a688-7dcbfec41055.png", // עמוד 2
  "/lovable-uploads/956662d7-3a40-4712-8f1e-35121cb29727.png", // עמוד 3
  "/lovable-uploads/b55e2062-23b9-4460-9db3-c0f8ac3b27cb.png", // עמוד 4
  "/lovable-uploads/f0fb83e9-793e-4792-b4cd-9e4454b9c46f.png", // עמוד 5
  "/lovable-uploads/0e1e04ca-8341-4057-b16b-abf40c5c9c28.png", // עמוד 6
  "/lovable-uploads/5045437c-ab06-4bde-9508-8a6005420bba.png", // עמוד 7
  "/lovable-uploads/4809ada0-873d-4dc2-bd79-f98ee3bd3a33.png", // עמוד 8
  "/lovable-uploads/e075b942-7655-4a7b-96ce-ee53c82bc2f2.png", // עמוד 9
  "/lovable-uploads/8d8dd7c8-4feb-4338-bf08-f63bcc305121.png", // עמוד 10
  "/lovable-uploads/6fa76c09-f60a-4f23-8ffa-2720c05ce58b.png", // עמוד 11
  "/lovable-uploads/a543f7e0-bd0e-4c8c-a89f-0769208ee5ae.png", // עמוד 12
  "/lovable-uploads/c20d6c37-11e1-440e-93e0-294023faffdf.png", // עמוד 13
  "/lovable-uploads/13b3ca42-04f6-4e27-832d-b84911cc54e8.png", // עמוד 14
  "/lovable-uploads/b30dca7d-8eb7-4a62-a184-d438c3a7cbd3.png", // עמוד 15
  "/lovable-uploads/80acc27d-abc1-4d24-8c4f-c5212318e786.png", // עמוד 16
  "/lovable-uploads/5f4ac748-e6d2-4bc8-a17f-00c023a1c099.png", // עמוד 17
  "/lovable-uploads/f82fb4a3-48cd-465f-b4c0-8a1b1818ef6f.png", // עמוד 18
  "/lovable-uploads/974c69e6-8336-4aa5-bc5e-9864d752f5b3.png", // עמוד 19
  // עמודים 20-39 יתווספו בהעלאה הבאה
];

const FlipbookViewer = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [totalPages, setTotalPages] = useState(BOOK_PAGES.length);
  const isHebrew = language === 'he';

  // Debug console logs
  useEffect(() => {
    console.log('FlipbookViewer mounted');
    console.log('Total pages:', BOOK_PAGES.length);
    console.log('Current page:', currentPage);
    console.log('Current image URL:', BOOK_PAGES[currentPage]);
    console.log('All pages array:', BOOK_PAGES);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      console.log('Next page clicked, going to page:', currentPage + 1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      console.log('Previous page clicked, going to page:', currentPage - 1);
      setCurrentPage(currentPage - 1);
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

  // מאזין ללחיצות מקלדת לניווט בין עמודים
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
  }, [currentPage, totalPages, isHebrew]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully for page:', currentPage);
  };

  const handleImageError = () => {
    console.error('Failed to load image for page:', currentPage, 'URL:', BOOK_PAGES[currentPage]);
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
          {isHebrew ? `עמוד ${currentPage + 1} מתוך ${totalPages}` : `Page ${currentPage + 1} of ${totalPages}`}
        </div>
      </div>

      {/* אזור הפליפבוק */}
      <div className="relative overflow-hidden bg-gray-50 rounded-lg" style={{ height: '600px' }}>
        <div 
          className="flex justify-center items-center h-full"
          style={{ transform: `scale(${zoom})`, transition: 'transform 0.3s ease' }}
        >
          {totalPages > 0 ? (
            <img
              src={BOOK_PAGES[currentPage]}
              alt={`${isHebrew ? 'עמוד' : 'Page'} ${currentPage + 1}`}
              className="max-h-full max-w-full object-contain shadow-lg"
              style={{ userSelect: 'none', pointerEvents: 'none' }}
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          ) : (
            <div className="text-gray-500">
              {isHebrew ? "אין עמודים להצגה" : "No pages to display"}
            </div>
          )}
        </div>
        
        {/* כפתורי ניווט */}
        {totalPages > 1 && (
          <>
            <div className="absolute inset-y-0 left-4 flex items-center">
              <CustomButton
                variant="blue"
                size="icon"
                onClick={prevPage}
                disabled={currentPage === 0}
                className="bg-white/90 text-shelley-blue hover:bg-white shadow-lg"
              >
                <ChevronLeft className="w-6 h-6" />
              </CustomButton>
            </div>
            
            <div className="absolute inset-y-0 right-4 flex items-center">
              <CustomButton
                variant="blue"
                size="icon"
                onClick={nextPage}
                disabled={currentPage === totalPages - 1}
                className="bg-white/90 text-shelley-blue hover:bg-white shadow-lg"
              >
                <ChevronRight className="w-6 h-6" />
              </CustomButton>
            </div>
          </>
        )}
      </div>

      {/* סרגל עמודים */}
      {totalPages > 1 && (
        <div className="mt-6">
          <input
            type="range"
            min="0"
            max={totalPages - 1}
            value={currentPage}
            onChange={(e) => setCurrentPage(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>1</span>
            <span>{totalPages}</span>
          </div>
        </div>
      )}

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
