"use client";

import { useRef, useState } from "react";
import Image from "next/image";

export function ImageUpload({ onFileChange }) {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  function handleFile(file) {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onFileChange(file);
  }

  function handleInputChange(e) {
    handleFile(e.target.files[0]);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  }

  function handleRemove(e) {
    e.stopPropagation();
    setPreview(null);
    onFileChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="w-full h-full relative group">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative flex min-h-[450px] w-full flex-col items-center justify-center bg-celestique-taupe/5 transition-all duration-300 ease-out border-2 border-dashed ${
          dragOver 
            ? "border-celestique-dark bg-celestique-taupe/20 scale-[1.01]" 
            : "border-celestique-dark/20 hover:border-celestique-dark/40 hover:bg-celestique-taupe/10"
        }`}
      >
        {preview ? (
          <div className="relative w-full h-full min-h-[450px] flex flex-col items-center justify-center p-8">
            <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden mb-16">
              <img
                src={preview}
                alt="Preview"
                className="max-h-[350px] w-auto object-contain transition-transform duration-700 hover:scale-105 mix-blend-multiply"
              />
            </div>
            
            {/* Explicit Action Bar for naive users */}
            <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-4 z-20">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                className="px-6 py-3 bg-celestique-dark text-celestique-cream text-[10px] uppercase tracking-widest font-bold hover:bg-celestique-dark/80 transition-colors shadow-md flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Change Image
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-6 py-3 bg-white border border-red-200 text-red-600 text-[10px] uppercase tracking-widest font-bold hover:bg-red-50 transition-colors shadow-md flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 px-8 text-center max-w-sm mx-auto py-12">
            <div className={`h-24 w-24 rounded-full border-2 border-dashed flex items-center justify-center transition-all duration-500 ${dragOver ? 'border-celestique-dark bg-celestique-dark text-celestique-cream' : 'border-celestique-dark/30 text-celestique-dark/50 group-hover:border-celestique-dark group-hover:text-celestique-dark'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="space-y-3">
              <p className="font-serif text-3xl text-celestique-dark">
                Upload Photo
              </p>
              <p className="text-celestique-dark/60 text-[11px] uppercase tracking-widest leading-relaxed">
                Drag and drop your image here
              </p>
            </div>
            
            <div className="flex items-center gap-4 w-full my-2">
              <div className="h-px bg-celestique-dark/10 flex-1"></div>
              <span className="text-[9px] uppercase tracking-widest text-celestique-dark/40 font-bold">OR</span>
              <div className="h-px bg-celestique-dark/10 flex-1"></div>
            </div>

            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              className="px-8 py-4 bg-celestique-dark text-celestique-cream text-[11px] uppercase tracking-widest font-bold hover:bg-celestique-dark/90 transition-colors w-full shadow-sm flex items-center justify-center gap-3"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4m14-7l-5-5m0 0L7 8m5-5v18" />
              </svg>
              Browse Files
            </button>

            <div className="flex items-center justify-center gap-3 pt-4 opacity-60">
               <span className="text-[9px] tracking-widest text-celestique-dark uppercase font-bold">JPG</span>
               <span className="w-1 h-1 rounded-full bg-celestique-dark/30"></span>
               <span className="text-[9px] tracking-widest text-celestique-dark uppercase font-bold">PNG</span>
               <span className="w-1 h-1 rounded-full bg-celestique-dark/30"></span>
               <span className="text-[9px] tracking-widest text-celestique-dark uppercase font-bold">WEBP</span>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
