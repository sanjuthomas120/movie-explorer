"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, X } from "lucide-react";
import clsx from "clsx";
import axiosInstance from "@/lib/axios";
import SearchOverlay from "./SearchOverlay";

const navbarLinks = [
  { href: "/", label: "Home" },
  { href: "/tv-shows", label: "TV Shows" },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); 
  const [searchActive, setSearchActive] = useState(false);


  return (
    <div>
      <nav className="w-full bg-black text-secondary px-6 sm:px-12 py-4 shadow-md">
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="text-base sm:text-2xl font-oswald text-nowrap font-extrabold text-primary "
        >
          Movie Explorer
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden sm:flex items-center  gap-6">
          {navbarLinks.map((link) => (
              <Link
              key={link.href}
              href={link.href}
              className={clsx("hover:text-primary font-semibold transition font-oswald tracking-wider",
                pathname === link.href ? "text-primary" : null
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <button 
        onClick={() => setSearchActive(true)}
        className="text-secondary cursor-pointer hover:text-secondary"
        >
          <Search size={22} />
        </button>
        <button className="sm:hidden text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
            {isOpen ?   <X  size={24}/> : <Menu size={24} /> }
        </button>
        </div>
        </div>
        {isOpen && (
        <div className="sm:hidden mt-4 flex flex-col gap-4">
          {navbarLinks.map((link) => (
            <Link
            key={link.href}
            href={link.href}
            className={clsx("hover:text-primary text-sm font-lighter transition font-oswald",
              pathname === link.href ? "text-primary" : null
            )}
          >
            {link.label}
          </Link>
          ))}
        </div>
      )}
      </nav>
      {searchActive && <SearchOverlay onClose={() => setSearchActive(false)} /> }
    </div>
  );
}
