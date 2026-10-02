"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type CategoryBanner = { src: string; alt: string; href?:string };

export default function CategoryBannerCarousel({
  banners,
  label,
}: {
  banners: CategoryBanner[];
  label: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const currentIndex = banners.length ? activeIndex % banners.length : 0;
  const hasMultiple = banners.length > 1;
  const show = (index: number) => setActiveIndex((index + banners.length) % banners.length);

  if (banners.length === 0) return null;

  return (
    <div
      className="relative mb-6 overflow-hidden rounded-[0_15px] shadow-xl"
      role="region"
      aria-roledescription="carrusel"
      aria-label={label}
      onTouchStart={(event) => { touchStartX.current = event.touches[0].clientX; }}
      onTouchEnd={(event) => {
        if (!hasMultiple || touchStartX.current === null) return;
        const distance = touchStartX.current - event.changedTouches[0].clientX;
        if (Math.abs(distance) > 50) show(currentIndex + (distance > 0 ? 1 : -1));
        touchStartX.current = null;
      }}
    >
      <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
        {banners.map((banner, index) => (
          <div key={`${banner.src}-${index}`} className="w-full shrink-0" aria-hidden={index !== currentIndex}>
            <a href={banner.href || undefined}><img src={banner.src} alt={banner.alt} className="aspect-[3/1] w-full object-cover" loading={index === 0 ? "eager" : "lazy"} /></a>
          </div>
        ))}
      </div>
      {hasMultiple && (
        <>
          <button type="button" onClick={() => show(currentIndex - 1)} aria-label="Banner anterior" className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#FAF7F2]/90 text-[#4A0D10] shadow-md transition hover:bg-white"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => show(currentIndex + 1)} aria-label="Banner siguiente" className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-[#FAF7F2]/90 text-[#4A0D10] shadow-md transition hover:bg-white"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((banner, index) => (
              <button key={`${banner.src}-${index}`} type="button" onClick={() => show(index)} aria-label={`Ver banner ${index + 1}`} aria-current={index === currentIndex} className={`h-2 rounded-full shadow-sm transition-all ${index === currentIndex ? "w-6 bg-[#FAF7F2]" : "w-2 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2]"}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
