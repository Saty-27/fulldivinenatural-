import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Banner {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  imageUrlTablet: string | null;
  imageUrlMobile: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  badgeText: string | null;
  displayOrder: number;
  isActive: boolean;
}

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [, setLocation] = useLocation();

  const { data: banners = [], isLoading, error } = useQuery<Banner[]>({
    queryKey: ["/api/banners/public"],
    queryFn: async () => {
      const res = await fetch("/api/banners/public");
      if (!res.ok) throw new Error("Failed to fetch banners");
      return res.json();
    },
  });

  const nextSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }
  }, [banners.length]);

  const prevSlide = useCallback(() => {
    if (banners.length > 0) {
      setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
    }
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [banners.length, nextSlide]);

  if (isLoading) {
    return (
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-green-50 to-green-100 animate-pulse flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
      </section>
    );
  }

  if (error || banners.length === 0) {
    return (
      <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] bg-gradient-to-br from-green-800 via-green-700 to-green-600 flex items-center justify-center">
        <div className="text-center text-white px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight">
            Divine Naturals
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl opacity-90 font-light">Pure. Fresh. Daily.</p>
          <Button
            onClick={() => setLocation("/shop")}
            className="mt-8 bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-base font-semibold rounded-full"
          >
            Shop Now
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] overflow-hidden bg-gray-900">
      {banners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10" />
          
          <picture className="absolute inset-0">
            {banner.imageUrlMobile && (
              <source media="(max-width: 639px)" srcSet={banner.imageUrlMobile} />
            )}
            {banner.imageUrlTablet && (
              <source media="(min-width: 640px) and (max-width: 1023px)" srcSet={banner.imageUrlTablet} />
            )}
            <img
              src={banner.imageUrl}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </picture>

          <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
            <div className="max-w-xl lg:max-w-2xl">
              {banner.badgeText && (
                <span className="inline-block px-4 py-1.5 bg-green-500 text-white text-xs sm:text-sm font-semibold rounded-full mb-4 sm:mb-6">
                  {banner.badgeText}
                </span>
              )}
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight mb-3 sm:mb-4 md:mb-6 tracking-tight">
                {banner.title}
              </h1>
              
              {banner.subtitle && (
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 leading-relaxed font-light max-w-lg line-clamp-3">
                  {banner.subtitle}
                </p>
              )}

              {banner.ctaText && (
                <Button
                  onClick={() => banner.ctaLink && setLocation(banner.ctaLink)}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all"
                >
                  {banner.ctaText}
                </Button>
              )}
            </div>
          </div>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center text-white transition-all"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2 sm:gap-3">
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-white w-8" : "bg-white/40 w-2 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
