"use client";

import Image from "next/image";
import { useState } from "react";

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Image or gradient fallback */}
      {!imgError ? (
        <Image
          src={category.image}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={() => setImgError(true)}
        />
      ) : (
        <div
          className={`h-full w-full bg-gradient-to-br ${category.gradient ?? "from-amber-100 to-yellow-200"} transition-transform duration-500 group-hover:scale-105`}
        />
      )}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      {/* Category name */}
      <div className="absolute inset-0 flex items-end p-4">
        <p className="text-sm font-medium text-white tracking-wide">
          {category.name}
        </p>
      </div>
    </div>
  );
}
