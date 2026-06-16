"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowRight, Check, Calendar, Trophy } from "lucide-react";

function SuccessContent() {
  const params = useSearchParams();
  const registrationId = params.get("registrationId");

  return (
    <main className="min-h-screen flex flex-col" style={{ background: "#040D18" }}>
      {/* Top strip */}
      <div
        className="w-full py-3 text-center text-[12px] font-semibold tracking-widest uppercase"
        style={{
          background: "rgba(14,165,233,0.12)",
          color: "#7DD3FC",
          borderBottom: "1px solid rgba(14,165,233,0.18)",
        }}
      >
        WaveClubs Open · Season 2026 / 2027
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">

          {/* Check circle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{
              background: "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)",
              boxShadow: "0 0 40px rgba(14,165,233,0.35)",
            }}
          >
            <Check size={28} strokeWidth={2.5} className="text-white" />
          </div>

          <p className="text-[11px] font-bold uppercase tracking-widest mb-3" style={{ color: "#38BDF8" }}>
            Registration confirmed
          </p>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-white leading-[1.1] mb-4">
            You&apos;re in the{" "}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(90deg, #38BDF8, #0EA5E9)" }}
            >
              WaveClubs Open.
            </span>
          </h1>
          <p className="text-[15px] leading-[1.75] mb-10" style={{ color: "rgba(255,255,255,0.50)" }}>
            Payment received. Your spot is confirmed for the 2026/2027 season.
            Check your email for a confirmation receipt.
          </p>

          {/* Info tiles */}
          <div className="grid grid-cols-2 gap-3 mb-10 text-left">
            {[
              {
                icon: Calendar,
                title: "First stop",
                body: "Taghazout · February 2027",
              },
              {
                icon: Trophy,
                title: "Grand Final",
                body: "Agadir · May 2027",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="rounded-xl p-4"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Icon size={16} strokeWidth={1.5} style={{ color: "#38BDF8" }} className="mb-2" />
                <p className="text-[12px] font-bold text-white mb-0.5">{title}</p>
                <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.40)" }}>{body}</p>
              </div>
            ))}
          </div>

          {registrationId && (
            <p className="text-[12px] mb-6" style={{ color: "rgba(255,255,255,0.25)" }}>
              Registration ID: <span style={{ color: "rgba(255,255,255,0.45)" }}>{registrationId}</span>
            </p>
          )}

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="btn-primary inline-flex items-center justify-center gap-2 font-semibold text-sm text-white px-6 py-3.5 rounded-xl cursor-pointer"
            >
              Back to the Open page
              <ArrowRight size={14} />
            </Link>
            <Link
              href="mailto:contact@waveclubs.com?subject=WaveClubs Open — Question"
              className="inline-flex items-center justify-center gap-2 font-medium text-sm px-6 py-3 rounded-xl cursor-pointer transition-colors duration-150"
              style={{ color: "rgba(255,255,255,0.45)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Contact us with questions
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center" style={{ background: "#040D18" }}>
          <p className="text-white/40">Loading…</p>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
