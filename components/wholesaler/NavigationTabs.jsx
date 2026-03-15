"use client";

import { useState } from "react";

const tabs = ["Home", "Upload", "My Catalogue"];

export default function NavigationTabs() {
  const [active, setActive] = useState("Home");

  return (
    <div className="sticky top-0 z-20 border-b border-celestique-border bg-white/85 backdrop-blur-sm px-6">
      <div className="mx-auto max-w-7xl flex items-center gap-1 overflow-x-auto py-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActive(tab)}
            className={`shrink-0 rounded-lg px-5 py-2 text-sm font-medium transition-all duration-200 ${
              active === tab
                ? "bg-celestique-dark text-white shadow-sm"
                : "text-celestique-muted hover:bg-celestique-cream hover:text-celestique-dark"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
