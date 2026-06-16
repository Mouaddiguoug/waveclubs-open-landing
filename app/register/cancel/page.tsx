"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowLeft, XCircle } from "lucide-react";

function CancelContent() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#040D18" }}>
      {/* Top strip */}
      <div
        className="w-full py-3 text-center text-[12px] font-semibold tracking-widest uppercase"
        style={{
          background: "rgba(255,255,255,0.03)",
          color: "rgba(255,255,255,0.35)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        WaveClubs Open · Season 2026 / 2027
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">

          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              background: "rgba(255,255,255,0.05)",
              border: "1.5px solid rgba(255,255,255,0.10)",
            }}
          >
            <XCircle size={28} strokeWidth={1.5} style={{ color: "rgba(255,255,255,0.40)" }} />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
            Payment cancelled
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-[1.1] mb-4">
            No charge was made.
          </h1>
          <p className="text-[15px] leading-[1.75] mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
            You cancelled before completing payment. Your spot hasn&apos;t been reserved yet —
            but you can pick up right where you left off.
          </p>

          {/* Reassurance box */}
          <div
            className="rounded-2xl px-6 py-5 mb-10 text-left"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <p className="text-[13px] font-semibold text-white mb-3">What happened?</p>
            <ul className="flex flex-col gap-2.5">
              {[
                "Your card was not charged",
                "No registration was created",
                "Spots are still available for this season",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13px]" style={{ color: "rgba(255,255,255,0.50)" }}>
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "rgba(255,255,255,0.25)" }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/register"
              className="btn-primary inline-flex items-center justify-center gap-2 font-bold text-[15px] text-white px-6 py-3.5 rounded-xl cursor-pointer"
            >
              Try again
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 font-medium text-[14px] px-6 py-3 rounded-xl cursor-pointer transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.40)", border: "1px solid rgba(255,255,255,0.08)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.70)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.40)")}
            >
              <ArrowLeft size={14} />
              Back to WaveClubs Open
            </Link>
          </div>

          <div className="mt-12 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <Image
              src="/images/logo.png"
              alt="WaveClubs"
              width={90}
              height={22}
              className="h-5 w-auto mx-auto opacity-30"
            />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function CancelPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#040D18" }}>
          <p style={{ color: "rgba(255,255,255,0.30)" }}>Loading…</p>
        </main>
      }
    >
      <CancelContent />
    </Suspense>
  );
}
