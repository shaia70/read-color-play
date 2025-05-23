import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/6e398b2e-8df1-4797-8b75-08f16e18ed26.png", // עמוד 0
  "/lovable-uploads/26a8e1c0-8e74-4e4a-8e95-40d4ba5c9765.png", // עמוד 1
  "/lovable-uploads/d89b6f8c-b827-44f2-bb07-73e4c55ec67b.png", // עמוד 2
  "/lovable-uploads/e7b8c7e9-83d5-414a-b37b-86a11e61fb02.png", // עמוד 3
  "/lovable-uploads/2bd75bae-a5f3-47fb-93a7-7c8b7e8b6925.png", // עמוד 4
  "/lovable-uploads/e8a8e87e-5c86-47a3-9b1b-5c4b8e3c4b42.png", // עמוד 5
  "/lovable-uploads/8e2b7d43-cd31-4bb9-8b7d-21e3e8a4e5f2.png", // עמוד 6
  "/lovable-uploads/48c5e2a8-f7e3-4e2a-8f7b-2b4e8e3a7e62.png", // עמוד 7
  "/lovable-uploads/89b2e3c5-d8a4-4c3b-8b7e-3e4f8a2b7c5d.png", // עמוד 8
  "/lovable-uploads/5e8a2b7c-f9d3-4a8b-8e7c-4d2f8a5b7e3c.png", // עמוד 9
  "/lovable-uploads/7c5b8e3a-a2f4-4b8e-8c7d-5e3f8a2b7c5e.png", // עמוד 10
  "/lovable-uploads/3a8b7e5c-e4f2-4c8b-8d7e-6f4a8b2e7c5f.png", // עמוד 11
  "/lovable-uploads/8b7c5e3a-f5a3-4d8c-8e7f-7a5b8c3e7d5a.png", // עמוד 12
  "/lovable-uploads/5c3e8a7b-a6b4-4e8d-8f7a-8b6c8d4e8a7b.png", // עמוד 13
  "/lovable-uploads/7a5b8c3e-b7c5-4f8e-8a7b-9c7d8e5f8b7c.png", // עמוד 14
  "/lovable-uploads/3e8b7c5a-c8d6-4a8f-8b7c-ad8e8f6a8c7d.png", // עמוד 15
  "/lovable-uploads/8c7d5e3b-d9e7-4b8a-8c7d-be9f8a7b8d7e.png", // עמוד 16
  "/lovable-uploads/5e3b8c7d-eaf8-4c8b-8d7e-cfaa8b8c8e7f.png", // עמוד 17
  "/lovable-uploads/7d5f3c8e-fba9-4d8c-8e7f-daab8c9d8f7a.png", // עמוד 18
  "/lovable-uploads/3c8e7d5f-acba-4e8d-8f7a-ebbc8d9e8a7b.png", // עמוד 19
  "/lovable-uploads/fb6b1b3b-a7f1-4074-abaa-1e7b6e70b5a6.png", // עמוד 20
  "/lovable-uploads/d31ce969-ac8e-4e87-bb29-e6e5e40b5e10.png", // עמוד 21
  "/lovable-uploads/f7e0b8b5-e3a1-4c3b-9c97-9b7b2f2b3e8f.png", // עמוד 22
  "/lovable-uploads/ab6b3c1f-8d5a-4a74-b8a5-c8f8e5c7a3d9.png", // עמוד 23
  "/lovable-uploads/e8f7c3a5-9e6b-4b75-c9b6-d9a9f6d8b4ea.png", // עמוד 24
  "/lovable-uploads/b9a8d4b6-af7c-4c76-dac7-eababf7ea9c5.png", // עמוד 25
  "/lovable-uploads/cad9e5c7-ba8d-4d77-ebd8-fbcbca8fb6d6.png", // עמוד 26
  "/lovable-uploads/dbeaf6d8-cb9e-4e78-fce9-acdc9db7c7e7.png", // עמוד 27
  "/lovable-uploads/ecfba7e9-dcaf-4f79-adfa-bdedaea8d8f8.png", // עמוד 28
  "/lovable-uploads/fdacb8fa-edba-4a7a-beab-cefefbfae9a9.png", // עמוד 29
  "/lovable-uploads/aebdc9ab-fecb-4b7b-cfbc-dfafafcfaaba.png", // עמוד 30
  "/lovable-uploads/bfcedabc-afdc-4c7c-dac.png", // עמוד 31
  "/lovable-uploads/cadadbcd-baed-4d7d-ebce-fbdbabdfbbcb.png", // עמוד 32
  "/lovable-uploads/dbebecde-cbfe-4e7e-fccf-acecbcefccdc.png", // עמוד 33
  "/lovable-uploads/ecfcfdef-dcaf-4f7f-addaaf-bdfdcdfaddcd.png", // עמוד 34
  "/lovable-uploads/fdadadea-edba-4a8a-beeb-ceaebdeabeae.png", // עמוד 35
  "/lovable-uploads/aebebefb-fecb-4b8b-cffc-dfbfcefbcfbf.png", // עמוד 36
  "/lovable-uploads/bfcfcfac-afdc-4c8c-daad-eacadafacaca.png", // עמוד 37
  "/lovable-uploads/cadadadb-baed-4d8d-ebbb-fbdbdbabdbdb.png", // עמוד 38
  "/lovable-uploads/dbebeece-cbfe-4e8e-fccc-acecccceccec.png", // עמוד 39
  "/lovable-uploads/636ca7ad-b110-4957-929a-b520ba904a44.png", // עמוד 40 - עודכן!
  "/lovable-uploads/adf97056-3f45-47b3-b94d-77c4d9b7a4b1.png", // עמוד 41
];

const FlipbookViewer = () => {
  const { language } = useLanguage();
  const [currentPage, setCurrentPage] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [totalPages, setTotalPages] = useState(BOOK_PAGES.length);
  const isHebrew = language === 'he';

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
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
              style={{ userSelect: 'none', pointerEvents: 'none' }} // מונע הורדה/העתקה
              onContextMenu={(e) => e.preventDefault()} // מונע לחיצה ימנית
              onDragStart={(e) => e.preventDefault()} // מונע גרירה
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
