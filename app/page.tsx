"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight, Plus, Minus, Trophy, MapPin,
  Calendar, Users, Star, ChevronRight,
} from "lucide-react";
import SiteNav from "@/components/SiteNav";

/* ─── Data ─────────────────────────────────────────────── */

const categories = [
  {
    id: "open",
    label: "Open",
    sub: "All surfers · Any age",
    body: "The main competitive bracket. Open to all surfers regardless of gender or age. Heats judged on two best waves.",
    fee: "€35",
    accent: "#0EA5E9",
  },
  {
    id: "womens",
    label: "Women's",
    sub: "Dedicated division",
    body: "A stand-alone category celebrating women's surfing on the Moroccan coastline. Full prize purse, full season.",
    fee: "€35",
    accent: "#06B6D4",
  },
  {
    id: "junior",
    label: "Junior",
    sub: "Born 2007 or later",
    body: "For the next generation. Juniors may also enter the Open category.",
    fee: "€25",
    accent: "#38BDF8",
  },
  {
    id: "business-cup",
    label: "Business Cup",
    sub: "Teams of up to 5",
    body: "Surf schools, camps, and clubs enter a roster. Combined points across the season decide the champion.",
    fee: "€150 / camp",
    accent: "#0284C7",
  },
];

const stops = [
  { n: "01", name: "Taghazout", region: "Souss-Massa", date: "November 2026", type: "Qualifier" },
  { n: "02", name: "Imsouane",  region: "Agadir-Ida",  date: "December 2026", type: "Qualifier" },
  { n: "03", name: "Essaouira", region: "Marrakech",   date: "December 2026", type: "Qualifier" },
  { n: "04", name: "Agadir",    region: "Souss-Massa", date: "January 2027",  type: "Grand Final" },
];

const prizes = [
  { cat: "Open",         p1: "5000 MAD",    p2: "Gear",        p3: "Gear" },
  { cat: "Women's",      p1: "5000 MAD",    p2: "Gear",        p3: "Gear" },
  { cat: "Junior",       p1: "4000 MAD",    p2: "Gear",        p3: "Gear" },
  { cat: "Business Cup", p1: "20 000 MAD",  p2: "10 000 MAD",  p3: "5000 MAD" },
];

const faqs = [
  {
    q: "How does point scoring work?",
    a: "Points are awarded at each qualifying stop based on heat results. Your two best qualifying-stop scores count toward Grand Final seeding. The Grand Final awards double points.",
  },
  {
    q: "How does the Business Cup work?",
    a: "Each surf school or camp registers a roster of up to 5 surfers. Those surfers compete individually in the Open, Women's, or Junior categories. Their combined season points form the camp's Business Cup score.",
  },
  {
    q: "Can a camp surfer compete for another camp mid-season?",
    a: "No. Once registered to a camp roster, a surfer is locked in for the full season. Roster submissions close 48 hours before the first qualifying stop.",
  },
  {
    q: "What is the refund policy?",
    a: "Registrations are non-refundable within 14 days of an event. If Waveclubs cancels an event due to conditions beyond our control, all registered surfers receive a full credit toward any future Waveclubs Open event.",
  },
  {
    q: "How is Junior eligibility verified?",
    a: "A valid passport or national ID confirming date of birth is required at check-in. Surfers born on or after January 1, 2007 are eligible for the Junior category in the 2026/2027 season.",
  },
  {
    q: "Are independent surfers (not on a camp roster) eligible for the Business Cup?",
    a: "No. Independent surfers compete in the individual categories only. Their results do not contribute to any camp's Business Cup score.",
  },
];

/* ─── Page ──────────────────────────────────────────────── */

export default function OpenPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <SiteNav />

      <main>

        {/* ══════════════════════════════════════
            1 · HERO
        ══════════════════════════════════════ */}
        <section
          className="relative overflow-hidden flex flex-col justify-end"
          style={{ minHeight: "100svh" }}
        >
          <Image
            src="/images/surfing-bg.jpg"
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.70) 35%, rgba(0,0,0,0.30) 65%, rgba(0,0,0,0.10) 100%)",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(14,165,233,0.18) 0%, transparent 70%)" }}
          />

          <div className="relative z-10 px-6 md:px-14 pb-16 md:pb-20 max-w-6xl mx-auto w-full">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-6"
              style={{
                background: "rgba(14,165,233,0.20)",
                color: "#7DD3FC",
                border: "1px solid rgba(56,189,248,0.28)",
              }}
            >
              Season 2026 / 2027
            </span>

            <h1
              className="font-display font-extrabold text-white leading-[0.96] tracking-tight mb-6"
              style={{ fontSize: "clamp(52px, 9vw, 128px)" }}
            >
              Waveclubs<br />
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: "linear-gradient(90deg, #38BDF8, #0EA5E9, #06B6D4)" }}
              >
                Open.
              </span>
            </h1>

            <p className="text-[17px] md:text-xl text-white/55 leading-[1.7] max-w-xl mb-10">
              Morocco&apos;s surf competition series. Four stops, three categories,
              one Business Cup. Open to every surfer — and every surf school.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register?type=individual"
                className="inline-flex items-center justify-center gap-2 font-bold text-sm text-slate-900 bg-white px-7 py-3.5 rounded-xl cursor-pointer hover:bg-white/90 transition-colors duration-200"
              >
                Register as a surfer
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/register?type=camp"
                className="inline-flex items-center justify-center gap-2 font-semibold text-sm text-white px-7 py-3.5 rounded-xl cursor-pointer transition-all duration-200"
                style={{
                  border: "1px solid rgba(255,255,255,0.16)",
                  background: "rgba(255,255,255,0.06)",
                }}
              >
                Enter your camp
                <ChevronRight size={15} />
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-10 gap-y-4 mt-14 pt-10 border-t border-white/10">
              {[
                { n: "4", label: "Competition stops" },
                { n: "3", label: "Individual categories" },
                { n: "Morocco", label: "Atlantic coastline" },
                { n: "€5,400+", label: "Prize pool" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl md:text-3xl font-extrabold text-white leading-none mb-1">{s.n}</p>
                  <p className="text-[12px] text-white/40 font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            2 · FORMAT AT A GLANCE
        ══════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Format
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1]">
                Four categories.<br className="hidden md:block" /> Find yours in five seconds.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl p-6 flex flex-col gap-4"
                  style={{ border: "1px solid #E8EDF2" }}
                >
                  <div className="w-3 h-3 rounded-full" style={{ background: cat.accent }} />
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-slate-900 mb-0.5">{cat.label}</h3>
                    <p className="text-[12px] font-semibold mb-3" style={{ color: cat.accent }}>{cat.sub}</p>
                    <p className="text-[14px] text-slate-500 leading-[1.7]">{cat.body}</p>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-medium">Entry fee</span>
                    <span className="font-display text-base font-bold text-slate-900">{cat.fee}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            3 · HOW THE SEASON WORKS
        ══════════════════════════════════════ */}
        <section className="bg-[#040D18] px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#38BDF8" }}>
                The Season
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1]">
                How it works.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
              {[
                {
                  n: "01",
                  title: "Compete at any qualifying stop",
                  body: "Enter one, two, or all three qualifying events across Morocco. Each stop runs its own heats and awards points.",
                },
                {
                  n: "02",
                  title: "Earn points, build your ranking",
                  body: "Your two best qualifying-stop scores count. Points accumulate across the season — consistency wins.",
                },
                {
                  n: "03",
                  title: "Top surfers advance to the Grand Final",
                  body: "The highest-ranked surfers in each category earn a Grand Final slot in Agadir. Double points on the day.",
                },
              ].map((step) => (
                <div key={step.n} className="bg-[#040D18] p-8 md:p-10">
                  <span className="font-display text-[11px] font-bold tracking-widest" style={{ color: "#38BDF8" }}>
                    {step.n}
                  </span>
                  <h3 className="font-display text-lg font-bold text-white mt-3 mb-3 leading-[1.25]">{step.title}</h3>
                  <p className="text-[15px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.50)" }}>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            4 · SCHEDULE
        ══════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:py-28" id="schedule">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Schedule
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1]">
                2026 / 2027 Season calendar.
              </h2>
            </div>

            <div className="flex flex-col gap-3">
              {stops.map((stop) => {
                const isFinal = stop.type === "Grand Final";
                return (
                  <div
                    key={stop.n}
                    className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4"
                    style={{
                      background: isFinal ? "linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)" : "white",
                      border: isFinal ? "none" : "1px solid #E8EDF2",
                    }}
                  >
                    <span
                      className="font-display text-[11px] font-bold tracking-widest shrink-0"
                      style={{ color: isFinal ? "rgba(255,255,255,0.60)" : "#94A3B8" }}
                    >
                      STOP {stop.n}
                    </span>

                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6">
                      <h3
                        className="font-display text-xl font-extrabold"
                        style={{ color: isFinal ? "white" : "#0F172A" }}
                      >
                        {stop.name}
                      </h3>
                      <span
                        className="flex items-center gap-1.5 text-[13px]"
                        style={{ color: isFinal ? "rgba(255,255,255,0.65)" : "#94A3B8" }}
                      >
                        <MapPin size={12} />
                        {stop.region}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span
                        className="flex items-center gap-1.5 text-[13px] font-medium"
                        style={{ color: isFinal ? "rgba(255,255,255,0.75)" : "#64748B" }}
                      >
                        <Calendar size={13} />
                        {stop.date}
                      </span>
                      <span
                        className="text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
                        style={
                          isFinal
                            ? { background: "rgba(255,255,255,0.20)", color: "white" }
                            : { background: "rgba(14,165,233,0.08)", color: "#0284C7", border: "1px solid rgba(14,165,233,0.15)" }
                        }
                      >
                        {stop.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-[13px] text-slate-400 mt-6">
              Exact dates subject to final confirmation. Sign up for updates to be notified when the calendar is locked.
            </p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            5 · REGISTRATION & FEES
        ══════════════════════════════════════ */}
        <section className="px-6 py-20 md:py-28" style={{ background: "#FAFAFA" }} id="registration">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Registration
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1]">
                Two paths in.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {/* Individual */}
              <div
                className="bg-white rounded-2xl p-8 flex flex-col"
                style={{ border: "1px solid #E2E8F0", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" }}
              >
                <h3 className="font-display text-xl font-extrabold text-slate-900 mb-1">Individual Surfer</h3>
                <p className="text-[14px] text-slate-500 mb-8">Register yourself in any category you qualify for.</p>

                <div className="flex flex-col gap-3 mb-8">
                  {[
                    { cat: "Open", fee: "€35" },
                    { cat: "Women's", fee: "€35" },
                    { cat: "Junior (born ≥ 2007)", fee: "€25" },
                  ].map(({ cat, fee }) => (
                    <div key={cat} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <span className="text-[15px] text-slate-700 font-medium">{cat}</span>
                      <span className="font-display text-base font-bold text-slate-900">{fee}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register?type=individual"
                  className="btn-primary mt-auto inline-flex items-center justify-center gap-2 font-semibold text-sm text-white px-6 py-3.5 rounded-xl cursor-pointer"
                >
                  Register as a surfer
                  <ArrowRight size={15} />
                </Link>
              </div>

              {/* Camp — gradient border */}
              <div
                className="rounded-[27px] p-[1.5px] flex"
                style={{
                  background: "linear-gradient(145deg, rgba(56,189,248,0.9) 0%, rgba(14,165,233,0.7) 40%, rgba(6,182,212,0.8) 100%)",
                  boxShadow: "0 0 40px rgba(14,165,233,0.18), 0 12px 40px rgba(0,0,0,0.12)",
                }}
              >
                <div
                  className="rounded-[26px] p-8 flex flex-col w-full"
                  style={{ background: "linear-gradient(160deg, #060E1E 0%, #030A14 100%)" }}
                >
                  <span
                    className="self-start text-[11px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full mb-4"
                    style={{ background: "rgba(56,189,248,0.15)", color: "#7DD3FC", border: "1px solid rgba(56,189,248,0.25)" }}
                  >
                    Business Cup
                  </span>
                  <h3 className="font-display text-xl font-extrabold text-white mb-1">Your Camp or School</h3>
                  <p className="text-[14px] mb-8" style={{ color: "rgba(255,255,255,0.50)" }}>
                    Register a roster of up to 5 surfers and compete for the Business Cup.
                  </p>

                  <div className="flex flex-col gap-3 mb-8">
                    {[
                      { label: "Camp registration fee", value: "€150 / season" },
                      { label: "Max roster size", value: "5 surfers" },
                      { label: "Individual entries", value: "Separate fees apply" },
                      { label: "Points system", value: "Combined best scores" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between py-3 border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                        <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>{label}</span>
                        <span className="text-[14px] font-semibold text-white">{value}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href="/register?type=camp"
                    className="mt-auto inline-flex items-center justify-center gap-2 font-semibold text-sm text-slate-900 bg-white px-6 py-3.5 rounded-xl cursor-pointer hover:bg-white/90 transition-colors duration-200"
                  >
                    Enter your camp
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            6 · PRIZES
        ══════════════════════════════════════ */}
        <section className="bg-[#040D18] px-6 py-20 md:py-28">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#38BDF8" }}>
                Prize Pool
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-[1.1]">
                What you&apos;re surfing for.
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {prizes.map((p) => (
                <div
                  key={p.cat}
                  className="rounded-2xl p-6 flex flex-col gap-5"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <h3 className="font-display text-base font-bold text-white">{p.cat}</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { rank: "1st", value: p.p1, color: "#FCD34D" },
                      { rank: "2nd", value: p.p2, color: "#CBD5E1" },
                      { rank: "3rd", value: p.p3, color: "#D97706" },
                    ].map(({ rank, value, color }) => (
                      <div key={rank} className="flex items-center justify-between">
                        <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.45)" }}>{rank}</span>
                        <span className="font-display text-base font-bold" style={{ color }}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div
              className="mt-6 rounded-2xl px-7 py-5 flex items-center gap-3"
              style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.18)" }}
            >
              <Star size={16} style={{ color: "#38BDF8" }} className="shrink-0" />
              <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                Prize pool subject to final sponsor confirmation. Additional gear prizes and sponsor awards announced before the first qualifying stop.
              </p>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            7 · LEADERBOARDS
        ══════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:py-28">
          <div className="max-w-5xl mx-auto">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Leaderboards
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1]">
                Season standings.
              </h2>
            </div>

            <div
              className="rounded-2xl px-8 py-14 text-center"
              style={{ border: "1px solid #E8EDF2", background: "#FAFAFA" }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(14,165,233,0.08)", border: "1px solid rgba(14,165,233,0.15)" }}
              >
                <Trophy size={22} style={{ color: "#0EA5E9" }} strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-lg font-bold text-slate-900 mb-2">Season hasn&apos;t started yet</h3>
              <p className="text-[15px] text-slate-500 max-w-sm mx-auto leading-[1.7]">
                Live standings will appear here after the first qualifying stop. Registered camps will be listed below before the season opens.
              </p>
              <Link
                href="mailto:contact@waveclubs.com?subject=WaveClubs Open — Updates"
                className="btn-primary inline-flex items-center gap-2 font-semibold text-sm text-white px-6 py-3 rounded-xl cursor-pointer mt-8"
              >
                Get notified when the season opens
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            8 · SPONSORS
        ══════════════════════════════════════ */}
        <section className="px-6 py-20 md:py-28 border-t border-slate-100" style={{ background: "#FAFAFA" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Sponsors & Partners
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1] mb-4">
                Supporting the series.
              </h2>
              <p className="text-[15px] text-slate-500 max-w-lg mx-auto leading-relaxed">
                Waveclubs Open is made possible by sponsors who believe in surfing&apos;s growth in Morocco. Sponsor slots for the 2026/2027 season are open.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="h-20 rounded-xl flex items-center justify-center bg-white"
                  style={{ border: "1px solid #E8EDF2" }}
                >
                  <span className="text-[12px] font-semibold text-slate-300">Your brand here</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="mailto:contact@waveclubs.com?subject=WaveClubs Open — Sponsorship"
                className="btn-primary inline-flex items-center gap-2 font-semibold text-sm text-white px-7 py-3.5 rounded-xl cursor-pointer"
              >
                Partner with us
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            9 · RULES & FAQ
        ══════════════════════════════════════ */}
        <section className="bg-white px-6 py-20 md:py-28 border-t border-slate-100" id="faq">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#0EA5E9" }}>
                Rules & FAQ
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 leading-[1.1]">
                The details.
              </h2>
            </div>

            <div className="flex flex-col divide-y border-t border-slate-100">
              {faqs.map((faq, i) => (
                <div key={faq.q} className="border-slate-100">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-start justify-between gap-4 py-5 text-left cursor-pointer group"
                    aria-expanded={openFaq === i}
                  >
                    <span className="font-display text-base font-semibold text-slate-900 leading-snug group-hover:text-[#0EA5E9] transition-colors duration-200">
                      {faq.q}
                    </span>
                    <span className="shrink-0 mt-0.5" style={{ color: openFaq === i ? "#0EA5E9" : "#94A3B8" }}>
                      {openFaq === i ? <Minus size={16} strokeWidth={2} /> : <Plus size={16} strokeWidth={2} />}
                    </span>
                  </button>
                  {openFaq === i && (
                    <p className="text-[15px] text-slate-500 leading-[1.8] pb-5">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>

            <div
              className="mt-12 rounded-2xl px-7 py-6 flex flex-col md:flex-row md:items-center gap-5"
              style={{ background: "rgba(14,165,233,0.05)", border: "1px solid rgba(14,165,233,0.14)" }}
            >
              <div className="flex-1">
                <p className="font-display text-base font-bold text-slate-900 mb-1">Still have a question?</p>
                <p className="text-[14px] text-slate-500">We&apos;re happy to help before you register.</p>
              </div>
              <Link
                href="mailto:contact@waveclubs.com?subject=WaveClubs Open — Question"
                className="shrink-0 inline-flex items-center gap-2 font-semibold text-sm px-5 py-3 rounded-xl cursor-pointer transition-colors duration-200"
                style={{ color: "#0EA5E9", border: "1px solid rgba(14,165,233,0.25)", background: "white" }}
              >
                Contact us
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* ── Footer ── */}
      <footer className="bg-[#040D18] px-6 py-10 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/images/logo.png" alt="WaveClubs" width={110} height={28} className="h-6 w-auto" />
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>
            © {new Date().getFullYear()} WaveClubs. Morocco surf competition series.
          </p>
          <Link
            href="mailto:contact@waveclubs.com"
            className="text-[13px] transition-colors duration-150"
            style={{ color: "rgba(255,255,255,0.40)" }}
          >
            contact@waveclubs.com
          </Link>
        </div>
      </footer>
    </>
  );
}
