"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#schedule", label: "Schedule" },
  { href: "/#registration", label: "Register" },
  { href: "/#faq", label: "FAQ" },
];

export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4">
      <div className="w-full max-w-5xl">
        <nav
          className="flex items-center justify-between h-14 px-5 rounded-2xl backdrop-blur-xl transition-all duration-300"
          style={{
            background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.07)",
            border: scrolled ? "1px solid rgba(0,0,0,0.08)" : "1px solid rgba(255,255,255,0.12)",
            boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
          }}
        >
          <Link href="/" className="flex items-center shrink-0 cursor-pointer">
            <Image
              src={scrolled ? "/images/logo-light.png" : "/images/logo.png"}
              alt="WaveClubs"
              width={130}
              height={32}
              className="h-7 w-auto object-contain transition-all duration-300"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-2 rounded-xl text-[13px] font-medium transition-colors duration-150 cursor-pointer"
                style={{ color: scrolled ? "#334155" : "rgba(255,255,255,0.75)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 text-[13px] font-bold text-white px-4 py-2.5 rounded-xl cursor-pointer transition-all duration-200"
              style={{ background: "#0EA5E9" }}
            >
              Register now
              <ArrowRight size={13} />
            </Link>
          </div>

          <button
            className="md:hidden cursor-pointer transition-colors duration-150"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{ color: scrolled ? "#0F172A" : "white" }}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>

        {mobileOpen && (
          <div
            className="mt-2 rounded-2xl px-5 py-4 flex flex-col gap-2"
            style={{ background: "rgba(4,13,24,0.96)", border: "1px solid rgba(255,255,255,0.10)", backdropFilter: "blur(16px)" }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-[15px] font-medium py-2 cursor-pointer transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-1.5 text-[14px] font-bold text-white px-4 py-3 rounded-xl cursor-pointer"
              style={{ background: "#0EA5E9" }}
            >
              Register now
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
