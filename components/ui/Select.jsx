"use client";

import { useState, useRef, useEffect } from "react";

export function Select({ id, label, options = [], value, onChange, placeholder = "select", ...props }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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
    <div className="flex flex-col gap-2 w-full" ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-[#374151]"
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
          className={`w-full h-11 border border-[#e5e5e5] rounded-lg px-3 flex items-center justify-between text-sm transition-colors ${
            isOpen
              ? "border-[#3B82F6] ring-1 ring-[#3B82F6]"
              : "hover:border-[#d1d5db]"
          }`}
        >
          <span className={selectedOption ? "text-[#111827]" : "text-[#9CA3AF]"}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <svg
            className={`h-4 w-4 text-[#6B7280] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
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
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 top-full left-0 w-full mt-1 bg-white border border-[#e5e5e5] rounded-lg shadow-lg overflow-hidden">
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((opt) => (
                <button
                  type="button"
                  key={opt.value}
                  className={`w-full text-left px-3 py-2.5 text-sm transition-colors ${
                    value === opt.value
                      ? "bg-[#F3F4F6] text-[#111827] font-medium"
                      : "text-[#374151] hover:bg-[#F9FAFB]"
                  }`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
