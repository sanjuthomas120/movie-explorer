"use client";

import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { ChevronLeft, ChevronRight, Info, LanguagesIcon, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";

interface Item {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string;
  original_language: string;
  overview: string;
  video: boolean;
}

interface HeroCarouselProps {
  url: string
}

export default function HeroCarousel({url}: HeroCarouselProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const imageBaseURL = "https://image.tmdb.org/t/p/original";

  useEffect(() => {
    axiosInstance.get(url).then((response) => {
      setItems(response.data.results.slice(0, 5));
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[350px] sm:h-[500px] relative opacity-40">
        <Skeleton height="100%" className="w-full h-full" />
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-sm z-10"></div>
        <div className="absolute top-2/3 left-[325px] transform -translate-x-1/2 -translate-y-1/2 space-y-2 w-[40%] z-20">
        <Skeleton height={60} width="40%" />
        <Skeleton height={40} width="40%" />
        <Skeleton height={80} width="100%" />
        <div className="flex gap-2">
      <div className="w-[15%]">
        <Skeleton height={40} />
      </div>
      <div className="w-[15%]">
        <Skeleton height={40} />
      </div>
      </div>
      </div>
      </div>
    );
  }

  return (
    <div className="w-full relative group">
      <div className="sm:group-hover:block hidden cursor-pointer swiper-button-prev-custom absolute top-1/2 left-4 transform -translate-y-1/2 z-10 text-secondary text-3xl bg-black/40 p-2 rounded-full hover:bg-primary hover:text-black transition">
        <ChevronLeft />
      </div>
      <div className="sm:group-hover:block hidden cursor-pointer swiper-button-next-custom absolute top-1/2 right-4 transform -translate-y-1/2 z-10 text-secondary text-3xl bg-black/40 p-2 rounded-full hover:bg-primary hover:text-black transition">
        <ChevronRight />
      </div>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={{
          nextEl: ".swiper-button-next-custom",
          prevEl: ".swiper-button-prev-custom",
        }}
        pagination={{ clickable: false }}
        autoplay={{ 
          delay: 5000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true
         }}
        loop
        className=""
      >
        {items.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="relative w-full h-[350px] sm:h-[500px]">
              <Image
                src={`${imageBaseURL}${item.backdrop_path}`}
                alt={item.title || item.name || "image preview"}
                fill
                className={clsx("object-cover w-full h-full",
                  item.name ? "object-top" : null
                )}
                priority
              />
              <div className="absolute cursor-default inset-0 bg-gradient-to-b from-transparent via-black/30 to-black  top-1/2 flex gap-1 flex-col p-4 sm:p-6">
                <h2 className="text-secondary  font-poppins text-lg sm:text-3xl font-bold [text-shadow:var(--shadow-dark)]">
                  {item.title || item.name || "Title not available"}
                </h2>
                <div className="flex gap-x-2 items-center">
                  <span className="text-secondary text-base  sm:text-lg  font-semibold">
                    Language:
                  </span>
                  <LanguagesIcon className="text-secondary font-semibold" />
                  <p className="uppercase text-secondary text-base  sm:text-lg tracking-normal sm:tracking-wider font-bold">
                    {item.original_language}{" "}
                  </p>
                </div>
                <div className="sm:w-[40%]">
                  <p className="text-secondary text-sm sm:text-normal tracking-normal sm:tracking-wide font-semibold line-clamp-2">
                    <span className="pr-1">Description:</span>
                    {item.overview}{" "}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/movie/${item.id}/play`} className="px-1 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 bg-primary text-secondary sm:bg-secondary sm:text-black font-poppins transition hover:bg-primary hover:text-secondary cursor-pointer">
                  <Play size={18} />
                  Play</Link>
                  <Link href='/' className="px-1 sm:px-2 py-0.5 sm:py-1 flex items-center gap-1 bg-primary text-secondary sm:bg-secondary sm:text-black font-poppins transition hover:bg-primary  hover:text-secondary  cursor-pointer">
                  <Info size={18} />
                  Info</Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="absolute w-full h-20 bottom-0  z-10"></div>
    </div>
  );
}
