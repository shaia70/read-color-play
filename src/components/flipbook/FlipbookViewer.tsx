import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/f7bd361e-d36d-42d5-b20b-839ea4d69b7e.png", // עמוד 0
  "/lovable-uploads/381073d2-cc28-4cc9-baa4-3ceccd91fef8.png", // עמוד 1
  "/lovable-uploads/38c779cd-8f03-45aa-8878-84557064ac72.png", // עמוד 2
  "/lovable-uploads/369b8fc8-af64-4c3a-afc4-7aea2ef5e0e3.png", // עמוד 3
  "/lovable-uploads/35dd9296-8f66-41f2-9e78-422f55eb3805.png", // עמוד 4
  "/lovable-uploads/35576e32-5817-4091-92e8-3908617f39f0.png", // עמוד 5
  "/lovable-uploads/34b851eb-6d13-4717-91ed-f0b9f4a18eec.png", // עמוד 6
  "/lovable-uploads/3516d542-5438-48f3-8cdc-87c9a5922c74.png", // עמוד 7
  "/lovable-uploads/2f584bb6-86b1-4f25-9e98-3196dded5656.png", // עמוד 8
  "/lovable-uploads/29f90605-e230-4b8d-beff-addce4c02454.png", // עמוד 9
  "/lovable-uploads/292c2acf-07ee-491e-8c74-7c447193a99d.png", // עמוד 10
  "/lovable-uploads/2579f535-3bd5-4fa1-a627-5b9fbde0e5d5.png", // עמוד 11
  "/lovable-uploads/2553053f-b870-4421-b048-425802385e41.png", // עמוד 12
  "/lovable-uploads/24347697-6068-40c5-8205-ddd5e5004994.png", // עמוד 13
  "/lovable-uploads/22f2f13e-8bc1-4b90-9ae3-036e3ae93e45.png", // עמוד 14
  "/lovable-uploads/21efd8ff-cb6f-4d6a-958c-894ef6dfb937.png", // עמוד 15
  "/lovable-uploads/1d526f58-067f-4d1d-9377-05238e74fa61.png", // עמוד 16
  "/lovable-uploads/1a95b5e0-5485-41b7-bc2d-163d81e97f74.png", // עמוד 17
  "/lovable-uploads/152a3edb-4beb-4bca-80f8-bee8dc682ed8.png", // עמוד 18
  "/lovable-uploads/13b3ca42-04f6-4e27-832d-b84911cc54e8.png", // עמוד 19
  "/lovable-uploads/f9826867-282e-4752-b00f-a31ba48f1ce7.png", // עמוד 20
  "/lovable-uploads/f84796f9-3a87-4695-9be5-04e8f11d514e.png", // עמוד 21
  "/lovable-uploads/f82fb4a3-48cd-465f-b4c0-8a1b1818ef6f.png", // עמוד 22
  "/lovable-uploads/f805bd1e-dad8-4e76-aab6-e159b0b3abf9.png", // עמוד 23
  "/lovable-uploads/f6de210b-d110-41be-8730-28d4ba327574.png", // עמוד 24
  "/lovable-uploads/f0fb83e9-793e-4792-b4cd-9e4454b9c46f.png", // עמוד 25
  "/lovable-uploads/ed811d33-55df-40c6-b05f-c9d04f9aafba.png", // עמוד 26
  "/lovable-uploads/ec0bbda3-ee92-4a63-80fc-b482ca5dbb91.png", // עמוד 27
  "/lovable-uploads/e9c19c63-97db-4749-b35b-43f65856d60b.png", // עמוד 28
  "/lovable-uploads/e89c9bd7-393a-451a-b958-7240e55c752f.png", // עמוד 29
  "/lovable-uploads/e7e2ce0e-2d59-4f03-9283-cc5c51459b57.png", // עמוד 30
  "/lovable-uploads/e74d741a-81bc-46bf-b692-6599810f951a.png", // עמוד 31
  "/lovable-uploads/e3c4bb18-82d8-4ea6-8959-2e3ea5fa4ce6.png", // עמוד 32
  "/lovable-uploads/e2df8798-6f1c-4783-8fd9-58c4d2246179.png", // עמוד 33
  "/lovable-uploads/e2937d84-0ea2-43c7-b3be-d65528e9a40e.png", // עמוד 34
  "/lovable-uploads/e075b942-7655-4a7b-96ce-ee53c82bc2f2.png", // עמוד 35
  "/lovable-uploads/dea41a4b-b011-4b01-b833-c9483c4e4a88.png", // עמוד 36
  "/lovable-uploads/ddb5d4db-a0eb-4b37-b070-1c5ea9d981ef.png", // עמוד 37
  "/lovable-uploads/dc5e6324-bae3-47f9-bf59-6757f4e7b6a2.png", // עמוד 38
  "/lovable-uploads/db4b97d6-5279-4828-99e5-3a42e6e972f3.png", // עמוד 39
  "/lovable-uploads/bdd3d13e-0d6a-49ab-9213-beeeaddeb00c.png", // עמוד 40
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
