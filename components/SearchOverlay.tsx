"use client";

import axiosInstance from "@/lib/axios";
import clsx from "clsx";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface SearchOverlayProps {
  onClose: () => void;
}

export default function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPage] = useState(1);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const imageBaseURL = "https://image.tmdb.org/t/p/w500";

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setTotalPage(1);
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;

    const delayDebounce = setTimeout(() => {
      setLoading(true);

      axiosInstance
        .get(`/search/multi?query=${searchQuery}&page=${page}`, { signal })
        .then((res) => {
          setSearchResults(res.data.results);
          setTotalPage(Math.min(res.data.total_pages, 10));
        })
        .catch((err) => {
          if (err.name !== "CanceledError") {
            console.error("Search error:", err);
          }
        })
        .finally(() => setLoading(false));
    }, 500);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchQuery, page]);

  const handlePrevPage = () => {
    setPage((p) => p - 1);
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleNextPage = () => {
    setPage((p) => p + 1);
    titleRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/95 z-50 flex flex-col items-center px-4 py-24 overflow-y-auto">
      <button
        onClick={() => {
          onClose();
          setSearchQuery("");
          setSearchResults([]);
          setPage(1);
          setTotalPage(1);
        }}
        className="absolute top-4 right-4 text-secondary text-2xl cursor-pointer"
      >
        <X />
      </button>

      <div
        ref={titleRef}
        className="text-secondary pt-4 text-2xl sm:text-3xl mb-6 font-bold"
      >
        Search Movies or TV Shows
      </div>
      <input
        type="text"
        ref={inputRef}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setPage(1);
        }}
        placeholder="Type to search..."
        className="w-full sm:w-[500px] px-4 py-2 mb-6 rounded bg-black border border-secondary text-white text-lg outline-none"
      />
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-10 w-full max-w-screen-lg">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white/5 h-[300px] opacity-40">
              <Skeleton height="100%" width="100%" />
            </div>
          ))}
        </div>
      ) : searchQuery.trim() === "" ? (
        <div className="text-secondary mt-4">
          Enter the name of movie or tv show
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-secondary mt-4">No results found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-10 w-full max-w-screen-lg">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="bg-white/5 rounded-lg overflow-hidden shadow-md hover:scale-105 transition-all relative duration-300"
            >
              <div className="relative w-full h-[300px]">
                <Image
                  src={
                    result.poster_path
                      ? `${imageBaseURL}${result.poster_path}`
                      : "/images/default-image.png"
                  }
                  alt={result.title || result.name || "image-preview"}
                  fill
                  className="object-cover"
                  loading="lazy"
                />
                <div className=" absolute bottom-0 p-2 w-full bg-gradient-to-b from-transparent to-black">
                  <div className="text-secondary text-nowrap line-clamp-1">
                    {result.media_type === "movie" ? result.title : result.name}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {searchQuery.trim() !== "" && totalPages > 1 && (
        <div className="mt-6 flex gap-4 items-center text-white">
          <button
            onClick={handlePrevPage}
            className={clsx(
              "px-3 py-1 bg-secondary text-black rounded cursor-pointer",
              page === 1 ? "hidden" : "block"
            )}
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            className={clsx(
              "px-3 py-1 bg-secondary text-black rounded cursor-pointer",
              page === totalPages ? "hidden" : "block"
            )}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
