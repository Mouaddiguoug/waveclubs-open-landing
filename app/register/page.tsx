"use client";

import { useState, useRef, useCallback, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ArrowLeft, Eye, EyeOff, Upload, X,
  Check, MapPin, User, Building2, ChevronRight, ChevronLeft,
  Trophy,
} from "lucide-react";
import {
  signup, createOrganization, uploadPhoto,
  createRegistration,
} from "@/lib/auth";
import { ApiError } from "@/lib/api";
import type { LatLng } from "@/components/MapPicker";

const MapPicker = dynamic(() => import("@/components/MapPicker"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full rounded-2xl flex items-center justify-center"
      style={{ height: 280, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" }}
    >
      <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)" }}>Loading map…</p>
    </div>
  ),
});

/* ─── Data ──────────────────────────────────────────────────────────────────── */

type RegistrationType = "individual" | "business_cup";
type IndividualCategory = "open" | "womens" | "junior";

const INDIVIDUAL_CATEGORIES = [
  { id: "open" as IndividualCategory,   label: "Open",     sub: "Any age · Any gender",  fee: "€35", accent: "#0EA5E9" },
  { id: "womens" as IndividualCategory, label: "Women's",  sub: "Dedicated division",    fee: "€35", accent: "#06B6D4" },
  { id: "junior" as IndividualCategory, label: "Junior",   sub: "Born 2007 or later",    fee: "€25", accent: "#38BDF8" },
];

const ORG_TYPES = [
  { id: "camp"   as const, label: "Surf Camp"   },
  { id: "school" as const, label: "Surf School" },
  { id: "club"   as const, label: "Surf Club"   },
];

const STOPS = [
  { n: "01", name: "Taghazout",  date: "25 Nov 2026",  type: "Qualifier"   },
  { n: "02", name: "Imsouane",   date: "10 Dec 2026",  type: "Qualifier"   },
  { n: "03", name: "Essaouira",  date: "25 Dec 2026",  type: "Qualifier"   },
  { n: "04", name: "Agadir",     date: "10 Jan 2027",  type: "Grand Final" },
];

/* ─── Minimal header ─────────────────────────────────────────────────────────── */

function MinimalHeader({ hideLogo = false }: { hideLogo?: boolean }) {
  return (
    <header
      className={`flex items-center px-6 md:px-10 shrink-0 ${hideLogo ? "justify-between lg:justify-end" : "justify-between"}`}
      style={{ height: 60, borderBottom: "1px solid rgba(255,255,255,0.07)" }}
    >
      <Link href="/" className={`flex items-center gap-2.5 ${hideLogo ? "lg:hidden" : ""}`}>
        <Image src="/images/logo-light.png" alt="WaveClubs" width={120} height={28} className="h-6 w-auto" />
      </Link>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-[13px] font-medium transition-colors duration-150"
        style={{ color: "rgba(255,255,255,0.40)" }}
      >
        <ChevronLeft size={13} />
        WaveClubs Open
      </Link>
    </header>
  );
}

/* ─── Left panel ─────────────────────────────────────────────────────────────── */

function LeftPanel({ regType }: { regType: RegistrationType | null }) {
  return (
    <aside className="hidden lg:flex lg:w-100 xl:w-110 shrink-0 sticky top-0 h-screen flex-col overflow-hidden">
      <Image src="/images/surfing-bg.jpg" alt="" fill className="object-cover object-center" />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(4,13,24,0.82) 0%, rgba(4,13,24,0.70) 100%)" }}
      />
      <div className="relative z-10 flex flex-col h-full px-6 py-10">
        <Image src="/images/logo.png" alt="WaveClubs" width={120} height={100} className="w-auto mb-auto" />

        <div className="mb-10">
          <span
            className="inline-block text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1.5 rounded-full mb-5"
            style={{ background: "rgba(14,165,233,0.20)", color: "#7DD3FC", border: "1px solid rgba(56,189,248,0.28)" }}
          >
            Season 2026 / 2027
          </span>
          <h2
            className="font-display font-extrabold text-white leading-none tracking-tight mb-4"
            style={{ fontSize: "clamp(30px, 2.8vw, 42px)" }}
          >
            WaveClubs<br />
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #38BDF8, #0EA5E9)" }}>
              Open.
            </span>
          </h2>
          <p className="text-[14px] leading-[1.75]" style={{ color: "rgba(255,255,255,0.50)" }}>
            {regType === "business_cup"
              ? "Register your camp or school for the Business Cup. Up to 5 surfers, combined points, one champion."
              : "Morocco's surf competition series. Compete at 4 stops across the Atlantic coastline."}
          </p>
        </div>

        <div
          className="rounded-2xl p-5 mb-5"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.09)" }}
        >
          <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#38BDF8" }}>
            Season schedule
          </p>
          <div className="flex flex-col gap-3">
            {STOPS.map((s) => (
              <div key={s.n} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <MapPin size={11} style={{ color: s.type === "Grand Final" ? "#0EA5E9" : "rgba(255,255,255,0.35)" }} />
                  <span className="text-[13px] font-semibold text-white">{s.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.type === "Grand Final" && (
                    <span
                      className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(14,165,233,0.18)", color: "#7DD3FC" }}
                    >
                      Final
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Trophy size={15} style={{ color: "#38BDF8" }} />
          <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>
            <span className="text-white font-semibold">€4,500+</span> in prizes across all categories
          </p>
        </div>
      </div>
    </aside>
  );
}

/* ─── Step bar ───────────────────────────────────────────────────────────────── */

function StepBar({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center mb-10">
      {steps.map((label, i) => {
        const done   = i < current;
        const active = i === current;
        const last   = i === steps.length - 1;
        return (
          <div key={label} className={`flex items-center ${last ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-250"
                style={
                  done   ? { background: "#0EA5E9", color: "white", boxShadow: "0 0 0 3px rgba(14,165,233,0.20)" }
                  : active ? { background: "white", color: "#0F172A", boxShadow: "0 0 0 3px rgba(255,255,255,0.12)" }
                           : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.30)" }
                }
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </div>
              <span
                className="text-[11px] font-semibold whitespace-nowrap"
                style={{ color: active ? "white" : done ? "#38BDF8" : "rgba(255,255,255,0.28)" }}
              >
                {label}
              </span>
            </div>
            {!last && (
              <div
                className="h-px flex-1 mx-3 mb-4 transition-all duration-300"
                style={{ background: done ? "linear-gradient(90deg, #0EA5E9, rgba(14,165,233,0.40))" : "rgba(255,255,255,0.08)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Input field ────────────────────────────────────────────────────────────── */

function Field({
  label, id, type = "text", value, onChange, placeholder, error, optional,
}: {
  label: string; id: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; error?: string; optional?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>
        {label}
        {optional && <span className="ml-1.5 font-normal text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>Optional</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword ? (show ? "text" : "password") : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={isPassword ? "new-password" : undefined}
          className="w-full rounded-xl px-4 text-[15px] text-white outline-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.20)]"
          style={{
            height: 48,
            background: "rgba(255,255,255,0.05)",
            border: error ? "1.5px solid rgba(239,68,68,0.55)" : "1.5px solid rgba(255,255,255,0.08)",
          }}
          onFocus={(e) => (e.currentTarget.style.border = `1.5px solid ${error ? "rgba(239,68,68,0.75)" : "rgba(14,165,233,0.55)"}`)}
          onBlur={(e)  => (e.currentTarget.style.border = `1.5px solid ${error ? "rgba(239,68,68,0.55)" : "rgba(255,255,255,0.08)"}`)}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "rgba(255,255,255,0.35)" }}
            aria-label={show ? "Hide password" : "Show password"}
          >
            {show ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && <p className="text-[12px] mt-0.5" style={{ color: "#FCA5A5" }}>{error}</p>}
    </div>
  );
}

/* ─── Error banner ───────────────────────────────────────────────────────────── */

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="rounded-xl px-4 py-3 text-[14px] flex items-start gap-2.5"
      style={{ background: "rgba(239,68,68,0.09)", border: "1.5px solid rgba(239,68,68,0.22)", color: "#FCA5A5" }}>
      <span className="shrink-0 mt-0.5">⚠</span>
      {msg}
    </div>
  );
}

/* ─── Summary card ───────────────────────────────────────────────────────────── */

function SummaryCard({ rows }: { rows: { label: string; value: string }[] }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(14,165,233,0.20)", background: "rgba(14,165,233,0.06)" }}>
      <div className="px-5 py-2.5 border-b" style={{ borderColor: "rgba(14,165,233,0.14)" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#38BDF8" }}>Order summary</p>
      </div>
      <div className="px-5 py-4 flex flex-col gap-3">
        {rows.map(({ label, value }, i) => (
          <div key={label} className={`flex items-center justify-between text-[13px] ${i === rows.length - 1 ? "pt-2.5 border-t font-semibold" : ""}`} style={i === rows.length - 1 ? { borderColor: "rgba(255,255,255,0.08)" } : {}}>
            <span style={{ color: "rgba(255,255,255,0.45)" }}>{label}</span>
            <span className={i === rows.length - 1 ? "font-display text-white text-base" : "text-white font-medium"}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────────────────────── */

function RegisterWizard() {
  const searchParams = useSearchParams();

  const [regType, setRegType] = useState<RegistrationType | null>(null);
  useEffect(() => {
    const t = searchParams.get("type");
    if (t === "individual") setRegType("individual");
    if (t === "camp")       setRegType("business_cup");
  }, [searchParams]);

  const [name,     setName]     = useState("");
  const [userName, setUserName] = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");

  const [indCategory, setIndCategory] = useState<IndividualCategory | null>(null);

  const [orgType,       setOrgType]       = useState<"club"|"camp"|"school">("camp");
  const [orgName,       setOrgName]       = useState("");
  const [orgDesc,       setOrgDesc]       = useState("");
  const [offersLessons, setOffersLessons] = useState(false);
  const [offersAccom,   setOffersAccom]   = useState(true);
  const [offersEquip,   setOffersEquip]   = useState(false);
  const [photos,        setPhotos]        = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [location,      setLocation]      = useState<LatLng | null>(null);
  const [city,          setCity]          = useState("");
  const [country,       setCountry]       = useState("");

  const [step,        setStep]        = useState(0);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);

  const indSteps  = ["Category", "Details", "Password"];
  const campSteps = ["Account", "Organisation", "Photos", "Location"];
  const steps = regType === "individual" ? indSteps : campSteps;

  const validate = useCallback((): boolean => {
    const errs: Record<string, string> = {};
    setError("");

    if (regType === "individual") {
      if (step === 0 && !indCategory) { setError("Please select a category to continue."); return false; }
      if (step === 1) {
        if (!name.trim() || name.trim().length < 2) errs.name = "Full name must be at least 2 characters.";
        if (!userName.trim() || userName.trim().length < 3) errs.userName = "Username must be at least 3 characters.";
        if (!email.trim()) errs.email = "Email is required.";
      }
      if (step === 2) {
        if (!password || password.length < 8) errs.password = "Password must be at least 8 characters.";
        if (password !== confirm) errs.confirm = "Passwords do not match.";
      }
    }

    if (regType === "business_cup") {
      if (step === 0) {
        if (!name.trim() || name.trim().length < 2) errs.name = "Full name must be at least 2 characters.";
        if (!userName.trim() || userName.trim().length < 3) errs.userName = "Username must be at least 3 characters.";
        if (!email.trim()) errs.email = "Email is required.";
        if (!password || password.length < 8) errs.password = "Password must be at least 8 characters.";
        if (password !== confirm) errs.confirm = "Passwords do not match.";
      }
      if (step === 1 && !orgName.trim()) errs.orgName = "Organisation name is required.";
      if (step === 3) {
        if (!location) { setError("Click the map to place your camp's location."); return false; }
        if (!city.trim()) errs.city = "City is required.";
        if (!country.trim()) errs.country = "Country is required.";
      }
    }

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }, [regType, step, indCategory, name, userName, email, password, confirm, orgName, location, city, country]);

  const addPhotos = (files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files).slice(0, 5 - photos.length);
    setPhotos((p) => [...p, ...arr]);
    arr.forEach((f) => {
      const r = new FileReader();
      r.onload = (e) => setPhotoPreviews((prev) => [...prev, e.target?.result as string]);
      r.readAsDataURL(f);
    });
  };
  const removePhoto = (i: number) => {
    setPhotos((p) => p.filter((_, idx) => idx !== i));
    setPhotoPreviews((p) => p.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (regType === "individual") {
        await signup({ name: name.trim(), userName: userName.trim(), email: email.trim(), phone: phone.trim() || undefined, password, role: "user" });
        const reg = await createRegistration({ category: indCategory! });
        window.location.href = reg.data.checkoutUrl;
      } else {
        await signup({ name: name.trim(), userName: userName.trim(), email: email.trim(), phone: phone.trim() || undefined, password, role: "club_owner" });
        const imageUrls: string[] = [];
        for (const file of photos) {
          try { imageUrls.push((await uploadPhoto(file)).url); } catch { /* skip */ }
        }
        const orgRes = await createOrganization({ name: orgName.trim(), type: orgType, description: orgDesc.trim() || undefined, city: city.trim(), country: country.trim(), lat: location!.lat, lng: location!.lng, images: imageUrls, offersLessons, offersAccommodation: offersAccom, offersEquipment: offersEquip });
        const reg = await createRegistration({ category: "business_cup", organizationId: orgRes.data.id });
        window.location.href = reg.data.checkoutUrl;
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const next = () => {
    if (!validate()) return;
    if (step < steps.length - 1) setStep((s) => s + 1);
    else handleSubmit();
  };
  const back = () => { setError(""); setFieldErrors({}); setStep((s) => s - 1); };

  const isLast = step === steps.length - 1;

  /* ══════════════════════════════════════════════════════
      PATH SELECTION
  ══════════════════════════════════════════════════════ */
  if (!regType) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: "#040D18" }}>
        <MinimalHeader />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: "#38BDF8" }}>
              WaveClubs Open · Season 2026/2027
            </p>
            <h1 className="font-display text-3xl md:text-[38px] font-extrabold text-white leading-[1.1] mb-3">
              How are you entering?
            </h1>
            <p className="text-[15px] mb-10" style={{ color: "rgba(255,255,255,0.45)" }}>
              Choose your registration path. Individual surfers and surf camps follow different flows.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setRegType("individual")}
                className="group text-left rounded-2xl p-7 flex flex-col gap-5 cursor-pointer transition-all duration-200"
                style={{ background: "rgba(255,255,255,0.04)", border: "1.5px solid rgba(255,255,255,0.09)" }}
                onMouseEnter={(e) => (e.currentTarget.style.border = "1.5px solid rgba(14,165,233,0.45)")}
                onMouseLeave={(e) => (e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.09)")}
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(14,165,233,0.10)", border: "1px solid rgba(14,165,233,0.18)" }}>
                  <User size={19} style={{ color: "#0EA5E9" }} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-white mb-1.5">Individual Surfer</h2>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>
                    Open, Women&apos;s, or Junior category. €25 – €35 entry fee.
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#0EA5E9" }}>
                  Register as a surfer <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                </div>
              </button>

              <div className="rounded-[17px] p-[1.5px]" style={{ background: "linear-gradient(145deg, rgba(56,189,248,0.75) 0%, rgba(14,165,233,0.55) 100%)" }}>
                <button
                  onClick={() => setRegType("business_cup")}
                  className="group w-full h-full text-left rounded-2xl p-7 flex flex-col gap-5 cursor-pointer"
                  style={{ background: "linear-gradient(160deg, #060E1E 0%, #030A14 100%)" }}
                >
                  <div className="flex items-start justify-between">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: "rgba(56,189,248,0.10)", border: "1px solid rgba(56,189,248,0.22)" }}>
                      <Building2 size={19} style={{ color: "#38BDF8" }} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: "rgba(56,189,248,0.14)", color: "#7DD3FC" }}>
                      Teams
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-white mb-1.5">Business Cup</h2>
                    <p className="text-[14px] leading-[1.7]" style={{ color: "rgba(255,255,255,0.45)" }}>
                      Enter your surf camp, school, or club. Up to 5 surfers. €150 camp fee.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#38BDF8" }}>
                    Enter your camp <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform duration-150" />
                  </div>
                </button>
              </div>
            </div>

            <p className="text-center text-[13px] mt-8" style={{ color: "rgba(255,255,255,0.28)" }}>
              Already registered?{" "}
              <Link href="/" className="underline transition-colors hover:text-white/60" style={{ color: "rgba(255,255,255,0.40)" }}>
                Back to the Open page
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════════════════
      WIZARD
  ══════════════════════════════════════════════════════ */
  return (
    <div className="flex" style={{ minHeight: "100svh", background: "#040D18" }}>
      <LeftPanel regType={regType} />

      <div className="flex-1 flex flex-col min-w-0">
        <MinimalHeader hideLogo />

        <div className="flex-1 flex items-start justify-center px-6 md:px-10 py-10 overflow-y-auto">
          <div className="w-full max-w-130">

            {step === 0 && (
              <button
                onClick={() => { setRegType(null); setStep(0); setError(""); setFieldErrors({}); }}
                className="flex items-center gap-1.5 text-[13px] font-medium mb-8 cursor-pointer transition-colors duration-150"
                style={{ color: "rgba(255,255,255,0.35)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
              >
                <ArrowLeft size={13} /> Change path
              </button>
            )}

            <StepBar steps={steps} current={step} />

            {/* ══ INDIVIDUAL STEPS ══ */}
            {regType === "individual" && (
              <>
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Choose your category</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>
                      You can register for multiple categories with separate entries.
                    </p>
                    <div className="flex flex-col gap-3">
                      {INDIVIDUAL_CATEGORIES.map((cat) => {
                        const active = indCategory === cat.id;
                        return (
                          <button
                            key={cat.id}
                            onClick={() => { setIndCategory(cat.id); setError(""); }}
                            className="flex items-center gap-4 rounded-2xl cursor-pointer transition-all duration-150 overflow-hidden text-left"
                            style={{
                              padding: "0",
                              background: active ? "rgba(14,165,233,0.08)" : "rgba(255,255,255,0.03)",
                              border: active ? `1.5px solid ${cat.accent}` : "1.5px solid rgba(255,255,255,0.07)",
                            }}
                          >
                            <div className="w-1 self-stretch shrink-0 rounded-l-xl transition-all duration-150" style={{ background: active ? cat.accent : "transparent", minHeight: 72 }} />
                            <div className="flex-1 py-5">
                              <p className="font-display text-[17px] font-bold text-white">{cat.label}</p>
                              <p className="text-[12px] mt-0.5" style={{ color: "rgba(255,255,255,0.40)" }}>{cat.sub}</p>
                            </div>
                            <div className="flex items-center gap-3 pr-5">
                              <span className="font-display text-xl font-extrabold" style={{ color: active ? cat.accent : "rgba(255,255,255,0.55)" }}>
                                {cat.fee}
                              </span>
                              <div
                                className="w-6 h-6 rounded-full flex items-center justify-center transition-all duration-150 shrink-0"
                                style={{
                                  background: active ? cat.accent : "rgba(255,255,255,0.06)",
                                  border: active ? "none" : "1.5px solid rgba(255,255,255,0.12)",
                                }}
                              >
                                {active && <Check size={12} strokeWidth={3} className="text-white" />}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Your details</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>This creates your WaveClubs account.</p>
                    <div className="flex flex-col gap-4">
                      <Field label="Full name" id="name" value={name} onChange={setName} placeholder="Your full name" error={fieldErrors.name} />
                      <Field label="Username" id="username" value={userName} onChange={setUserName} placeholder="e.g. wavesurfer42" error={fieldErrors.userName} />
                      <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" error={fieldErrors.email} />
                      <Field label="Phone" id="phone" value={phone} onChange={setPhone} placeholder="+212 600 000 000" optional />
                    </div>
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Create a password</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>You&apos;ll use this to access your WaveClubs account.</p>
                    <div className="flex flex-col gap-4 mb-7">
                      <Field label="Password" id="password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" error={fieldErrors.password} />
                      <Field label="Confirm password" id="confirm" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" error={fieldErrors.confirm} />
                    </div>
                    <SummaryCard rows={[
                      { label: "Category", value: indCategory ? indCategory.charAt(0).toUpperCase() + indCategory.slice(1) : "—" },
                      { label: "Season", value: "2026 / 2027" },
                      { label: "Entry fee", value: INDIVIDUAL_CATEGORIES.find((c) => c.id === indCategory)?.fee ?? "—" },
                    ]} />
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}
              </>
            )}

            {/* ══ BUSINESS CUP STEPS ══ */}
            {regType === "business_cup" && (
              <>
                {step === 0 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Create your account</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>Your personal account. You&apos;ll add camp details in the next step.</p>
                    <div className="flex flex-col gap-4">
                      <div className="grid grid-cols-2 gap-4">
                        <Field label="Full name" id="name" value={name} onChange={setName} placeholder="Your name" error={fieldErrors.name} />
                        <Field label="Username" id="username" value={userName} onChange={setUserName} placeholder="username" error={fieldErrors.userName} />
                      </div>
                      <Field label="Email" id="email" type="email" value={email} onChange={setEmail} placeholder="you@yourcamp.com" error={fieldErrors.email} />
                      <Field label="Phone" id="phone" value={phone} onChange={setPhone} placeholder="+212 600 000 000" optional />
                      <Field label="Password" id="password" type="password" value={password} onChange={setPassword} placeholder="Min. 8 characters" error={fieldErrors.password} />
                      <Field label="Confirm password" id="confirm" type="password" value={confirm} onChange={setConfirm} placeholder="Repeat your password" error={fieldErrors.confirm} />
                    </div>
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}

                {step === 1 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Your organisation</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>Tell us about the camp or school entering the Business Cup.</p>
                    <div className="flex flex-col gap-5">
                      <div className="flex flex-col gap-2">
                        <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>Type</p>
                        <div className="grid grid-cols-3 gap-2">
                          {ORG_TYPES.map((t) => (
                            <button key={t.id} onClick={() => setOrgType(t.id)}
                              className="rounded-xl py-3 text-[13px] font-semibold cursor-pointer transition-all duration-150"
                              style={{
                                background: orgType === t.id ? "rgba(14,165,233,0.12)" : "rgba(255,255,255,0.04)",
                                border: orgType === t.id ? "1.5px solid #0EA5E9" : "1.5px solid rgba(255,255,255,0.07)",
                                color: orgType === t.id ? "white" : "rgba(255,255,255,0.40)",
                              }}>
                              {t.label}
                            </button>
                          ))}
                        </div>
                      </div>
                      <Field label="Organisation name" id="orgName" value={orgName} onChange={setOrgName} placeholder="e.g. Taghazout Surf Camp" error={fieldErrors.orgName} />
                      <div className="flex flex-col gap-1.5">
                        <label htmlFor="desc" className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>
                          Description <span className="font-normal text-[12px]" style={{ color: "rgba(255,255,255,0.30)" }}>Optional</span>
                        </label>
                        <textarea id="desc" rows={3} value={orgDesc} onChange={(e) => setOrgDesc(e.target.value)}
                          placeholder="Brief description of your organisation…"
                          className="w-full rounded-xl px-4 py-3.5 text-[15px] text-white outline-none resize-none transition-all duration-200 placeholder:text-[rgba(255,255,255,0.20)]"
                          style={{ background: "rgba(255,255,255,0.05)", border: "1.5px solid rgba(255,255,255,0.08)" }}
                          onFocus={(e) => (e.currentTarget.style.border = "1.5px solid rgba(14,165,233,0.55)")}
                          onBlur={(e)  => (e.currentTarget.style.border = "1.5px solid rgba(255,255,255,0.08)")} />
                      </div>
                      <div className="flex flex-col gap-3">
                        <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.70)" }}>What do you offer?</p>
                        {[
                          { label: "Lessons",           val: offersLessons, set: setOffersLessons },
                          { label: "Accommodation",     val: offersAccom,   set: setOffersAccom   },
                          { label: "Equipment rental",  val: offersEquip,   set: setOffersEquip   },
                        ].map(({ label, val, set }) => (
                          <button key={label} onClick={() => set(!val)} className="flex items-center gap-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded-md flex items-center justify-center transition-all duration-150 shrink-0"
                              style={{ background: val ? "#0EA5E9" : "rgba(255,255,255,0.05)", border: val ? "none" : "1.5px solid rgba(255,255,255,0.14)" }}>
                              {val && <Check size={11} strokeWidth={3} className="text-white" />}
                            </div>
                            <span className="text-[14px] group-hover:text-white transition-colors" style={{ color: "rgba(255,255,255,0.60)" }}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {error && <div className="mt-5"><ErrorBanner msg={error} /></div>}
                  </div>
                )}

                {step === 2 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Photos</h2>
                    <p className="text-[14px] mb-7" style={{ color: "rgba(255,255,255,0.40)" }}>Add up to 5 photos. This step is optional — you can skip it.</p>
                    {photos.length < 5 && (
                      <button onClick={() => fileInputRef.current?.click()}
                        className="w-full rounded-2xl flex flex-col items-center justify-center gap-3 py-12 cursor-pointer transition-all duration-150 mb-4"
                        style={{ border: "1.5px dashed rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(14,165,233,0.40)"; e.currentTarget.style.background = "rgba(14,165,233,0.04)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(14,165,233,0.10)", border: "1px solid rgba(14,165,233,0.18)" }}>
                          <Upload size={18} style={{ color: "#0EA5E9" }} strokeWidth={1.5} />
                        </div>
                        <p className="text-[14px]" style={{ color: "rgba(255,255,255,0.40)" }}>Click to upload · JPEG, PNG, WebP · max 5 MB</p>
                        <input ref={fileInputRef} type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => addPhotos(e.target.files)} />
                      </button>
                    )}
                    {photoPreviews.length > 0 && (
                      <div className="grid grid-cols-3 gap-2.5">
                        {photoPreviews.map((src, i) => (
                          <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
                            <Image src={src} alt={`Photo ${i + 1}`} fill className="object-cover" />
                            <button onClick={() => removePhoto(i)}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                              <X size={12} className="text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}

                {step === 3 && (
                  <div>
                    <h2 className="font-display text-2xl md:text-3xl font-bold text-white mb-1.5">Location</h2>
                    <p className="text-[14px] mb-6" style={{ color: "rgba(255,255,255,0.40)" }}>Click the map to place your camp. City and country fill automatically.</p>
                    <MapPicker value={location} onChange={(pos, c, co) => { setLocation(pos); if (c) setCity(c); if (co) setCountry(co); setError(""); }} />
                    {location && (
                      <div className="flex items-center gap-2 mt-3 mb-1 text-[12px]" style={{ color: "#38BDF8" }}>
                        <MapPin size={12} /> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-3 mt-4 mb-6">
                      <Field label="City" id="city" value={city} onChange={setCity} placeholder="Auto-filled" error={fieldErrors.city} />
                      <Field label="Country" id="country" value={country} onChange={setCountry} placeholder="Auto-filled" error={fieldErrors.country} />
                    </div>
                    <SummaryCard rows={[
                      { label: "Organisation", value: orgName || "—" },
                      { label: "Category", value: "Business Cup" },
                      { label: "Season", value: "2026 / 2027" },
                      { label: "Camp entry fee", value: "€150" },
                    ]} />
                    {error && <div className="mt-4"><ErrorBanner msg={error} /></div>}
                  </div>
                )}
              </>
            )}

            <div className="flex gap-3 mt-8">
              {step > 0 && (
                <button onClick={back} disabled={loading}
                  className="inline-flex items-center gap-2 font-semibold text-[14px] px-5 h-12 rounded-xl cursor-pointer transition-all duration-150 disabled:opacity-40 shrink-0"
                  style={{ color: "rgba(255,255,255,0.50)", border: "1.5px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.04)" }}>
                  <ArrowLeft size={14} /> Back
                </button>
              )}
              <button onClick={next} disabled={loading}
                className="btn-primary flex-1 inline-flex items-center justify-center gap-2 font-bold text-[15px] text-white h-12 rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Redirecting…" : isLast ? "Continue to payment" : "Continue"}
                {!loading && <ArrowRight size={15} />}
              </button>
            </div>

            <p className="text-center text-[12px] mt-6" style={{ color: "rgba(255,255,255,0.22)" }}>
              By registering you agree to the{" "}
              <Link href="/#faq" className="underline hover:text-white/50 transition-colors">competition rules</Link>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#040D18" }}>
        <p style={{ color: "rgba(255,255,255,0.30)" }}>Loading…</p>
      </div>
    }>
      <RegisterWizard />
    </Suspense>
  );
}
