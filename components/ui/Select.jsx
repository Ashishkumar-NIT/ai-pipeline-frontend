"use client";

import { useState, useRef, useEffect } from "react";

export function Select({ id, label, options = [], value, onChange, placeholder = "Select...", ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    if (onChange) {
      onChange({ target: { id, name: id, value: selectedValue } });
    }
    setIsOpen(false);
  };
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="flex flex-col gap-3 w-full group relative" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className={`text-[10px] uppercase tracking-[0.2em] transition-colors ${isOpen ? 'text-celestique-dark' : 'text-celestique-dark/60 group-focus-within:text-celestique-dark'
            }`}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={id}
          className="hidden"
          value={value}
          onChange={onChange}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`appearance-none w-full h-12 border-b transition-colors duration-300 flex items-center justify-between px-0 py-2 text-sm text-left outline-none ${isOpen
              ? "border-celestique-dark text-celestique-dark"
              : "border-celestique-taupe text-celestique-dark/70 hover:border-celestique-dark/50 focus:border-celestique-dark"
            }`}
        >
          <span className={!selectedOption ? "text-celestique-dark/30 uppercase tracking-wider text-[11px]" : "text-celestique-dark tracking-wide"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <div className={`transition-transform duration-500 flex items-center justify-center ${isOpen ? "-scale-y-100" : ""}`}>
            <svg
              className="h-4 w-4 text-celestique-dark/60 group-hover:text-celestique-dark transition-colors"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </button>

        {/* Dropdown Menu */}
        <div
          className={`absolute z-[100] top-full left-0 w-full mt-2 bg-celestique-cream border border-celestique-taupe shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 origin-top
          ${isOpen ? 'opacity-100 scale-y-100 pointer-events-auto translate-y-0' : 'opacity-0 scale-y-95 pointer-events-none -translate-y-2'}`}
        >
          <div className="max-h-64 overflow-y-auto py-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-celestique-taupe/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-celestique-taupe/60">
            <button
              type="button"
              className={`w-full text-left px-5 py-3 text-[13px] tracking-wide transition-colors duration-200 flex items-center justify-between ${!value ? 'bg-celestique-taupe/10 text-celestique-dark font-medium' : 'text-celestique-dark/50 hover:bg-celestique-taupe/10'
                }`}
              onClick={() => handleSelect('')}
            >
              <span className="uppercase tracking-[0.1em] text-[10px]">{placeholder}</span>
              {!value && (
                <div className="w-1.5 h-1.5 rounded-full bg-celestique-dark"></div>
              )}
            </button>
            {options.map((opt) => (
              <button
                type="button"
                key={opt.value}
                className={`w-full text-left px-5 py-3 text-[13px] tracking-wide transition-all duration-200 flex items-center justify-between group/opt ${value === opt.value
                    ? 'bg-celestique-taupe/10 text-celestique-dark font-medium pl-6'
                    : 'text-celestique-dark/80 hover:bg-celestique-taupe/5 hover:pl-6 hover:text-celestique-dark'
                  }`}
                onClick={() => handleSelect(opt.value)}
              >
                <span>{opt.label}</span>
                {value === opt.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-celestique-dark animate-fade-in"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
