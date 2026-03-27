"use client";
import { useRef, useState, useEffect } from "react";

export function ImageUploadBox({ label, image, onUpload, onRemove, error, objectFit = "cover" }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(image);
    }
  }, [image]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  const hasImage = !!preview;
  const borderClass = hasImage 
    ? "border-[2px] border-solid border-[#22C55E]" 
    : error 
      ? "border-[1.5px] border-dashed border-[#EF4444]"
      : "border-[1.5px] border-dashed border-[#2563EB]";

  const imageClassName = objectFit === "contain" 
    ? "w-full h-full object-contain p-4" 
    : "w-full h-full object-cover";

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <span className="text-[13px] font-semibold text-[#374151]">{label}</span>}
      
      <div 
        onClick={() => { if (!hasImage && inputRef.current) inputRef.current.click() }}
        className={`w-full bg-[#EEF4FF] rounded-[12px] hover:bg-blue-50 transition-colors cursor-pointer aspect-[1.4/1] relative overflow-hidden flex items-center justify-center ${borderClass}`}
      >
        {hasImage ? (
          <>
            <img src={preview} alt={label} className={imageClassName} />
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onRemove) onRemove();
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-500 shadow-sm hover:text-black transition-colors z-10"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[14px] h-[14px]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </>
        ) : (
          <div className={`w-12 h-12 rounded-full border-2 ${error ? 'border-[#EF4444] text-[#EF4444]' : 'border-[#2563EB] text-[#2563EB]'} flex items-center justify-center`}>
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[26px] h-[26px]"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          </div>
        )}
        
        <input 
          type="file" 
          ref={inputRef}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      
      {error && <span className="text-[12px] text-[#EF4444] mt-1">{error}</span>}
    </div>
  );
}
