"use client";

import Image from "next/image";
import { useState } from "react";

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative w-[280px] h-[339px] cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image or gradient fallback */}
      {!imgError ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="280px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${category.gradient ?? "from-amber-100 to-yellow-200"} transition-transform duration-500 group-hover:scale-105`}
        />
      )}

      {/* Category name */}
      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-white/15 to-transparent backdrop-blur-[2x] p-4">
        <p className="font-gilroy font-medium text-xl text-white tracking-wide text-center w-full">
          {category.name}
        </p>
      </div>
    </div>
  );
}
