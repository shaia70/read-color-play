import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/152a3edb-4beb-4bca-80f8-bee8dc682ed8.png", // עמוד 0 - כריכה קדמית page-000.jpg
  "/lovable-uploads/762db1b9-3d0f-4529-b23a-2039126cb1b9.png", // עמוד 1 - page-001.jpg
  "/lovable-uploads/f7bd361e-d36d-42d5-b20b-839ea4d69b7e.png", // עמוד 2 - page-002.jpg
  "/lovable-uploads/0f3a2cb7-7df7-4f39-8e3f-9d905ffb67f5.png", // עמוד 3 - page-003.jpg
  "/lovable-uploads/aa88f82c-0849-4910-835c-ae0f8fcebaad.png", // עמוד 4 - page-004.jpg
  "/lovable-uploads/be086f7a-22cd-40b2-9c38-fcfe17cfb323.png", // עמוד 5 - page-005.jpg
  "/lovable-uploads/6fe19a3f-bea7-4778-ac9e-321d62cd3fe5.png", // עמוד 6 - page-006.jpg
  "/lovable-uploads/5a226507-a931-440f-a136-a34537f2eac3.png", // עמוד 7 - page-007.jpg
  "/lovable-uploads/866a6645-a102-48e0-aaee-8fb2ddde04da.png", // עמוד 8 - page-008.jpg
  "/lovable-uploads/b056b00f-02a3-4853-9f43-b1f616091819.png", // עמוד 9 - page-009.jpg
  "/lovable-uploads/509861e8-87d7-47f7-9682-8f9854e20fc0.png", // עמוד 10 - page-010.jpg
  "/lovable-uploads/5ae34d55-2ba5-4339-a071-73250a9774b9.png", // עמוד 11 - page-011.jpg
  "/lovable-uploads/ec0bbda3-ee92-4a63-80fc-b482ca5dbb91.png", // עמוד 12 - page-012.jpg
  "/lovable-uploads/2553053f-b870-4421-b048-425802385e41.png", // עמוד 13 - page-013.jpg
  "/lovable-uploads/77f69899-7ba3-4b3f-80d6-58302d62c1c5.png", // עמוד 14 - page-014.jpg
  "/lovable-uploads/dea41a4b-b011-4b01-b833-c9483c4e4a88.png", // עמוד 15 - page-015.jpg
  "/lovable-uploads/4ff0d60e-6931-4359-8432-2904bc23345b.png", // עמוד 16 - page-016.jpg
  "/lovable-uploads/9655912c-4684-4f7d-a34e-5a0a3e8d3f80.png", // עמוד 17 - page-017.jpg
  "/lovable-uploads/e2df8798-6f1c-4783-8fd9-58c4d2246179.png", // עמוד 18 - page-018.jpg
  "/lovable-uploads/29f90605-e230-4b8d-beff-addce4c02454.png", // עמוד 19 - page-019.jpg
  // עמודים 20-40 ימתינו עד שתעלה את שאר הקבצים
  "/lovable-uploads/1c8f7d5e-8f2a-4b89-9c3d-4e5f6a7b8c9d.png", // עמוד 20 - זמני
  "/lovable-uploads/2d9e8f4e-9f3b-4c8a-ad4e-5f6g7h8i9j0k.png", // עמוד 21 - זמני
  "/lovable-uploads/3e0f9g5f-af4c-4d9b-be5f-6g7h8i9j0k1l.png", // עמוד 22 - זמני
  "/lovable-uploads/4f1g0h6g-bf5d-4e0c-cf6g-7h8i9j0k1l2m.png", // עמוד 23 - זמני
  "/lovable-uploads/5g2h1i7h-cg6e-4f1d-dg7h-8i9j0k1l2m3n.png", // עמוד 24 - זמני
  "/lovable-uploads/6h3i2j8i-dh7f-4g2e-eh8i-9j0k1l2m3n4o.png", // עמוד 25 - זמני
  "/lovable-uploads/7i4j3k9j-ei8g-4h3f-fi9j-0k1l2m3n4o5p.png", // עמוד 26 - זמני
  "/lovable-uploads/8j5k4l0k-fj9h-4i4g-gj0k-1l2m3n4o5p6q.png", // עמוד 27 - זמני
  "/lovable-uploads/9k6l5m1l-gk0i-4j5h-hk1l-2m3n4o5p6q7r.png", // עמוד 28 - זמני
  "/lovable-uploads/0l7m6n2m-hl1j-4k6i-il2m-3n4o5p6q7r8s.png", // עמוד 29 - זמני
  "/lovable-uploads/1m8n7o3n-im2k-4l7j-jm3n-4o5p6q7r8s9t.png", // עמוד 30 - זמני
  "/lovable-uploads/2n9o8p4o-jn3l-4m8k-kn4o-5p6q7r8s9t0u.png", // עמוד 31 - זמני
  "/lovable-uploads/3o0p9q5p-ko4m-4n9l-lo5p-6q7r8s9t0u1v.png", // עמוד 32 - זמני
  "/lovable-uploads/4p1q0r6q-lp5n-4o0m-mp6q-7r8s9t0u1v2w.png", // עמוד 33 - זמני
  "/lovable-uploads/5q2r1s7r-mq6o-4p1n-nq7r-8s9t0u1v2w3x.png", // עמוד 34 - זמני
  "/lovable-uploads/6r3s2t8s-nr7p-4q2o-or8s-9t0u1v2w3x4y.png", // עמוד 35 - זמני
  "/lovable-uploads/7s4t3u9t-os8q-4r3p-ps9t-0u1v2w3x4y5z.png", // עמוד 36 - זמני
  "/lovable-uploads/8t5u4v0u-pt9r-4s4q-qt0u-1v2w3x4y5z6a.png", // עמוד 37 - זמני
  "/lovable-uploads/9u6v5w1v-qu0s-4t5r-ru1v-2w3x4y5z6a7b.png", // עמוד 38 - זמני
  "/lovable-uploads/0v7w6x2w-rv1t-4u6s-sv2w-3x4y5z6a7b8c.png", // עמוד 39 - זמני
  "/lovable-uploads/1w8x7y3x-sw2u-4v7t-tw3x-4y5z6a7b8c9d.png", // עמוד 40 - זמני
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
