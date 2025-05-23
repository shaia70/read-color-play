
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/f3774be2-f5fb-45b0-a9e8-83e77df84a9e.png", // עמוד 0 - כריכה קדמית
  "/lovable-uploads/21efd8ff-cb6f-4d6a-958c-894ef6dfb937.png", // עמוד 1
  "/lovable-uploads/22f2f13e-8bc1-4b90-9ae3-036e3ae93e45.png", // עמוד 2
  "/lovable-uploads/2f584bb6-86b1-4f25-9e98-3196dded5656.png", // עמוד 3
  "/lovable-uploads/35dd9296-8f66-41f2-9e78-422f55eb3805.png", // עמוד 4
  "/lovable-uploads/3d32c013-a9f6-4328-a2f5-c63021aba4d7.png", // עמוד 5
  "/lovable-uploads/3e3e94c6-ba7c-4c4f-a353-7fe42344ed7e.png", // עמוד 6
  "/lovable-uploads/409a1845-2abd-436e-ad91-e690c43bb547.png", // עמוד 7
  "/lovable-uploads/44a963fb-7541-454e-aca5-f9aeb4020eaa.png", // עמוד 8
  "/lovable-uploads/51a16e0a-7938-41aa-b510-013c91d16360.png", // עמוד 9
  "/lovable-uploads/6d2e51a2-475f-4be3-ba85-ee4dc423667d.png", // עמוד 10
  "/lovable-uploads/9947f510-a46b-4788-8edb-4a6fab9adfa2.png", // עמוד 11
  "/lovable-uploads/c3ef4fdc-e152-44c2-b262-f3c0469d39a6.png", // עמוד 12
  "/lovable-uploads/cd98fd58-0725-4662-b758-9de502710b6b.png", // עמוד 13
  "/lovable-uploads/e2937d84-0ea2-43c7-b3be-d65528e9a40e.png", // עמוד 14
  "/lovable-uploads/e9c19c63-97db-4749-b35b-43f65856d60b.png", // עמוד 15
  "/lovable-uploads/0b568d8c-df0e-44bf-9c93-b711ffa2a80e.png", // עמוד 16
  "/lovable-uploads/03e7a450-9b7f-4364-b0b6-80dcdd6345a4.png", // עמוד 17
  "/lovable-uploads/1c8f7d5e-8f2a-4b89-9c3d-4e5f6a7b8c9d.png", // עמוד 18
  "/lovable-uploads/2d9e8f4e-9f3b-4c8a-ad4e-5f6g7h8i9j0k.png", // עמוד 19
  "/lovable-uploads/3e0f9g5f-af4c-4d9b-be5f-6g7h8i9j0k1l.png", // עמוד 20
  "/lovable-uploads/4f1g0h6g-bf5d-4e0c-cf6g-7h8i9j0k1l2m.png", // עמוד 21
  "/lovable-uploads/5g2h1i7h-cg6e-4f1d-dg7h-8i9j0k1l2m3n.png", // עמוד 22
  "/lovable-uploads/6h3i2j8i-dh7f-4g2e-eh8i-9j0k1l2m3n4o.png", // עמוד 23
  "/lovable-uploads/7i4j3k9j-ei8g-4h3f-fi9j-0k1l2m3n4o5p.png", // עמוד 24
  "/lovable-uploads/8j5k4l0k-fj9h-4i4g-gj0k-1l2m3n4o5p6q.png", // עמוד 25
  "/lovable-uploads/9k6l5m1l-gk0i-4j5h-hk1l-2m3n4o5p6q7r.png", // עמוד 26
  "/lovable-uploads/0l7m6n2m-hl1j-4k6i-il2m-3n4o5p6q7r8s.png", // עמוד 27
  "/lovable-uploads/1m8n7o3n-im2k-4l7j-jm3n-4o5p6q7r8s9t.png", // עמוד 28
  "/lovable-uploads/2n9o8p4o-jn3l-4m8k-kn4o-5p6q7r8s9t0u.png", // עמוד 29
  "/lovable-uploads/3o0p9q5p-ko4m-4n9l-lo5p-6q7r8s9t0u1v.png", // עמוד 30
  "/lovable-uploads/4p1q0r6q-lp5n-4o0m-mp6q-7r8s9t0u1v2w.png", // עמוד 31
  "/lovable-uploads/5q2r1s7r-mq6o-4p1n-nq7r-8s9t0u1v2w3x.png", // עמוד 32
  "/lovable-uploads/6r3s2t8s-nr7p-4q2o-or8s-9t0u1v2w3x4y.png", // עמוד 33
  "/lovable-uploads/7s4t3u9t-os8q-4r3p-ps9t-0u1v2w3x4y5z.png", // עמוד 34
  "/lovable-uploads/8t5u4v0u-pt9r-4s4q-qt0u-1v2w3x4y5z6a.png", // עמוד 35
  "/lovable-uploads/9u6v5w1v-qu0s-4t5r-ru1v-2w3x4y5z6a7b.png", // עמוד 36
  "/lovable-uploads/0v7w6x2w-rv1t-4u6s-sv2w-3x4y5z6a7b8c.png", // עמוד 37
  "/lovable-uploads/1w8x7y3x-sw2u-4v7t-tw3x-4y5z6a7b8c9d.png", // עמוד 38
  "/lovable-uploads/2x9y8z4y-tx3v-4w8u-ux4y-5z6a7b8c9d0e.png", // עמוד 39
  "/lovable-uploads/3y0z9a5z-uy4w-4x9v-vy5z-6a7b8c9d0e1f.png", // עמוד 40
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
