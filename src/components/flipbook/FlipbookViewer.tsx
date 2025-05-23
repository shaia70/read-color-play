import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/152a3edb-4beb-4bca-80f8-bee8dc682ed8.png", // עמוד 0 - כריכה קדמית
  "/lovable-uploads/762db1b9-3d0f-4529-b23a-2039126cb1b9.png", // עמוד 1
  "/lovable-uploads/f7bd361e-d36d-42d5-b20b-839ea4d69b7e.png", // עמוד 2
  "/lovable-uploads/0f3a2cb7-7df7-4f39-8e3f-9d905ffb67f5.png", // עמוד 3
  "/lovable-uploads/aa88f82c-0849-4910-835c-ae0f8fcebaad.png", // עמוד 4
  "/lovable-uploads/be086f7a-22cd-40b2-9c38-fcfe17cfb323.png", // עמוד 5
  "/lovable-uploads/6fe19a3f-bea7-4778-ac9e-321d62cd3fe5.png", // עמוד 6
  "/lovable-uploads/5a226507-a931-440f-a136-a34537f2eac3.png", // עמוד 7
  "/lovable-uploads/866a6645-a102-48e0-aaee-8fb2ddde04da.png", // עמוד 8
  "/lovable-uploads/b056b00f-02a3-4853-9f43-b1f616091819.png", // עמוד 9
  "/lovable-uploads/509861e8-87d7-47f7-9682-8f9854e20fc0.png", // עמוד 10
  "/lovable-uploads/5ae34d55-2ba5-4339-a071-73250a9774b9.png", // עמוד 11
  "/lovable-uploads/ec0bbda3-ee92-4a63-80fc-b482ca5dbb91.png", // עמוד 12
  "/lovable-uploads/2553053f-b870-4421-b048-425802385e41.png", // עמוד 13
  "/lovable-uploads/77f69899-7ba3-4b3f-80d6-58302d62c1c5.png", // עמוד 14
  "/lovable-uploads/dea41a4b-b011-4b01-b833-c9483c4e4a88.png", // עמוד 15
  "/lovable-uploads/4ff0d60e-6931-4359-8432-2904bc23345b.png", // עמוד 16
  "/lovable-uploads/9655912c-4684-4f7d-a34e-5a0a3e8d3f80.png", // עמוד 17
  "/lovable-uploads/e2df8798-6f1c-4783-8fd9-58c4d2246179.png", // עמוד 18
  "/lovable-uploads/29f90605-e230-4b8d-beff-addce4c02454.png", // עמוד 19
  "/lovable-uploads/c5acd3e6-bd35-4e96-b689-d3c027df82df.png", // עמוד 20
  "/lovable-uploads/d6c1f4da-580c-42a1-be8d-4e5b62fec4cc.png", // עמוד 21
  "/lovable-uploads/d85626b8-5e48-4fec-82e8-98f89103ed8a.png", // עמוד 22
  "/lovable-uploads/f84796f9-3a87-4695-9be5-04e8f11d514e.png", // עמוד 23
  "/lovable-uploads/1d526f58-067f-4d1d-9377-05238e74fa61.png", // עמוד 24
  "/lovable-uploads/a71aca5b-0436-4092-8d09-2c23a0ffe76c.png", // עמוד 25
  "/lovable-uploads/d0e2493d-ea13-4857-af63-10315911311e.png", // עמוד 26
  "/lovable-uploads/d3205053-d5bf-42ee-a30b-71dc100e4835.png", // עמוד 27
  "/lovable-uploads/09745eb5-c3c6-4132-a675-ddc3cd72d3cf.png", // עמוד 28
  "/lovable-uploads/3b336832-d4fc-46ed-af6e-ba4f4220bdc8.png", // עמוד 29
  "/lovable-uploads/a1c04c78-3f58-4244-ba14-969fc75731cc.png", // עמוד 30
  "/lovable-uploads/8d6d3094-335d-4af1-b538-59d44f98f375.png", // עמוד 31
  "/lovable-uploads/ed811d33-55df-40c6-b05f-c9d04f9aafba.png", // עמוד 32
  "/lovable-uploads/5593783c-5a1b-4bf8-b4fb-e12cfc2b3513.png", // עמוד 33
  "/lovable-uploads/b813fe62-11e1-4f5a-9551-0de15de9985d.png", // עמוד 34
  "/lovable-uploads/3d419807-93d0-4593-95fe-003daabac971.png", // עמוד 35
  "/lovable-uploads/e3c4bb18-82d8-4ea6-8959-2e3ea5fa4ce6.png", // עמוד 36
  "/lovable-uploads/4658ffef-885c-4ac9-9373-3cb82f6e1627.png", // עמוד 37
  "/lovable-uploads/4dc1315a-9678-472e-be48-5d0c1168713e.png", // עמוד 38
  "/lovable-uploads/41c273a5-b7a9-4043-97ed-65b758288c23.png", // עמוד 39
  "/lovable-uploads/c5acd3e6-bd35-4e96-b689-d3c027df82df.png", // עמוד 40 - זהה לעמוד 20
  "/lovable-uploads/64b38785-e75d-4f3a-8174-814314c9d64f.png", // עמוד 41 - כריכה אחורית
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
