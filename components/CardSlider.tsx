"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useId, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axiosInstance from "@/lib/axios";

interface CardInfo {
  id: number;
  title?: string;
  name?: string
  backdrop_path: string;
}

interface CardProps {
  url: string;
  title: string;
}

export default function CardSlider({ url, title }: CardProps) {
  const [cardInfo, setCardInfo] = useState<CardInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCardCount, setSkeletonCardCount] = useState(1);
  const imageBaseURL = "https://image.tmdb.org/t/p/w500";
  const sliderId = useId();

  useEffect(() => {
    const updateSkeletonCardCount = () => {
      const width = window.innerWidth;
      if (width >= 1024) setSkeletonCardCount(4);
      else if (width >= 768) setSkeletonCardCount(3);
      else if (width >= 640) setSkeletonCardCount(2);
      else setSkeletonCardCount(1);
    };
    updateSkeletonCardCount();
    window.addEventListener("resize", updateSkeletonCardCount);
    return () => window.removeEventListener("resize", updateSkeletonCardCount);
  }, []);

  useEffect(() => {
    axiosInstance.get(url).then((response) => {
      console.log(`${title}:`, response.data.results)
      setCardInfo(response.data.results);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full px-4 pt-4 pb-2 relative opacity-20">
        <div className="mb-4">
          <Skeleton height={30} width="20%" />
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(skeletonCardCount)].map((_, index) => (
            <div
              key={index}
              className="w-full h-[220px] bg-white/5 rounded-lg overflow-hidden shadow-md relative"
            >
              <Skeleton height={220} />
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full px-4 pt-4 relative">
      <div className="text-secondary py-2 text-xl font-poppins text-nowrap font-bold tracking-wide">
        {title}
      </div>
      <div className={`hidden sm:block cursor-pointer swiper-button-prev-${sliderId} absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-secondary text-3xl bg-black/40 p-1 rounded-full hover:bg-primary hover:text-black transition`}>
        <ChevronLeft />
      </div>
      <div className={`hidden sm:block cursor-pointer swiper-button-next-${sliderId} absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-secondary text-3xl bg-black/40 p-1 rounded-full hover:bg-primary hover:text-black transition`}>
        <ChevronRight />
      </div>
      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{
          nextEl: `.swiper-button-next-${sliderId}`,
          prevEl: `.swiper-button-prev-${sliderId}`,
        }}
        spaceBetween={20}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        loop
        breakpoints={{
          320: { slidesPerView: 1.2 },
          640: { slidesPerView: 2.2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
        }}
      >
        {cardInfo.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="bg-white/5 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-all relative duration-300">
              <div className="relative w-full h-[220px]">
                <Image
                  src={item.backdrop_path? `${imageBaseURL}${item.backdrop_path}`: "/images/default-image.png"}
                  alt={item.title || item.name || "image-preview" }
                  fill
                  className="object-cover"
                />
                <div className=" absolute bottom-0 p-2 w-full bg-gradient-to-b from-transparent to-black">
                  <div className="text-secondary text-nowrap line-clamp-1">
                    {item.title || item.name || "No title available" }
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
