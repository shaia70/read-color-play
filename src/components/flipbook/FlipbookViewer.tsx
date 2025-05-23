
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
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
  "/lovable-uploads/a61e9e23-25cc-4baa-839c-0309f03b3005.png", // עמוד 20
  "/lovable-uploads/59335ecd-65c0-4a29-9ef0-2e2fd1e6c395.png", // עמוד 21
  "/lovable-uploads/542f3054-cc78-470d-bb62-0bf6fcb4ab14.png", // עמוד 22
  "/lovable-uploads/21efd8ff-cb6f-4d6a-958c-894ef6dfb937.png", // עמוד 23
  "/lovable-uploads/e9c19c63-97db-4749-b35b-43f65856d60b.png", // עמוד 24
  "/lovable-uploads/762db1b9-3d0f-4529-b23a-2039126cb1b9.png", // עמוד 25
  "/lovable-uploads/77f69899-7ba3-4b3f-80d6-58302d62c1c5.png", // עמוד 26
  "/lovable-uploads/29f90605-e230-4b8d-beff-addce4c02454.png", // עמוד 27
  "/lovable-uploads/e3c4bb18-82d8-4ea6-8959-2e3ea5fa4ce6.png", // עמוד 28
  "/lovable-uploads/5ae34d55-2ba5-4339-a071-73250a9774b9.png", // עמוד 29
  "/lovable-uploads/866a6645-a102-48e0-aaee-8fb2ddde04da.png", // עמוד 30
  "/lovable-uploads/44a963fb-7541-454e-aca5-f9aeb4020eaa.png", // עמוד 31
  "/lovable-uploads/c3ef4fdc-e152-44c2-b262-f3c0469d39a6.png", // עמוד 32
  "/lovable-uploads/4dc1315a-9678-472e-be48-5d0c1168713e.png", // עמוד 33
  "/lovable-uploads/e7e2ce0e-2d59-4f03-9283-cc5c51459b57.png", // עמוד 34
  "/lovable-uploads/8b20e77a-cfa9-41e0-b431-330db7caa929.png", // עמוד 35
  "/lovable-uploads/ed811d33-55df-40c6-b05f-c9d04f9aafba.png", // עמוד 36
  "/lovable-uploads/be086f7a-22cd-40b2-9c38-fcfe17cfb323.png", // עמוד 37
  "/lovable-uploads/c5acd3e6-bd35-4e96-b689-d3c027df82df.png", // עמוד 38
  "/lovable-uploads/f7bd361e-d36d-42d5-b20b-839ea4d69b7e.png", // עמוד 39
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
