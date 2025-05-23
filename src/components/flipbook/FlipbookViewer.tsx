
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/e89c9bd7-393a-451a-b958-7240e55c752f.png", // עמוד 0
  "/lovable-uploads/381073d2-cc28-4cc9-baa4-3ceccd91fef8.png", // עמוד 1
  "/lovable-uploads/3516d542-5438-48f3-8cdc-87c9a5922c74.png", // עמוד 2
  "/lovable-uploads/cd0b9a36-7557-4622-8951-4fb4c8aaa0c1.png", // עמוד 3
  "/lovable-uploads/f6de210b-d110-41be-8730-28d4ba327574.png", // עמוד 4
  "/lovable-uploads/ddb5d4db-a0eb-4b37-b070-1c5ea9d981ef.png", // עמוד 5
  "/lovable-uploads/a9433a7e-9edf-4ea0-80e9-2a3d19251e1b.png", // עמוד 6
  "/lovable-uploads/2579f535-3bd5-4fa1-a627-5b9fbde0e5d5.png", // עמוד 7
  "/lovable-uploads/e7e2ce0e-2d59-4f03-9283-cc5c51459b57.png", // עמוד 8
  "/lovable-uploads/81fe36ef-02a1-49ff-a666-26f8dd17676a.png", // עמוד 9
  "/lovable-uploads/e74d741a-81bc-46bf-b692-6599810f951a.png", // עמוד 10
  "/lovable-uploads/dc5e6324-bae3-47f9-bf59-6757f4e7b6a2.png", // עמוד 11
  "/lovable-uploads/fb1a4e00-b0b0-4513-a23a-2b019f30e085.png", // עמוד 12
  "/lovable-uploads/8b20e77a-cfa9-41e0-b431-330db7caa929.png", // עמוד 13
  "/lovable-uploads/66c711a7-ea38-414e-aa39-76fa04ca908e.png", // עמוד 14
  "/lovable-uploads/542f3054-cc78-470d-bb62-0bf6fcb4ab14.png", // עמוד 15
  "/lovable-uploads/a61e9e23-25cc-4baa-839c-0309f03b3005.png", // עמוד 16
  "/lovable-uploads/cae724d7-3612-47c3-8e16-bbabe9186464.png", // עמוד 17
  "/lovable-uploads/6074ce7a-d654-47ed-9071-8ed85fdddca7.png", // עמוד 18
  "/lovable-uploads/8d47e9aa-012d-4f28-91c4-6c52ea88f427.png", // עמוד 19
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
