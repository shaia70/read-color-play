
import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from "lucide-react";
import { CustomButton } from "../ui/CustomButton";
import { useLanguage } from "@/contexts/LanguageContext";

// מערך של תמונות לפליפבוק - מסודר לפי סדר העמודים
const BOOK_PAGES = [
  "/lovable-uploads/34b851eb-6d13-4717-91ed-f0b9f4a18eec.png", // עמוד 0
  "/lovable-uploads/35576e32-5817-4091-92e8-3908617f39f0.png", // עמוד 1
  "/lovable-uploads/9562ec0f-ee33-4f78-b938-aedd7eddf809.png", // עמוד 2
  "/lovable-uploads/cf38aa34-239c-4e5d-874d-b91f6765b1f2.png", // עמוד 3
  "/lovable-uploads/13722ff2-d878-408f-a116-cf592f61a3ae.png", // עמוד 4
  "/lovable-uploads/369b8fc8-af64-4c3a-afc4-7aea2ef5e0e3.png", // עמוד 5
  "/lovable-uploads/f805bd1e-dad8-4e76-aab6-e159b0b3abf9.png", // עמוד 6
  "/lovable-uploads/771dc88e-351b-40e2-bfab-272b65da2dc8.png", // עמוד 7
  "/lovable-uploads/a4f84f3e-63ac-4ec8-83ae-7fc3f91d3074.png", // עמוד 8
  "/lovable-uploads/1a95b5e0-5485-41b7-bc2d-163d81e97f74.png", // עמוד 9
  "/lovable-uploads/01870138-59d5-4abe-9f42-6cbaceae8a28.png", // עמוד 10
  "/lovable-uploads/49a81cbf-eeb6-4e11-92d4-4f7ca895e3f0.png", // עמוד 11
  "/lovable-uploads/38c779cd-8f03-45aa-8878-84557064ac72.png", // עמוד 12
  "/lovable-uploads/292c2acf-07ee-491e-8c74-7c447193a99d.png", // עמוד 13
  "/lovable-uploads/5a4c0388-6e74-4afd-afcb-f8504b3508ec.png", // עמוד 14
  "/lovable-uploads/cea0bda3-a05e-45dd-8a80-6d86d4e2b6f1.png", // עמוד 15
  "/lovable-uploads/c68c0bbd-5de9-456f-b831-d3578e6144b8.png", // עמוד 16
  "/lovable-uploads/67e81755-1f5e-40d3-83bb-ad7ab96ff373.png", // עמוד 17
  "/lovable-uploads/03abbff5-06e8-46d5-b220-cad6e259ca52.png", // עמוד 18
  "/lovable-uploads/6d4c0a39-0831-4639-85f0-42b7d4832b3d.png", // עמוד 19
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
