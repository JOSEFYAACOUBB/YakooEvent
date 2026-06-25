import { supabase } from "../supabaseClient";
import { useState, useEffect, useRef, createContext, useContext } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

const ContentContext = createContext<Record<string, string>>({});
export const useContent = () => useContext(ContentContext);
import {
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Star,
  Minus,
  Plus,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Trees,
  Leaf,
  Shield,
  Menu,
  X,
  Clock,
  Users,
  User,
  CheckCircle2,
  ChevronRight,
  Zap,
  Play,
} from "lucide-react";

// ─── Global styles ───────────────────────────────────────────────────────────
const Reveal = ({ children, delay }: { children: React.ReactNode, delay?: number }) => <>{children}</>;

function GlobalStyles() {
  return (
    <style>{`
      @font-face {
        font-family: 'KG Red Hands';
        src: url('/fonts/KGRedHands.ttf') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      *, *::before, *::after { box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { overflow-x: hidden; font-family: 'KG Red Hands', sans-serif; }
      ::selection { background: rgba(245,166,35,0.28); color: #1B2A4A; }
      ::-webkit-scrollbar { width: 5px; }
      ::-webkit-scrollbar-track { background: #040c18; }
      ::-webkit-scrollbar-thumb { background: rgba(245,166,35,0.4); border-radius: 99px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(245,166,35,0.65); }
      img { display: block; max-width: 100%; }
      a { text-decoration: none; }
      button { cursor: pointer; border: none; background: none; padding: 0; }

      /* Page-load fade-in */
      @keyframes page-in {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: none; }
      }
      #root { animation: page-in 0.55s ease forwards; }

      /* Gold focus ring */
      :focus-visible { outline: 2px solid rgba(245,166,35,0.6); outline-offset: 3px; border-radius: 4px; }

      /* Tighter line-height for display text */
      .display { line-height: 0.92 !important; }

      /* Prevent tap highlight on mobile */
      * { -webkit-tap-highlight-color: transparent; }

      /* input date color fix on dark bg */
      input[type="date"]::-webkit-calendar-picker-indicator { filter: invert(0.5); }

      /* Hide scrollbar on ticker rows */
      .no-scrollbar::-webkit-scrollbar { display: none; }
      .no-scrollbar { scrollbar-width: none; }
    `}</style>
  );
}

// ─── Brand ──────────────────────────────────────────────────────────────────
const NAVY = "#1B2A4A";
const GOLD = "#F5A623";
const TEXT_MUTED = "#9BA3AF";

// ─── Fade-in-up on scroll hook ───────────────────────────────────────────────
function useFadeInUp(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ─── Animated section wrapper ────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = "", style }: { children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const { ref, visible } = useFadeInUp();
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

// ─── Logo ────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <a href="#accueil" className="select-none group relative flex items-center justify-center w-24 sm:w-32 lg:w-48 h-16 sm:h-20 z-50">
      <div className="w-full h-full transition-transform duration-300 group-hover:scale-110 flex items-center justify-center">
        <img
          src="src/photos/logo.png"
          alt="Logo"
          className="w-full h-full object-contain scale-[1.5] lg:scale-[2.2]"
        />
      </div>
    </a>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Accueil",         href: "#accueil" },
  { label: "À propos",        href: "#apropos" },
  { label: "Activités",       href: "#activites" },
  { label: "Équipements",     href: "#equipements" },
  { label: "Réservation",     href: "#reservation" },
  { label: "Contact",         href: "#contact" },
];

// ─── Button Component ─────────────────────────────────────────────────────────
interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "outline";
  icon?: React.ElementType;
  className?: string;
  type?: "button" | "submit";
  fullWidth?: boolean;
}

function Button({ children, href, onClick, variant = "primary", icon: Icon, className = "", type = "button", fullWidth }: ButtonProps) {
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  
  const content = (
    <>
      <span className="flex-1 text-center font-bold tracking-wide leading-none pt-[1px]">{children}</span>
      {Icon && (
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1"
          style={{ background: isPrimary ? "rgba(4,12,24,0.15)" : "rgba(255,255,255,0.1)" }}
        >
          <Icon size={16} strokeWidth={2.5} />
        </div>
      )}
    </>
  );

  const style = {
    fontFamily: "'KG Red Hands', sans-serif",
    background: isPrimary ? GOLD : isOutline ? "transparent" : "rgba(255,255,255,0.06)",
    color: isPrimary ? NAVY : "#fff",
    border: isOutline ? "1.5px solid rgba(255,255,255,0.2)" : isPrimary ? "none" : "1.5px solid rgba(255,255,255,0.12)",
    boxShadow: isPrimary ? "0 10px 30px rgba(245,166,35,0.3)" : "none",
  };

  const classes = `group inline-flex items-center gap-4 pl-7 pr-2 py-2 rounded-[2rem] text-sm transition-all duration-300 hover:shadow-[0_15px_35px_rgba(245,166,35,0.4)] ${fullWidth ? 'w-full flex' : ''} ${className}`;

  if (href) {
    return (
      <motion.a href={href} onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={classes} style={style}>
        {content}
      </motion.a>
    );
  }
  return (
    <motion.button type={type} onClick={onClick} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className={classes} style={style}>
      {content}
    </motion.button>
  );
}

function Navbar() {
  const [scrolled, setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive]       = useState("Accueil");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Main bar ── */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-center"
        style={{ paddingTop: scrolled ? "10px" : "0px", transition: "padding 0.4s ease" }}
      >
        <div
          className="w-full transition-all duration-500"
          style={
            scrolled
              ? {
                  maxWidth: "900px",
                  margin: "0 16px",
                  borderRadius: "20px",
                  background: "rgba(7, 14, 27, 0.82)",
                  backdropFilter: "blur(24px)",
                  WebkitBackdropFilter: "blur(24px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 8px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)",
                }
              : {
                  maxWidth: "100%",
                  margin: "0",
                  borderRadius: "0",
                  background: "linear-gradient(to bottom, rgba(7,14,27,0.75) 0%, transparent 100%)",
                  backdropFilter: "none",
                  border: "none",
                  boxShadow: "none",
                }
          }
        >
          <div className="flex items-center justify-between px-6 h-20">
            <Logo />

            {/* Desktop links */}
            <nav className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((l) => {
                const isActive = active === l.label;
                return (
                  <a
                    key={l.label}
                    href={l.href}
                    onClick={() => setActive(l.label)}
                    className="relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200"
                    style={{
                      fontFamily: "'KG Red Hands', sans-serif",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.72)",
                    }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full"
                        style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)" }}
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      />
                    )}
                    <span className="relative z-10">{l.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Right side: CTA + hamburger */}
            <div className="flex items-center gap-3">
              <div className="hidden lg:block">
                <Button href="#" icon={ArrowRight}>
                  Comming soon
                </Button>
              </div>

              {/* Hamburger — animated bars */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl gap-[5px]"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <motion.span
                  animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block w-5 h-0.5 rounded-full"
                  style={{ background: "#fff", transformOrigin: "center" }}
                />
                <motion.span
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.2 }}
                  className="block w-3.5 h-0.5 rounded-full self-start ml-1"
                  style={{ background: "rgba(255,255,255,0.5)" }}
                />
                <motion.span
                  animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block w-5 h-0.5 rounded-full"
                  style={{ background: "#fff", transformOrigin: "center" }}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Full-screen mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden flex flex-col"
            style={{ background: "rgba(5, 11, 22, 0.97)", backdropFilter: "blur(20px)" }}
          >
            {/* Top bar replica */}
            <div className="flex items-center justify-between px-6 h-20 flex-shrink-0">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <X size={18} color="#fff" />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />

            {/* Nav links */}
            <nav className="flex flex-col flex-1 justify-center px-8 gap-2">
              {NAV_LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ delay: i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  onClick={() => { setActive(l.label); setMobileOpen(false); }}
                  className="flex items-center justify-between py-4 border-b group"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <span
                    className="font-black text-2xl tracking-tight"
                    style={{
                      fontFamily: "'KG Red Hands', sans-serif",
                      color: active === l.label ? GOLD : "rgba(255,255,255,0.8)",
                    }}
                  >
                    {l.label}
                  </span>
                  <ArrowRight
                    size={18}
                    style={{ color: active === l.label ? GOLD : "rgba(255,255,255,0.2)" }}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </motion.a>
              ))}
            </nav>

            {/* Bottom CTA */}
            <div className="px-8 pb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                onClick={() => setMobileOpen(false)}
              >
                <Button href="#reservation" fullWidth icon={ArrowRight} className="py-2.5">
                  Espace Pro
                </Button>
              </motion.div>
              <p
                className="text-center text-xs mt-4"
                style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.2)" }}
              >
                +216 71 790 501 · Tunis, Tunisie
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Animated counter hook ────────────────────────────────────────────────────
function useCounter(target: number, duration = 1800, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let frame = 0;
    const steps = 60;
    const inc = target / steps;
    const id = setInterval(() => {
      frame++;
      setVal(Math.min(Math.round(inc * frame), target));
      if (frame >= steps) clearInterval(id);
    }, duration / steps);
    return () => clearInterval(id);
  }, [target, duration, start]);
  return val;
}

// ─── Hero ─────────────────────────────────────────────────────────────────────


function StatCounter({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) {
  const { ref, visible } = useFadeInUp(0.1);
  const val = useCounter(target, 1600, visible);
  return (
    <div ref={ref} className="flex flex-col">
      <span
        className="font-black leading-none"
        style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", color: "#fff" }}
      >
        {val}{suffix}
      </span>
      <span
        className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] mt-1"
        style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}
      >
        {label}
      </span>
    </div>
  );
}

function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);
  const content = useContent();

  const title = content['hero_title'] || "VOULEZ PLUS PRENEZ TOUT";
  const subtitle = content['hero_subtitle'] || "Stage Adrénaline · Tunis, Tunisie";
  const description = content['about_mission'] || "Votre agence spécialisée en activités de plein air, team building et aventure nature.";
  const cta1Text = content['hero_cta1_text'] || "Découvrir les activités";
  const cta1Url = content['hero_cta1_url'] || "#activites";
  const cta2Text = content['hero_cta2_text'] || "Réserver maintenant";
  const cta2Url = content['hero_cta2_url'] || "#reservation";
  const overlayOpacity = content['hero_overlay'] ? Number(content['hero_overlay']) / 100 : 0.6;
  const titleWords = title.split(" ");

  useEffect(() => {
    const h = (e: MouseEvent) => {
      setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 0.4, y: (e.clientY / window.innerHeight - 0.5) * 0.4 });
    };
    window.addEventListener("mousemove", h);
    return () => window.removeEventListener("mousemove", h);
  }, []);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section
      id="accueil"
      className="relative min-h-screen overflow-hidden flex flex-col"
      style={{ background: "#070e1b" }}
    >
      {/* ── RIGHT IMAGE PANEL (desktop) ── */}
      <div
        className="hidden lg:block absolute right-0 top-0 h-full w-[52%] overflow-hidden"
        style={{ clipPath: "polygon(14% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      >
        <motion.img
          src="https://images.unsplash.com/photo-1648853070657-6d58398bee93?w=1200&h=900&fit=crop&auto=format"
          alt="Activité aventure Yakoo Events"
          className="w-full h-full object-cover"
          style={{ scale: 1.1 }}
          animate={{ x: mousePos.x * -18, y: mousePos.y * -14 }}
          transition={{ type: "spring", stiffness: 35, damping: 22 }}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Overlay gradients */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, #070e1b 0%, rgba(7,14,27,${overlayOpacity}) 40%, rgba(7,14,27,${overlayOpacity * 0.1}) 100%)` }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(7,14,27,0.7) 0%, transparent 40%)" }}
        />

        {/* Vertical rotated text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={{ delay: 2 }}
          className="absolute right-6 top-1/2 -translate-y-1/2"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed", transform: "translateY(-50%) rotate(180deg)" }}
        >
          <span
            className="text-[10px] font-bold tracking-[0.3em] uppercase"
            style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}
          >
            3 HECTARES · EN PLEINE NATURE
          </span>
        </motion.div>
      </div>

      {/* Mobile background image */}
      <div className="lg:hidden absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1648853070657-6d58398bee93?w=800&h=1200&fit=crop&auto=format"
          alt="Yakoo Events"
          className="w-full h-full object-cover"
          style={{ opacity: 0.2 }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, #070e1b 0%, rgba(7,14,27,${overlayOpacity}) 50%, #070e1b 100%)` }} />
      </div>

      {/* ── LEFT CONTENT PANEL ── */}
      <div className="relative z-10 flex flex-col h-full w-full lg:w-[54%] px-5 sm:px-8 lg:px-16 xl:px-20 pt-24 sm:pt-28 pb-0">

        {/* Top identifier bar */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center gap-4 mb-auto"
        >
          <div className="flex items-center gap-3">
            <div className="w-6 h-px" style={{ background: GOLD }} />
            <span className="text-[10px] font-semibold tracking-[0.25em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>
              Agence Événementielle
            </span>
          </div>
          <div className="ml-auto text-[10px] tracking-[0.2em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.2)" }}>
            2026 — TUNIS
          </div>
        </motion.div>

        {/* ── HEADLINE ── */}
        <div className="mt-auto mb-auto">
          {/* Watermark behind headline */}
          <div
            className="absolute left-6 lg:left-12 select-none pointer-events-none overflow-hidden"
            style={{ top: "15%", zIndex: -1 }}
          >
            <span
              style={{
                fontFamily: "'KG Red Hands', sans-serif",
                fontWeight: 900,
                fontSize: "min(22vw, 18rem)",
                color: "rgba(255,255,255,0.022)",
                lineHeight: 1,
                whiteSpace: "nowrap",
                letterSpacing: "-0.04em",
              }}
            >
              YAKOO
            </span>
          </div>

          {/* Render title words dynamically */}
          {titleWords.map((word, idx) => {
            const isGoldOutlined = idx === 1;
            const isGoldFilled = idx >= 2;
            const colorVal = isGoldOutlined ? "transparent" : (isGoldFilled ? GOLD : "#ffffff");
            const strokeVal = isGoldOutlined ? `3px ${GOLD}` : "none";
            return (
              <div key={idx} className="overflow-hidden">
                <motion.span
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.0, delay: 0.2 + idx * 0.12, ease }}
                  className="block font-black leading-[0.88]"
                  style={{
                    fontFamily: "'KG Red Hands', sans-serif",
                    fontSize: "clamp(3rem, 11vw, 10rem)",
                    color: colorVal,
                    WebkitTextStroke: strokeVal,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {word}
                </motion.span>
              </div>
            );
          })}

          {/* Stage tag line */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.85, duration: 0.6 }}
            className="flex items-center gap-2 sm:gap-4 mt-5 sm:mt-7"
          >
            <div className="h-px w-6 sm:w-8 flex-shrink-0" style={{ background: GOLD }} />
            <span
              className="text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase"
              style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.65)" }}
            >
              {subtitle}
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.65 }}
            className="mt-4 sm:mt-5 text-sm sm:text-base leading-relaxed max-w-sm"
            style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)" }}
          >
            Votre agence spécialisée en activités de plein air, team building et aventure nature.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.15, duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3 mt-6 sm:mt-8"
          >
            <Button href="#activites" icon={ArrowRight}>
              Découvrir les activités
            </Button>
            <Button href="#reservation" variant="outline" className="px-5 sm:px-7 py-3 sm:py-3.5">
              Réserver maintenant
            </Button>
          </motion.div>

         
        </div>

        {/* Bottom spacer so buttons are never cut off */}
        <div className="h-32 lg:h-40" />
      </div>



  {/* Scroll mouse indicator */}
<motion.div
  className="absolute left-1/2 bottom-20 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 2 }}
>
  <motion.div
    animate={{ y: [0, 7, 0] }}
    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
    className="w-5 h-8 rounded-full border-2 flex items-start justify-center pt-1.5"
    style={{ borderColor: "rgba(255,255,255,0.2)" }}
  >
    <div className="w-1 h-1.5 rounded-full" style={{ background: GOLD }} />
  </motion.div>

  <span
    className="text-[9px] uppercase tracking-widest"
    style={{
      fontFamily: "'KG Red Hands', sans-serif",
      color: "rgba(255,255,255,0.2)",
      writingMode: "vertical-rl"
    }}
  >
    Défiler
  </span>
</motion.div>
    </section>
  );
}



// ─── About ────────────────────────────────────────────────────────────────────
const ABOUT_PILLARS = [
  {
    icon: <Shield size={22} />,
    title: "Sécurité absolue",
    desc: "Tous nos encadrants sont certifiés. Équipements homologués et contrôlés avant chaque session.",
  },
  {
    icon: <Trees size={22} />,
    title: "En pleine nature",
    desc: "3 hectares de parc forestier préservé. Un cadre naturel unique à seulement quelques minutes de Tunis.",
  },
  {
    icon: <Leaf size={22} />,
    title: "Éco-responsable",
    desc: "Engagement fort pour la préservation de l'environnement naturel et des espèces locales.",
  },
  {
    icon: <Zap size={22} />,
    title: "Adrénaline garantie",
    desc: "22 activités conçues pour dépasser vos limites et créer des souvenirs inoubliables.",
  },
];

function About() {
  const [videoOpen, setVideoOpen] = useState(false);
  const content = useContent();

  const mission = content['about_mission'] || "Agence événementielle tunisienne de premier plan, spécialisée dans les activités de plein air, le team building et l'aventure nature. Nous créons des expériences immersives dans un parc préservé de 3 hectares.";
  const vision = content['about_vision'] || "Être le parc de référence en Tunisie en matière d'éthique, d'engagement éco-responsable et de satisfaction absolue de nos visiteurs.";

  const marqueeWords = ["YAKOO EVENTS", "VIVEZ L'AVENTURE", "TUNISIE", "NATURE", "ADRÉNALINE", "TEAM BUILDING"];

  const bentoItems = [
    { type: "stat",  value: "500+", label: "Groupes",      sub: "accueillis",      color: NAVY, bg: "#fff",  accent: GOLD },
    { type: "photo", img: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?w=500&h=400&fit=crop&auto=format", label: "Kayak" },
    { type: "photo", img: "https://images.unsplash.com/photo-1637511077877-3c6a00eb32ba?w=500&h=400&fit=crop&auto=format", label: "Tyrolienne" },
    { type: "stat",  value: "22",   label: "Activités",    sub: "pour tous",       color: "#fff", bg: NAVY,  accent: GOLD },
    { type: "stat",  value: "3 ha", label: "Parc Naturel", sub: "préservé",        color: NAVY, bg: "#fff",  accent: GOLD },
    { type: "stat",  value: "4.9★", label: "Satisfaction", sub: "sur 500+ avis",  color: NAVY, bg: GOLD,   accent: NAVY },
  ];

  return (
    <section id="apropos" className="relative pb-32 pt-32 lg:pt-40 overflow-hidden" style={{ background: "#F4F6F9" }}>
      
      {/* ── Scrolling Background Marquee ── */}
      <style>{`
        @keyframes marquee-bg { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marquee-bg-r { from { transform: translateX(-50%) } to { transform: translateX(0) } }
        @keyframes pulse-ring { 0%, 100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.4); opacity: 0; } }
        .about-marquee-1 { animation: marquee-bg 30s linear infinite; }
        .about-marquee-2 { animation: marquee-bg-r 38s linear infinite; }
      `}</style>

      <div className="absolute inset-0 flex flex-col justify-center overflow-hidden pointer-events-none select-none" style={{ opacity: 0.04 }}>
        <div className="about-marquee-1 whitespace-nowrap flex gap-16 mb-6">
          {[...marqueeWords, ...marqueeWords].map((w, i) => (
            <span key={i} className="font-black text-[7vw]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY, letterSpacing: "-0.03em" }}>
              {w} •
            </span>
          ))}
        </div>
        <div className="about-marquee-2 whitespace-nowrap flex gap-16">
          {[...marqueeWords, ...marqueeWords].reverse().map((w, i) => (
            <span key={i} className="font-black text-[7vw]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD, letterSpacing: "-0.03em" }}>
              {w} •
            </span>
          ))}
        </div>
      </div>

      {/* Soft radial glows */}
      <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full blur-[130px] opacity-50 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(245,166,35,0.1) 0%, transparent 70%)" }} />
      <div className="absolute bottom-0 left-[-5%] w-[500px] h-[500px] rounded-full blur-[100px] opacity-30 pointer-events-none" style={{ background: "radial-gradient(circle, rgba(27,42,74,0.06) 0%, transparent 70%)" }} />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 z-10">

        {/* ── SPLIT LAYOUT ── */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 mb-32 items-start">

          {/* ── LEFT: Typography + Video Button + Mission Card ── */}
          <FadeUp className="flex-1 w-full lg:sticky lg:top-32 self-start">

            {/* Label */}
            <div className="flex items-center gap-4 mb-10">
              <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "rgba(245,166,35,0.15)", color: GOLD }}>
                
              </span>
              <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>
                À Propos de nous
              </span>
            </div>

            {/* Headline */}
            <h2 className="mb-8 flex flex-col">
              <span
                className="font-black text-transparent leading-none"
                style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(3rem, 6vw, 4.5rem)", WebkitTextStroke: `1.5px ${NAVY}`, opacity: 0.7 }}
              >
                Qu'est-Ce Que
              </span>
              <span
                className="font-black leading-none mt-1"
                style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(3.5rem, 7vw, 5.5rem)", color: NAVY, letterSpacing: "-0.04em" }}
              >
                Yakoo Events ?
              </span>
            </h2>

            <p className="text-lg leading-relaxed mb-10 max-w-xl font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#5a6a8a" }}>
              {mission}
            </p>

            {/* ── Cinematic Video Button ── */}
            <div className="flex items-center gap-6 mb-12">
              <button
                onClick={() => setVideoOpen(true)}
                className="group relative flex items-center justify-center flex-shrink-0 w-20 h-20 rounded-full shadow-2xl transition-transform duration-500 hover:scale-110 focus:outline-none"
                style={{ background: NAVY }}
                aria-label="Voir la vidéo"
              >
                {/* Pulsing rings */}
                <span className="absolute inset-0 rounded-full" style={{ animation: "pulse-ring 2s ease-out infinite", border: `2px solid ${GOLD}` }} />
                <span className="absolute inset-0 rounded-full" style={{ animation: "pulse-ring 2s ease-out 0.7s infinite", border: `2px solid ${GOLD}` }} />
                <Play size={28} className="relative z-10 ml-1" style={{ color: GOLD }} fill={GOLD} />
              </button>
              <div>
                <p className="font-black text-base mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>
                  Voir la vidéo
                </p>
                <p className="text-sm font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#8b9bb4" }}>
                  Découvrez le parc en 90 secondes
                </p>
              </div>
            </div>

            {/* Mission Card */}
            <div
              className="relative p-8 md:p-10 rounded-[32px] max-w-lg shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(27,42,74,0.25)]"
              style={{ background: NAVY }}
            >
              <div className="absolute top-0 right-8 transform -translate-y-1/2">
                <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg" style={{ background: GOLD, color: NAVY }}>
                 
                </div>
              </div>
              <p className="text-base md:text-lg italic leading-relaxed font-medium mb-8" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.9)" }}>
                {vision.startsWith('"') ? vision : `"${vision}"`}
              </p>
              <div className="flex items-center gap-4">
                <div className="h-px w-10" style={{ background: "rgba(255,255,255,0.2)" }} />
                <span className="text-xs uppercase tracking-[0.2em] font-black" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                  Notre Mission
                </span>
              </div>
            </div>
          </FadeUp>

          {/* ── RIGHT: Bento Photo + Stat Collage ── */}
          <div className="flex-1 w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {bentoItems.map((item, i) =>
                item.type === "photo" ? (
                  <FadeUp key={i} delay={i * 0.1} className={i % 2 !== 0 ? "lg:mt-8" : ""}>
                    <div
                      className="group relative overflow-hidden rounded-[20px] sm:rounded-[28px] cursor-pointer"
                      style={{ height: "clamp(160px, 22vw, 260px)", background: "#0d1929", boxShadow: "0 20px 50px rgba(27,42,74,0.12)" }}
                    >
                      <img
                        src={item.img}
                        alt={item.label}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                        style={{ opacity: 0.88 }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(27,42,74,0.8) 0%, transparent 60%)" }} />
                      {/* Label */}
                      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6 flex items-center justify-between">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-widest" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#fff" }}>
                          {item.label}
                        </span>
                        <div
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                          style={{ background: GOLD, color: NAVY }}
                        >
                          <ArrowRight size={12} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </FadeUp>
                ) : (
                  <FadeUp key={i} delay={i * 0.1} className={i % 2 !== 0 ? "lg:mt-8" : ""}>
                    <div
                      className="group flex flex-col justify-center h-full min-h-[160px] sm:min-h-[260px] p-5 sm:p-8 rounded-[20px] sm:rounded-[28px] transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl cursor-default"
                      style={{ background: item.bg, boxShadow: "0 20px 40px rgba(27,42,74,0.07)" }}
                    >
                      <span
                        className="font-black leading-none mb-3 sm:mb-4"
                        style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(1.6rem, 4vw, 3.5rem)", color: item.color, letterSpacing: "-0.03em" }}
                      >
                        {item.value}
                      </span>
                      <span className="font-extrabold text-xs sm:text-sm mb-1 sm:mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: item.accent }}>
                        {item.label}
                      </span>
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider font-bold opacity-60" style={{ fontFamily: "'KG Red Hands', sans-serif", color: item.color }}>
                        {item.sub}
                      </span>
                    </div>
                  </FadeUp>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── PILLARS ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ABOUT_PILLARS.map(({ icon, title, desc }, i) => (
            <FadeUp key={title} delay={i * 0.1}>
              <div
                className="group relative rounded-[32px] p-8 bg-white h-full transition-all duration-500 hover:-translate-y-4"
                style={{ boxShadow: "0 10px 30px rgba(27,42,74,0.04)", border: "1px solid rgba(27,42,74,0.02)" }}
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  style={{ background: "rgba(27,42,74,0.04)" }}
                >
                  <span style={{ color: NAVY }}>{icon}</span>
                </div>
                <h3 className="font-black text-xl mb-4" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY, letterSpacing: "-0.02em" }}>
                  {title}
                </h3>
                <p className="text-sm leading-relaxed font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>
                  {desc}
                </p>
                <div
                  className="absolute bottom-0 left-8 right-8 h-1.5 rounded-t-full opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
                  style={{ background: GOLD }}
                />
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── VIDEO MODAL ── */}
      {videoOpen && createPortal(
        <AnimatePresence>
          <motion.div
            key="videoModal"
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setVideoOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0" style={{ background: "rgba(4,12,24,0.9)", backdropFilter: "blur(16px)" }} />
            
            {/* Modal Box */}
            <motion.div
              className="relative w-full max-w-4xl rounded-[32px] overflow-hidden shadow-2xl"
              initial={{ scale: 0.85, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ background: "#0d1929", aspectRatio: "16/9" }}
            >
              {/* Close button */}
              <button
                onClick={() => setVideoOpen(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
              >
                <X size={18} />
              </button>

              {/* Placeholder — swap src for a real video URL */}
              <div className="w-full h-full flex flex-col items-center justify-center gap-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: `${GOLD}20`, border: `2px solid ${GOLD}40` }}>
                  <Play size={40} style={{ color: GOLD }} fill={GOLD} className="ml-2" />
                </div>
                <p className="text-lg font-bold tracking-wide uppercase" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'KG Red Hands', sans-serif" }}>
                  Yakoo Events — La vidéo du parc
                </p>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'KG Red Hands', sans-serif" }}>
                  Intégrez votre URL YouTube/Vimeo ici
                </p>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}



// ─── Activity Modal ───────────────────────────────────────────────────────────

type Activity = {
  id: number | string;
  title: string;
  category: string;
  desc?: string;
  description?: string;
  img?: string;
  image_url?: string;
  duration?: string;
  minAge?: string;
  min_age?: string;
  maxPeople?: string | number;
  max_people?: number;
  highlights?: string[];
};

function ActivityModal({ activity, onClose }: { activity: Activity; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Backdrop */}
        <div className="absolute inset-0" style={{ background: "rgba(10,18,32,0.85)", backdropFilter: "blur(8px)" }} />

        {/* Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl overflow-y-auto"
          style={{ background: "#fff", boxShadow: "0 40px 100px rgba(0,0,0,0.5)" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image */}
          <div className="relative h-64 overflow-hidden" style={{ background: "#e8ecf2" }}>
            <img src={activity.img || activity.image_url || ""} alt={activity.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)" }} />

            {/* Category badge */}
            <span
              className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase"
              style={{ background: GOLD, color: NAVY, fontFamily: "'KG Red Hands', sans-serif" }}
            >
              {activity.category}
            </span>

            {/* Close button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", color: "#fff", backdropFilter: "blur(4px)" }}
            >
              <X size={18} />
            </motion.button>

            <h2
              className="absolute bottom-4 left-5 font-black text-white text-2xl"
              style={{ fontFamily: "'KG Red Hands', sans-serif" }}
            >
              {activity.title}
            </h2>
          </div>

          {/* Body */}
          <div className="p-7">
            {/* Meta pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: <Clock size={13} />, text: activity.duration ?? "2–4 heures" },
                { icon: <Users size={13} />, text: `Min. ${(activity.maxPeople || activity.max_people) ?? "10"} personnes` },
                { icon: <CheckCircle2 size={13} />, text: `Âge min. ${(activity.minAge || activity.min_age) ?? "6 ans"}` },
              ].map(({ icon, text }) => (
                <span
                  key={text}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                  style={{ background: "#F8F8F8", color: NAVY, fontFamily: "'KG Red Hands', sans-serif" }}
                >
                  <span style={{ color: GOLD }}>{icon}</span>
                  {text}
                </span>
              ))}
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#4a5568" }}>
              {activity.desc || activity.description || ""}
            </p>

            {/* Highlights */}
            <div className="mb-7">
              <h3 className="font-bold text-sm uppercase tracking-wider mb-3" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>
                Ce qui est inclus
              </h3>
              <ul className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-2">
                {(activity.highlights ?? ["Équipements fournis", "Encadrement professionnel", "Briefing sécurité", "Assurance incluse"]).map((h) => (
                  <li key={h} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#4a5568" }}>
                    <CheckCircle2 size={14} style={{ color: GOLD, flexShrink: 0 }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Button href="#reservation" onClick={onClose} icon={ArrowRight} className="flex-1">
                Réserver maintenant
              </Button>
              <Button variant="outline" onClick={onClose} className="border-[rgba(27,42,74,0.15)]" >
                Fermer
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

// ─── Activities ───────────────────────────────────────────────────────────────
const ACTIVITIES: Activity[] = [
  {
    id: 1, title: "Accrobranche", category: "Aventure",
    desc: "Parcours acrobatiques dans les arbres pour petits et grands. Sensations fortes garanties en pleine forêt tunisienne. Plusieurs niveaux de difficulté adaptés à tous.",
    img: "https://images.unsplash.com/photo-1648853070657-6d58398bee93?w=600&h=400&fit=crop&auto=format",
    duration: "2–3 heures", minAge: "6 ans", maxPeople: "8",
    highlights: ["Équipements fournis", "Encadrement certifié", "Plusieurs niveaux", "Assurance incluse"],
  },
  {
    id: 2, title: "Kayak", category: "Aventure",
    desc: "Descendez les rapides ou explorez des eaux calmes. Une aventure aquatique mémorable en pleine nature. Idéal pour renforcer la cohésion et partager des moments inoubliables.",
    img: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?w=600&h=400&fit=crop&auto=format",
    duration: "1–3 heures", minAge: "8 ans", maxPeople: "6",
    highlights: ["Kayaks fournis", "Gilets de sauvetage", "Guide accompagnateur", "Photos souvenir"],
  },
  {
    id: 3, title: "Paintball", category: "Aventure",
    desc: "Affrontez vos amis ou collègues dans une partie de paintball épique au cœur du parc. Stratégie, adrénaline et bonne humeur au rendez-vous.",
    img: "https://images.unsplash.com/photo-1774599661355-327e322f53c2?w=600&h=400&fit=crop&auto=format",
    duration: "1–2 heures", minAge: "12 ans", maxPeople: "10",
    highlights: ["Masques protecteurs", "Combinaisons fournies", "Munitions incluses", "Arbitrage professionnel"],
  },
  {
    id: 4, title: "Tyrolienne", category: "Aventure",
    desc: "Glissez à toute vitesse suspendu entre les arbres et découvrez le parc depuis les hauteurs. La tyrolienne offre une vue imprenable et des sensations uniques.",
    img: "https://images.unsplash.com/photo-1637511077877-3c6a00eb32ba?w=600&h=400&fit=crop&auto=format",
    duration: "1 heure", minAge: "6 ans", maxPeople: "1",
    highlights: ["Harnais certifié", "Contrôle sécurité", "Briefing obligatoire", "Photos en vol"],
  },
  {
    id: 5, title: "Mur d'escalade", category: "Aventure",
    desc: "Dépassez vos limites sur notre mur d'escalade intérieur et extérieur. Activité ouverte à tous les niveaux avec un encadrement expert et bienveillant.",
    img: "https://images.unsplash.com/photo-1624410722888-eeb4f0c99905?w=600&h=400&fit=crop&auto=format",
    duration: "1–2 heures", minAge: "5 ans", maxPeople: "4",
    highlights: ["Chaussons fournis", "Baudrier inclus", "Initiation disponible", "Moniteur certifié"],
  },
  {
    id: 6, title: "Tir à l'arc", category: "Aventure",
    desc: "Précision et concentration au programme. Le tir à l'arc est idéal pour tous les âges. Initiation et perfectionnement assurés par nos instructeurs qualifiés.",
    img: "https://images.unsplash.com/photo-1771525552094-ce394cf95343?w=600&h=400&fit=crop&auto=format",
    duration: "1 heure", minAge: "6 ans", maxPeople: "8",
    highlights: ["Arcs et flèches fournis", "Cibles homologuées", "Instructeur qualifié", "Zones sécurisées"],
  },
  {
    id: 7, title: "Team Building Jeux", category: "Team Building",
    desc: "Renforcez la cohésion de votre équipe avec nos jeux collectifs conçus par des experts en dynamique de groupe. Engagement garanti pour tous les participants.",
    img: "https://images.unsplash.com/photo-1780733063138-8a847437ab96?w=600&h=400&fit=crop&auto=format",
    duration: "3–4 heures", minAge: "16 ans", maxPeople: "20",
    highlights: ["Animateur dédié", "Jeux personnalisés", "Bilan de cohésion", "Certificat participation"],
  },
  {
    id: 8, title: "Séminaire", category: "Scientifiques",
    desc: "Organisez vos séminaires dans un cadre verdoyant et inspirant loin du stress urbain. Nos espaces sont équipés pour accueillir toutes tailles de groupes.",
    img: "https://images.unsplash.com/photo-1780733066784-64ae88196345?w=600&h=400&fit=crop&auto=format",
    duration: "Journée entière", minAge: "Tout âge", maxPeople: "50",
    highlights: ["Vidéoprojecteur", "Connexion Wi-Fi", "Restauration disponible", "Parking gratuit"],
  },
  {
    id: 9, title: "Dortoire", category: "Hébergement & Camping",
    desc: "Hébergement collectif confortable pour vos groupes. Nuitées en pleine nature avec tout le confort nécessaire pour une retraite professionnelle ou scolaire réussie.",
    img: "https://images.unsplash.com/photo-1758272959533-201492a5d36c?w=600&h=400&fit=crop&auto=format",
    duration: "Nuit", minAge: "Tout âge", maxPeople: "30",
    highlights: ["Lits superposés", "Sanitaires communs", "Draps inclus", "Sécurité 24h/24"],
  },
  {
    id: 10, title: "Tentes", category: "Hébergement & Camping",
    desc: "Camping sous tentes avec équipements fournis. Vivez l'expérience authentique de la nuit en forêt dans un environnement sécurisé et encadré par nos équipes.",
    img: "https://images.unsplash.com/photo-1668784730042-fce64ac09628?w=600&h=400&fit=crop&auto=format",
    duration: "Nuit", minAge: "Tout âge", maxPeople: "20",
    highlights: ["Tentes fournies", "Sacs de couchage", "Éclairage inclus", "Feu de camp"],
  },
  {
    id: 11, title: "Animation et clown", category: "Anniversaires",
    desc: "Animations festives pour anniversaires et événements familiaux. Spectacles personnalisés pour l'occasion avec des artistes professionnels et créatifs.",
    img: "https://images.unsplash.com/photo-1531204709756-1c7a41bf8936?w=600&h=400&fit=crop&auto=format",
    duration: "1–2 heures", minAge: "3 ans", maxPeople: "30",
    highlights: ["Spectacle personnalisé", "Maquillage artistique", "Jeux interactifs", "Photos incluses"],
  },
  {
    id: 12, title: "Conférences & fêtes", category: "Centre de formation",
    desc: "Espaces dédiés aux conférences, formations et célébrations de toute nature. Infrastructure moderne et modulable au cœur de la nature pour des événements mémorables.",
    img: "https://images.unsplash.com/photo-1536639070539-43ec572aca6d?w=600&h=400&fit=crop&auto=format",
    duration: "Sur mesure", minAge: "Tout âge", maxPeople: "100",
    highlights: ["Salle modulable", "Équipement son/lumière", "Service traiteur", "Coordination événement"],
  },
];

const CATEGORIES = [
  { label: "Tous",                  count: 22 },
  { label: "Aventure",              count: 6 },
  { label: "Team Building",         count: 7 },
  { label: "Hébergement & Camping", count: 3 },
  { label: "Scientifiques",         count: 2 },
  { label: "Centre de formation",   count: 2 },
  { label: "Anniversaires",         count: 2 },
];

// Colour accent per category
const CAT_COLOR: Record<string, string> = {
  "Aventure": "#f97316",
  "Team Building": "#22c55e",
  "Hébergement & Camping": "#38bdf8",
  "Scientifiques": "#a78bfa",
  "Centre de formation": "#e879f9",
  "Anniversaires": "#fb7185",
  "Tous": GOLD,
};

function Activities() {
  const [active, setActive]   = useState("Tous");
  const [selected, setSelected] = useState<Activity | null>(null);
  const [activities, setActivities] = useState<Activity[]>(ACTIVITIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      const { data, error } = await supabase.from('activities').select('*');
      if (!error && data && data.length > 0) {
        setActivities(data);
      }
      setLoading(false);
    };
    fetchActivities();
  }, []);

  const filtered = active === "Tous" ? activities : activities.filter((a) => a.category === active);
  const accent   = CAT_COLOR[active] ?? GOLD;

  return (
    <section id="activites" className="relative overflow-hidden" style={{ background: "#07101f" }}>
      {/* Background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full blur-[160px] opacity-[0.12] pointer-events-none transition-colors duration-700"
        style={{ background: accent }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-20">
        <Reveal>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
              Nos <span style={{ color: GOLD }}>Activités</span>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: TEXT_MUTED }}>
              Découvrez une gamme complète d'expériences conçues pour tous les âges et toutes les envies.
            </p>
          </div>
        </Reveal>

        {/* Categories */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {CATEGORIES.map((cat) => {
              const isSelected = active === cat.label;
              const color = CAT_COLOR[cat.label] ?? GOLD;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActive(cat.label)}
                  className="px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 backdrop-blur-sm"
                  style={{
                    color: isSelected ? "#0F1C30" : "white",
                    background: isSelected ? color : "rgba(255,255,255,0.05)",
                    border: `1px solid ${isSelected ? color : "rgba(255,255,255,0.1)"}`,
                    boxShadow: isSelected ? `0 0 20px ${color}40` : "none",
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-white py-10">Chargement des activités...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white py-10">Aucune activité trouvée.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((act, i) => (
              <Reveal key={act.id} delay={0.1 * i}>
                <div
                  className="group relative rounded-2xl overflow-hidden cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  onClick={() => setSelected(act)}
                >
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={act.img || act.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"}
                      alt={act.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C30] via-[#0F1C30]/40 to-transparent" />
                    
                    {/* Badge */}
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide"
                      style={{ background: CAT_COLOR[act.category] ?? GOLD, color: "#0F1C30" }}
                    >
                      {act.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-[#F5A623] transition-colors">
                      {act.title}
                    </h3>
                    <p className="text-sm line-clamp-2 mb-6" style={{ color: TEXT_MUTED }}>
                      {act.desc || act.description || ""}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs font-medium border-t pt-4" style={{ borderColor: "rgba(255,255,255,0.1)", color: "#9BA3AF" }}>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} style={{ color: GOLD }} />
                        {act.duration || "N/A"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users size={14} style={{ color: GOLD }} />
                        Jusqu'à {(act.maxPeople || act.max_people) || "N/A"}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={14} style={{ color: GOLD }} />
                        {(act.minAge || act.min_age) || "N/A"}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div
            className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl flex flex-col md:flex-row"
            style={{ background: "#0F1C30", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            {/* Close */}
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 text-white hover:bg-[#F5A623] hover:text-[#0F1C30] transition-colors"
            >
              <X size={20} />
            </button>

            {/* Image Side */}
            <div className="w-full md:w-2/5 h-64 md:h-auto relative">
              <img src={selected.img || selected.image_url || "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4"} alt={selected.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C30] md:bg-gradient-to-r md:from-transparent md:to-[#0F1C30]" />
              <div
                className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg"
                style={{ background: CAT_COLOR[selected.category] ?? GOLD, color: "#0F1C30" }}
              >
                {selected.category}
              </div>
            </div>

            {/* Content Side */}
            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                {selected.title}
              </h3>
              <p className="text-base leading-relaxed mb-8" style={{ color: TEXT_MUTED }}>
                {selected.desc || selected.description || ""}
              </p>

              {/* Highlights */}
              <div className="space-y-3 mb-8">
                {selected.highlights && selected.highlights.length > 0 ? selected.highlights.map((h, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="mt-1"><CheckCircle2 size={16} style={{ color: GOLD }} /></div>
                    <p className="text-sm text-gray-300">{h}</p>
                  </div>
                )) : (
                  <div className="text-sm text-gray-300">Aucun point fort spécifié.</div>
                )}
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-3 gap-4 mb-10 p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>Durée</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Clock size={14} style={{ color: GOLD }} /> {selected.duration || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>Capacité</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <Users size={14} style={{ color: GOLD }} /> Jusqu'à {(selected.maxPeople || selected.max_people) || "N/A"}
                  </div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-wider mb-1" style={{ color: "#6B7A99" }}>Âge Min</div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <User size={14} style={{ color: GOLD }} /> {(selected.minAge || selected.min_age) || "N/A"}
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                className="w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{ background: GOLD, color: "#0F1C30", boxShadow: `0 10px 25px ${GOLD}40` }}
                onClick={() => { setSelected(null); window.location.hash = "reservation"; }}
              >
                Réserver cette activité <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}


const PACKS_DATA = [
  {
    tier: "SILVER",
    tagline: "L'essentiel pour s'amuser",
    color: "#94a3b8",
    gradientFrom: "#94a3b8",
    gradientTo: "#cbd5e1",
    gamesCount: 3,
    acro: "+",
    badge: null,
    features: [
      { label: "3 jeux de team building", included: true },
      { label: "Accrobranche", included: true },
      { label: "Tyrolienne", included: true },
      { label: "Déjeuner inclus", included: false },
      { label: "Photographe", included: false },
      { label: "Animateur dédié", included: false },
    ],
  },
  {
    tier: "GOLD",
    tagline: "L'expérience complète",
    color: "#F5A623",
    gradientFrom: "#F5A623",
    gradientTo: "#f59e0b",
    gamesCount: 5,
    acro: "+",
    badge: "POPULAIRE",
    features: [
      { label: "5 jeux de team building", included: true },
      { label: "Accrobranche", included: true },
      { label: "Tyrolienne", included: true },
      { label: "Déjeuner inclus", included: true },
      { label: "Photographe", included: true },
      { label: "Animateur dédié", included: false },
    ],
  },
  {
    tier: "PLATINUM",
    tagline: "Le pack premium tout inclus",
    color: "#a78bfa",
    gradientFrom: "#a78bfa",
    gradientTo: "#c084fc",
    gamesCount: 8,
    acro: "+",
    badge: "PREMIUM",
    features: [
      { label: "8 jeux de team building", included: true },
      { label: "Accrobranche", included: true },
      { label: "Tyrolienne", included: true },
      { label: "Déjeuner inclus", included: true },
      { label: "Photographe", included: true },
      { label: "Animateur dédié", included: true },
    ],
  },
];

function Packs() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [packsData, setPacksData] = useState<any[]>(PACKS_DATA);

  useEffect(() => {
    const fetchPacks = async () => {
      const { data } = await supabase.from('packs').select('*').order('price', { ascending: true });
      if (data && data.length > 0) {
        // Merge with static styles based on tier name
        const styles: Record<string, any> = {
          "SILVER": { color: "#94a3b8", gradientFrom: "#94a3b8", gradientTo: "#cbd5e1" },
          "GOLD": { color: "#F5A623", gradientFrom: "#F5A623", gradientTo: "#f59e0b" },
          "PLATINUM": { color: "#3B82F6", gradientFrom: "#3B82F6", gradientTo: "#60A5FA" }
        };
        const mappedPacks = data.map(p => {
          const s = styles[p.tier.toUpperCase()] || { color: "#FFF", gradientFrom: "#444", gradientTo: "#888" };
          return {
            tier: p.tier.toUpperCase(),
            tagline: p.tagline,
            color: s.color,
            gradientFrom: s.gradientFrom,
            gradientTo: s.gradientTo,
            price: p.price,
            gamesCount: p.games_count || 0,
            acro: "+",
            description: p.description,
            badge: p.badge || null,
            features: Array.isArray(p.features) ? p.features : []
          };
        });
        setPacksData(mappedPacks);
      } else {
        setPacksData(PACKS_DATA); // fallback to original static data if db empty
      }
    };
    fetchPacks();
  }, []);

  return (
    <section id="packs" className="py-32 relative overflow-hidden" style={{ background: "#07101f" }}>
      {/* Background grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "48px 48px" }} />
      
      {/* Radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] rounded-full opacity-[0.07] blur-[100px] pointer-events-none" style={{ background: GOLD }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05] blur-[80px] pointer-events-none" style={{ background: "#a78bfa" }} />

      <div className="relative max-w-7xl mx-auto px-6 z-10">

        {/* ── Header ── */}
        <FadeUp className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b pb-12" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12" style={{ background: GOLD }} />
                <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD, fontFamily: "'KG Red Hands', sans-serif" }}>
                  Nos offres sur mesure
                </span>
              </div>
              <h2 className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(3.5rem, 8vw, 6rem)", color: "#fff", letterSpacing: "-0.04em" }}>
                Choisissez{" "}
                <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}>votre Pack</span>
              </h2>
            </div>
            
          </div>
        </FadeUp>

        {/* ── Pack Cards ── */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {packsData.map((pack, i) => {
            const isHov = hovered === pack.tier;
            const isGold = pack.tier === "GOLD";

            return (
              <FadeUp key={pack.tier} delay={i * 0.12}>
                <motion.div
                  onHoverStart={() => setHovered(pack.tier)}
                  onHoverEnd={() => setHovered(null)}
                  animate={{ y: isHov ? -12 : 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="relative flex flex-col rounded-[32px] overflow-hidden cursor-default"
                  style={{
                    background: isGold ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                    border: isHov
                      ? `1.5px solid ${pack.color}`
                      : isGold
                      ? `1.5px solid ${pack.color}60`
                      : "1.5px solid rgba(255,255,255,0.06)",
                    boxShadow: isHov ? `0 40px 80px -20px ${pack.color}40` : isGold ? `0 20px 60px -20px ${pack.color}25` : "none",
                  }}
                >
                  {/* Popular badge */}
                  {pack.badge && (
                    <div className="absolute top-5 right-5 z-10">
                      <span
                        className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider"
                        style={{ background: pack.color, color: isGold ? NAVY : "#fff", fontFamily: "'KG Red Hands', sans-serif" }}
                      >
                        {pack.badge}
                      </span>
                    </div>
                  )}

                  {/* Top colour band */}
                  <div
                    className="relative h-2 w-full flex-shrink-0"
                    style={{ background: `linear-gradient(90deg, ${pack.gradientFrom}, ${pack.gradientTo})` }}
                  />

                  {/* Card Body */}
                  <div className="p-8 flex flex-col flex-1">

                    {/* Tier label */}
                    <div className="flex items-start justify-between mb-8">
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-2" style={{ color: pack.color, fontFamily: "'KG Red Hands', sans-serif" }}>
                          Pack
                        </p>
                        <h3 className="font-black text-5xl leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#fff", letterSpacing: "-0.04em" }}>
                          {pack.tier}
                        </h3>
                        <p className="text-sm mt-2 font-medium" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'KG Red Hands', sans-serif" }}>
                          {pack.tagline}
                        </p>
                      </div>

                      {/* Big number accent */}
                      <div className="text-right flex-shrink-0">
                        <span className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "4rem", color: pack.color, opacity: 0.15 }}>
                          {pack.gamesCount}
                        </span>
                      </div>
                    </div>

                    {/* Activities chips */}
                    <div className="mb-6">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: pack.color, fontFamily: "'KG Red Hands', sans-serif" }}>
                        {pack.gamesCount > 0 ? `${pack.gamesCount} activités incluses` : "Activités incluses"}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(pack.description || "Accrobranche + Tyrolienne").split(" + ").filter(Boolean).map((act) => (
                          <span
                            key={act}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold"
                            style={{
                              background: `${pack.color}18`,
                              border: `1px solid ${pack.color}35`,
                              color: pack.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: pack.color }} />
                            {act.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Feature list */}
                    <ul className="flex flex-col gap-3 flex-1 mb-8">
                      {pack.features.map((f) => (
                        <li
                          key={f.label}
                          className="flex items-center gap-3 text-sm"
                          style={{
                            fontFamily: "'KG Red Hands', sans-serif",
                            color: f.included ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)",
                          }}
                        >
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
                            style={{
                              background: f.included ? `${pack.color}18` : "transparent",
                              color: f.included ? pack.color : "rgba(255,255,255,0.15)",
                              border: f.included ? `1px solid ${pack.color}40` : "1px solid rgba(255,255,255,0.08)",
                            }}
                          >
                            {f.included ? "✓" : "—"}
                          </span>
                          <span style={{ textDecoration: f.included ? "none" : "line-through" }}>{f.label}</span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <motion.a
                      href="#reservation"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl font-black text-sm text-center block tracking-widest uppercase"
                      style={{
                        fontFamily: "'KG Red Hands', sans-serif",
                        background: isHov || isGold
                          ? `linear-gradient(135deg, ${pack.gradientFrom}, ${pack.gradientTo})`
                          : "rgba(255,255,255,0.06)",
                        color: (isHov || isGold) ? (pack.tier === "GOLD" ? NAVY : "#fff") : "rgba(255,255,255,0.4)",
                        boxShadow: (isHov || isGold) ? `0 12px 32px ${pack.color}40` : "none",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Réserver ce pack
                    </motion.a>
                  </div>
                </motion.div>
              </FadeUp>
            );
          })}
        </div>

        {/* ── Bottom note ── */}
        <FadeUp delay={0.4} className="text-center mt-14">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
            <p className="text-xs font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.45)" }}>
              Tous les packs incluent l'encadrement professionnel, les équipements et la sécurité · Groupe minimum 20 personnes
            </p>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}







// ─── Reservation ──────────────────────────────────────────────────────────────
const ACTIVITY_OPTIONS = [
  "Accrobranche", "Kayak", "Paintball", "Tyrolienne", "Mur d'escalade", "Geo-searching",
  "Tir à l'arc", "Jeu d'entonnoire", "Billards Japonais", "Twister Géant", "Jeu d'équilibre",
  "Atelier Robotique", "Jeu d'écrou", "Jeux des fléchettes", "Jeux de labyrinthe", "Séminaire",
  "Dortoire", "Espace en nature", "Animation et clown", "Tentes", "Lit pliable", "Conférences & fêtes",
];

const STEPS = ["Activité", "Groupe & Date", "Vos infos"];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-[11px] font-bold tracking-[0.18em] uppercase"
        style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.62)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls: React.CSSProperties = {
  fontFamily: "'KG Red Hands', sans-serif",
  background: "rgba(255,255,255,0.05)",
  border: "1.5px solid rgba(255,255,255,0.1)",
  borderRadius: "14px",
  color: "#fff",
  padding: "13px 16px",
  outline: "none",
  width: "100%",
  fontSize: "14px",
  transition: "border-color 0.2s",
};

function Reservation() {
  const [step, setStep]         = useState(0);
  const [activity, setActivity] = useState("");
  const [people, setPeople]     = useState(20);
  const [date, setDate]         = useState("");
  const [name, setName]         = useState("");
  const [phone, setPhone]       = useState("");
  const [message, setMessage]   = useState("");
  const [submitted, setSubmitted] = useState(false);

  const canNext = [
    activity !== "",
    people >= 1 && date !== "",
    name !== "" && phone !== "",
  ];

  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleSubmit = async () => {
    setIsSubmitting(true);
    const { error } = await supabase.from('reservations').insert({
      activity_name: activity,
      group_size: people,
      reservation_date: date,
      contact_name: name,
      contact_phone: phone,
      notes: message,
      status: 'pending'
    });
    
    setIsSubmitting(false);
    
    if (!error) {
      setSubmitted(true);
    } else {
      alert("Erreur lors de l'envoi de la réservation: " + error.message);
    }
  };


  return (
    <section
      id="reservation"
      className="relative overflow-hidden"
      style={{ background: "#07101f" }}
    >
      {/* Gold ambient glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[160px] opacity-[0.07] pointer-events-none"
        style={{ background: GOLD }}
      />
      <div
        className="absolute top-0 left-0 w-[400px] h-[300px] rounded-full blur-[120px] opacity-[0.05] pointer-events-none"
        style={{ background: "#4ade80" }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-[1fr_500px] gap-10 lg:gap-16 items-start">

          {/* ── LEFT: info panel ── */}
          <FadeUp className="flex flex-col gap-12 lg:sticky lg:top-32 self-start">

            {/* Label + heading */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center justify-center w-10 h-10 rounded-full" style={{ background: "rgba(245,166,35,0.15)", color: GOLD }}>
                  
                </span>
                <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                  Prendre rendez-vous
                </span>
              </div>
              
              <h2 className="mb-6 flex flex-col">
                <span 
                  className="font-black text-transparent leading-none" 
                  style={{ 
                    fontFamily: "'KG Red Hands', sans-serif", 
                    fontSize: "clamp(3rem, 5vw, 4rem)", 
                    WebkitTextStroke: `1.5px rgba(255,255,255,0.4)`,
                    opacity: 0.9
                  }}
                >
                  Réservez
                </span>
                <span 
                  className="font-black leading-none mt-1" 
                  style={{ 
                    fontFamily: "'KG Red Hands', sans-serif", 
                    fontSize: "clamp(3.5rem, 6vw, 4.8rem)", 
                    color: "#fff", 
                    letterSpacing: "-0.04em" 
                  }}
                >
                  votre aventure
                </span>
              </h2>
              
              <p className="text-lg leading-relaxed font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)", maxWidth: "420px" }}>
                Remplissez le formulaire en 3 étapes simples. Notre équipe vous contacte sous 24h pour confirmer.
              </p>
            </div>

           

            {/* Direct contact card */}
            
          </FadeUp>


          {/* ── RIGHT: stepped form ── */}
          <FadeUp delay={0.15}>
            <AnimatePresence mode="wait">
              {submitted ? (
                /* Success state */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.88, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-3xl flex flex-col items-center justify-center text-center p-14"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", minHeight: "500px" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.2 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
                    style={{ background: `rgba(245,166,35,0.12)`, border: `2px solid ${GOLD}40` }}
                  >
                    <CheckCircle2 size={36} style={{ color: GOLD }} />
                  </motion.div>
                  <h3 className="font-black text-3xl text-white mb-3" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
                    C'est réservé !
                  </h3>
                  <p className="text-sm mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.65)", maxWidth: "280px" }}>
                    Votre demande pour <strong style={{ color: GOLD }}>{activity}</strong> a bien été enregistrée.
                  </p>
                  <p className="text-xs mb-8" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.3)" }}>
                    Nous vous contacterons sous 24h au {phone || "votre numéro"}.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { setSubmitted(false); setStep(0); setActivity(""); setDate(""); setName(""); setPhone(""); setMessage(""); }}
                    className="px-7 py-3 rounded-xl font-bold text-sm"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY }}
                  >
                    Nouvelle réservation
                  </motion.button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  className="rounded-3xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  {/* Step indicator */}
                  <div
                    className="px-7 pt-7 pb-5"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex items-center gap-0">
                      {STEPS.map((s, i) => {
                        const done    = i < step;
                        const current = i === step;
                        return (
                          <div key={s} className="flex items-center flex-1 last:flex-none">
                            <div className="flex flex-col items-center gap-1.5">
                              <motion.div
                                animate={{
                                  background: done ? GOLD : current ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.06)",
                                  borderColor: done || current ? GOLD : "rgba(255,255,255,0.1)",
                                }}
                                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2"
                                style={{ fontFamily: "'KG Red Hands', sans-serif", color: done ? NAVY : current ? GOLD : "rgba(255,255,255,0.3)" }}
                              >
                                {done ? "✓" : i + 1}
                              </motion.div>
                              <span
                                className="text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap"
                                style={{ fontFamily: "'KG Red Hands', sans-serif", color: current ? GOLD : done ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.2)" }}
                              >
                                {s}
                              </span>
                            </div>
                            {i < STEPS.length - 1 && (
                              <div className="flex-1 mx-2 h-px mb-5" style={{ background: i < step ? GOLD : "rgba(255,255,255,0.08)" }} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step content */}
                  <div className="p-7">
                    <AnimatePresence mode="wait">

                      {/* Step 0 — Pick activity */}
                      {step === 0 && (
                        <motion.div
                          key="step0"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col gap-5"
                        >
                          <div>
                            <h3 className="font-black text-xl text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>Quelle activité ?</h3>
                            <p className="text-xs" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>Choisissez parmi nos 22 activités disponibles</p>
                          </div>

                          {/* Activity grid selector */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
                            {ACTIVITY_OPTIONS.map((opt) => {
                              const isSelected = activity === opt;
                              return (
                                <motion.button
                                  key={opt}
                                  type="button"
                                  whileHover={{ background: isSelected ? `rgba(245,166,35,0.15)` : "rgba(255,255,255,0.06)" }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setActivity(opt)}
                                  className="flex items-center justify-between w-full rounded-xl text-sm font-semibold transition-all overflow-hidden"
                                  style={{
                                    padding: "14px 18px",
                                    fontFamily: "'KG Red Hands', sans-serif",
                                    background: isSelected ? `rgba(245,166,35,0.12)` : "rgba(255,255,255,0.03)",
                                    border: `1.5px solid ${isSelected ? GOLD : "rgba(255,255,255,0.06)"}`,
                                    color: isSelected ? GOLD : "rgba(255,255,255,0.65)",
                                    boxShadow: isSelected ? `0 4px 12px rgba(245,166,35,0.1)` : "none"
                                  }}
                                >
                                  <span className="truncate text-left">{opt}</span>
                                  {/* Custom Radio Indicator */}
                                  <div 
                                    className="w-4 h-4 rounded-full flex-shrink-0 transition-colors flex items-center justify-center ml-3" 
                                    style={{ 
                                      border: `1.5px solid ${isSelected ? GOLD : "rgba(255,255,255,0.2)"}`,
                                      background: isSelected ? GOLD : "transparent" 
                                    }} 
                                  >
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#07101f" }} />}
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* Step 1 — Group & date */}
                      {step === 1 && (
                        <motion.div
                          key="step1"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col gap-6"
                        >
                          <div>
                            <h3 className="font-black text-xl text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>Groupe & date</h3>
                            <p className="text-xs" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>
                              Activité choisie : <span style={{ color: GOLD }}>{activity}</span>
                            </p>
                          </div>

                          {/* People stepper */}
                          <Field label="Nombre de personnes">
                            <div
                              className="flex items-center rounded-2xl overflow-hidden"
                              style={{ border: "1.5px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.05)" }}
                            >
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => setPeople(Math.max(1, people - 1))}
                                className="px-5 py-4 text-xl font-bold transition-colors hover:bg-white/10"
                                style={{ color: "rgba(255,255,255,0.5)" }}
                              >
                                −
                              </motion.button>
                              <div className="flex-1 text-center">
                                <span className="font-black text-2xl text-white" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>{people}</span>
                                <p className="text-[10px]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.3)" }}>personnes</p>
                              </div>
                              <motion.button
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => setPeople(people + 1)}
                                className="px-5 py-4 text-xl font-bold transition-colors hover:bg-white/10"
                                style={{ color: GOLD }}
                              >
                                +
                              </motion.button>
                            </div>
                            <div className="flex justify-between text-[10px] px-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.25)" }}>
                              <span>Min. 1 personne</span>
                              <span>Groupe recommandé : 20+</span>
                            </div>
                          </Field>

                          <Field label="Date souhaitée">
                            <input
                              type="date"
                              value={date}
                              onChange={(e) => setDate(e.target.value)}
                              style={inputCls}
                            />
                          </Field>
                        </motion.div>
                      )}

                      {/* Step 2 — Contact info */}
                      {step === 2 && (
                        <motion.div
                          key="step2"
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -30 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="flex flex-col gap-5"
                        >
                          <div>
                            <h3 className="font-black text-xl text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>Vos coordonnées</h3>
                            <p className="text-xs" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>
                              {activity} · {people} pers. · {date || "date à confirmer"}
                            </p>
                          </div>

                          <Field label="Nom complet">
                            <input type="text" placeholder="Votre nom" value={name} onChange={(e) => setName(e.target.value)} style={inputCls} />
                          </Field>
                          <Field label="Téléphone">
                            <input type="tel" placeholder="+216 XX XXX XXX" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputCls} />
                          </Field>
                          <Field label="Message (optionnel)">
                            <textarea
                              rows={3}
                              placeholder="Précisions, demandes spéciales..."
                              value={message}
                              onChange={(e) => setMessage(e.target.value)}
                              style={{ ...inputCls, resize: "none" }}
                            />
                          </Field>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Navigation buttons */}
                    <div className="flex gap-3 mt-7">
                      {step > 0 && (
                        <Button
                          variant="secondary"
                          onClick={() => setStep(step - 1)}
                          className="flex-shrink-0"
                        >
                          ← Retour
                        </Button>
                      )}
                      <motion.button
                        whileHover={canNext[step] ? { scale: 1.02, boxShadow: `0 8px 28px rgba(245,166,35,0.4)` } : {}}
                        whileTap={canNext[step] ? { scale: 0.97 } : {}}
                        type="button"
                        disabled={!canNext[step]}
                        onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : handleSubmit()}
                        className="group flex-1 py-3 rounded-[2rem] font-bold text-sm flex items-center justify-center gap-3 transition-all"
                        style={{
                          fontFamily: "'KG Red Hands', sans-serif",
                          background: canNext[step] ? GOLD : "rgba(245,166,35,0.15)",
                          color: canNext[step] ? NAVY : "rgba(245,166,35,0.4)",
                          cursor: canNext[step] ? "pointer" : "not-allowed",
                        }}
                      >
                        {step < STEPS.length - 1 ? (
                          <>
                            <span>Étape suivante</span>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:translate-x-1" style={{ background: "rgba(4,12,24,0.12)" }}>
                              <ArrowRight size={15} />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(4,12,24,0.12)" }}>
                              <CheckCircle2 size={15} />
                            </div>
                            <span>Confirmer la réservation</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    name: "Sana Belhadj", role: "Directrice RH", company: "TechTunis",
    activity: "Team Building", stars: 5,
    text: "Une expérience de team building absolument incroyable ! L'équipe de Yakoo Events a su créer une ambiance exceptionnelle. Nos collaborateurs en parlent encore des mois après.",
    img: "https://images.unsplash.com/photo-1531204709756-1c7a41bf8936?w=120&h=120&fit=crop&auto=format",
    color: "#22c55e",
  },
  {
    name: "Karim Mansouri", role: "Gérant", company: "EventPro Maghreb",
    activity: "Séminaire", stars: 5,
    text: "Le cadre naturel est magnifique, les infrastructures sont impeccables, et le staff vraiment aux petits soins. Notre séminaire annuel fut une vraie réussite. Nous reviendrons !",
    img: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=120&h=120&fit=crop&auto=format",
    color: "#38bdf8",
  },
  {
    name: "Leïla Trabelsi", role: "Cliente particulière", company: "Anniversaire enfants",
    activity: "Animation", stars: 5,
    text: "Un endroit magique pour les anniversaires enfants ! L'animation était top, les activités adaptées à tous les âges. Mes enfants ont adoré l'accrobranche et le tir à l'arc.",
    img: "https://images.unsplash.com/photo-1637511077877-3c6a00eb32ba?w=120&h=120&fit=crop&auto=format",
    color: "#fb7185",
  },
  {
    name: "Mehdi Chaabane", role: "Chef de projet", company: "BuildTech Tunis",
    activity: "Accrobranche", stars: 5,
    text: "Journée parfaite avec toute l'équipe ! L'accrobranche était le clou du spectacle. Encadrement sérieux, ambiance décontractée. On repart avec des souvenirs plein la tête.",
    img: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?w=120&h=120&fit=crop&auto=format",
    color: "#f97316",
  },
  {
    name: "Amira Khelifi", role: "Enseignante", company: "École primaire Tunis",
    activity: "Tir à l'arc", stars: 5,
    text: "Sortie scolaire inoubliable ! Les enfants ont adoré le tir à l'arc et les jeux en pleine nature. Le personnel est patient et pédagogique. Je recommande vivement à tous les établissements.",
    img: "https://images.unsplash.com/photo-1771525552094-ce394cf95343?w=120&h=120&fit=crop&auto=format",
    color: "#a78bfa",
  },
];

// ─── Leave a review modal ────────────────────────────────────────────────────
function ReviewModal({ onClose }: { onClose: () => void }) {
  const [rName, setRName]       = useState("");
  const [rActivity, setRActivity] = useState("");
  const [rStars, setRStars]     = useState(0);
  const [hoverStar, setHoverStar] = useState(0);
  const [rText, setRText]       = useState("");
  const [done, setDone]         = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", esc);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", esc); };
  }, [onClose]);

  const canSubmit = rName && rStars > 0 && rText.length >= 20;

  return (
    createPortal(<motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: "rgba(5,11,22,0.80)", backdropFilter: "blur(10px)" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: "#fff", boxShadow: "0 40px 100px rgba(0,0,0,0.4)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top coloured band */}
        <div className="h-1.5" style={{ background: `linear-gradient(to right, ${GOLD}, #f97316)` }} />

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center p-12"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
                style={{ background: `rgba(245,166,35,0.1)`, border: `2px solid ${GOLD}30` }}
              >
                <Star size={34} fill={GOLD} color={GOLD} />
              </motion.div>
              <h3 className="font-black text-2xl mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>Merci {rName} !</h3>
              <p className="text-sm mb-7" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94", maxWidth: "280px" }}>
                Votre avis a bien été soumis. Il sera publié après validation de notre équipe.
              </p>
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={onClose}
                className="px-7 py-3 rounded-xl font-bold text-sm"
                style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY }}
              >
                Fermer
              </motion.button>
            </motion.div>
          ) : (
            <motion.div key="form" className="p-8">
              {/* Header */}
              <div className="flex items-start justify-between mb-7">
                <div>
                  <h3 className="font-black text-xl mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>
                    Laisser un avis
                  </h3>
                  <p className="text-xs" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>
                    Partagez votre expérience avec Yakoo Events
                  </p>
                </div>
                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(27,42,74,0.06)" }}
                >
                  <X size={15} color={NAVY} />
                </motion.button>
              </div>

              <div className="flex flex-col gap-5">
                {/* Star picker */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.18em] uppercase mb-3" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>
                    Votre note
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const filled = s <= (hoverStar || rStars);
                      return (
                        <motion.button
                          key={s}
                          type="button"
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                          onMouseEnter={() => setHoverStar(s)}
                          onMouseLeave={() => setHoverStar(0)}
                          onClick={() => setRStars(s)}
                        >
                          <Star
                            size={32}
                            fill={filled ? GOLD : "transparent"}
                            color={filled ? GOLD : "#d1d5db"}
                            strokeWidth={1.5}
                            style={{ transition: "fill 0.15s, color 0.15s" }}
                          />
                        </motion.button>
                      );
                    })}
                    {rStars > 0 && (
                      <span className="ml-2 self-center text-sm font-semibold" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                        {["", "Mauvais", "Moyen", "Bien", "Très bien", "Excellent !"][rStars]}
                      </span>
                    )}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>Votre nom</label>
                  <input
                    type="text"
                    placeholder="Prénom Nom"
                    value={rName}
                    onChange={(e) => setRName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: "#F8F8F8", border: "1.5px solid rgba(27,42,74,0.1)", color: NAVY, borderRadius: "12px" }}
                  />
                </div>

                {/* Activity */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>Activité pratiquée</label>
                  <select
                    value={rActivity}
                    onChange={(e) => setRActivity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: "#F8F8F8", border: "1.5px solid rgba(27,42,74,0.1)", color: rActivity ? NAVY : "#9ca3af", borderRadius: "12px", appearance: "none" }}
                  >
                    <option value="">Sélectionner une activité</option>
                    {["Accrobranche", "Kayak", "Paintball", "Tyrolienne", "Tir à l'arc", "Team Building", "Séminaire", "Animation", "Autre"].map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>

                {/* Text */}
                <div>
                  <label className="block text-[11px] font-bold tracking-[0.18em] uppercase mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#6b7a94" }}>
                    Votre avis
                    <span className="ml-2 normal-case tracking-normal font-normal" style={{ color: rText.length < 20 ? "#f87171" : "#22c55e" }}>
                      ({rText.length}/20 min.)
                    </span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Racontez votre expérience chez Yakoo Events..."
                    value={rText}
                    onChange={(e) => setRText(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: "#F8F8F8", border: "1.5px solid rgba(27,42,74,0.1)", color: NAVY, borderRadius: "12px", resize: "none" }}
                  />
                </div>

                {/* Submit */}
                <motion.button
                  type="button"
                  whileHover={canSubmit ? { scale: 1.02, boxShadow: `0 8px 28px rgba(245,166,35,0.4)` } : {}}
                  whileTap={canSubmit ? { scale: 0.97 } : {}}
                  disabled={!canSubmit}
                  onClick={async () => {
                    if (canSubmit) {
                      await supabase.from('reviews').insert({
                        name: rName,
                        job: rActivity || 'Client',
                        review: rText,
                        rating: rStars,
                        status: 'En attente',
                        date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
                      });
                      setDone(true);
                    }
                  }}
                  className="w-full py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all"
                  style={{
                    fontFamily: "'KG Red Hands', sans-serif",
                    background: canSubmit ? GOLD : "rgba(245,166,35,0.15)",
                    color: canSubmit ? NAVY : "rgba(245,166,35,0.4)",
                    cursor: canSubmit ? "pointer" : "not-allowed",
                  }}
                >
                  <Star size={15} fill={canSubmit ? NAVY : "rgba(245,166,35,0.4)"} color="transparent" />
                  Publier mon avis
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>, document.body)
  );
}

function Testimonials() {
  const [reviewOpen, setReviewOpen] = useState(false);
  const [dbReviews, setDbReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await supabase.from('reviews').select('*').eq('status', 'Publié');
      if (data && data.length > 0) {
        setDbReviews(data);
      }
    };
    fetchReviews();
  }, []);

  const EXTENDED_TESTIMONIALS = [
    ...TESTIMONIALS,
    {
      name: "Yassine Jrad", role: "Organisateur", company: "StartUp Weekend",
      activity: "Team Building", stars: 5,
      text: "Un espace formidable qui a permis à nos participants de se déconnecter et de tisser de vrais liens. L'orga était nickel, le lieu est très inspirant.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop&auto=format",
      color: "#3b82f6",
    }
  ];

  const formatReviews = (reviews: any[]) => {
    return reviews.map((r, i) => ({
      name: r.name,
      role: r.job || "Client",
      company: "",
      activity: "Yakoo Events",
      stars: r.rating || 5,
      text: r.review,
      img: `https://images.unsplash.com/photo-${1500000000000 + (r.name.length * 1000)}?w=120&h=120&fit=crop&auto=format`,
      color: ["#22c55e", "#38bdf8", "#fb7185", "#f97316", "#3b82f6"][i % 5],
    }));
  };

  const currentReviews = dbReviews.length > 0 ? formatReviews(dbReviews) : EXTENDED_TESTIMONIALS;

  // Double the array for seamless infinite scrolling
  const MARQUEE_ITEMS = [...currentReviews, ...currentReviews];

  return (
    <section className="relative overflow-hidden py-32" style={{ background: "#07101f" }}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 50s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background grid texture */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "48px 48px" }} />

      {/* Ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none" style={{ background: GOLD }} />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.04] pointer-events-none" style={{ background: "#a78bfa" }} />

      <div className="relative z-10">
        
        {/* ── Header ── */}
        <div className="max-w-7xl mx-auto px-6">
          <FadeUp className="flex flex-col md:flex-row items-start md:items-end justify-between gap-8 mb-20 border-b pb-12" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12" style={{ background: GOLD }} />
                <span className="text-xs font-black tracking-[0.3em] uppercase" style={{ color: GOLD, fontFamily: "'KG Red Hands', sans-serif" }}>
                  Avis vérifiés
                </span>
              </div>
              <h2 className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(3.5rem, 8vw, 5.5rem)", color: "#fff", letterSpacing: "-0.04em" }}>
                Ce que disent<br />
                <span style={{ color: "transparent", WebkitTextStroke: "2px rgba(255,255,255,0.2)" }}>nos clients</span>
              </h2>
            </div>
            
            {/* Stats & CTA */}
            <div className="flex flex-col items-start md:items-end gap-6">
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-black text-4xl leading-none text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>4.9</div>
                  <div className="flex gap-1">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill={GOLD} color={GOLD} />)}</div>
                </div>
                <div className="w-px h-12" style={{ background: "rgba(255,255,255,0.1)" }} />
                <div>
                  <div className="font-black text-4xl leading-none text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>500+</div>
                  <div className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.4)" }}>Avis clients</div>
                </div>
              </div>
              <Button onClick={() => setReviewOpen(true)} icon={Star}>
                Laisser un avis
              </Button>
            </div>
          </FadeUp>
        </div>

        {/* ── Infinite Marquee ── */}
        <FadeUp delay={0.2} className="relative w-full flex overflow-hidden group">
          {/* Edge gradients for smooth fade out */}
          <div className="absolute top-0 bottom-0 left-0 w-24 md:w-40 z-20 pointer-events-none" style={{ background: "linear-gradient(to right, #07101f, transparent)" }} />
          <div className="absolute top-0 bottom-0 right-0 w-24 md:w-40 z-20 pointer-events-none" style={{ background: "linear-gradient(to left, #07101f, transparent)" }} />

          <div className="flex w-max animate-marquee py-4" style={{ gap: "2rem", paddingLeft: "2rem" }}>
            {MARQUEE_ITEMS.map((t, i) => (
              <div 
                key={i}
                className="relative flex-shrink-0 w-[380px] md:w-[460px] rounded-[32px] p-8 md:p-10 transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ 
                  background: "rgba(255,255,255,0.02)", 
                  border: "1.5px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)"
                }}
              >
                {/* Subtle gradient hover */}
                <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top right, ${t.color}15, transparent 70%)` }} />
                
                {/* Giant quote mark */}
                <div className="absolute top-4 right-6 font-black leading-none select-none opacity-[0.02]" style={{ fontSize: "8rem", fontFamily: "'KG Red Hands', sans-serif", color: "#fff" }}>"</div>

                {/* Stars */}
                <div className="flex gap-1 mb-8 relative z-10">
                  {[...Array(t.stars)].map((_, j) => <Star key={j} size={14} fill={GOLD} color={GOLD} />)}
                </div>

                {/* Text */}
                <p className="text-base leading-relaxed mb-10 relative z-10 font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.7)" }}>
                  "{t.text}"
                </p>

                {/* Author Info */}
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0" style={{ border: `2px solid ${t.color}40` }}>
                      <img src={t.img} alt={t.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-black text-sm text-white tracking-wide" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>{t.name}</div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.4)" }}>{t.role}</div>
                    </div>
                  </div>
                  {/* Activity Badge */}
                  <span className="px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest" style={{ border: `1px solid ${t.color}40`, color: t.color, background: `${t.color}10` }}>
                    {t.activity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </FadeUp>

      </div>
      
      {/* Review modal */}
      <AnimatePresence>
        {reviewOpen && <ReviewModal onClose={() => setReviewOpen(false)} />}
      </AnimatePresence>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQS = [
  {
    emoji: "🕗",
    q: "Quelles sont les heures d'ouvertures ?",
    a: "Yakoo Events est ouvert du mardi au dimanche de 8h00 à 18h00. Les réservations de groupes peuvent être organisées en dehors de ces horaires sur demande. Nous sommes fermés le lundi pour maintenance.",
    tag: "Horaires",
  },
  {
    emoji: "🍹",
    q: "Y a-t-il une buvette à Yakoo Events ?",
    a: "Oui, notre buvette est ouverte tous les jours d'exploitation. Elle propose des boissons fraîches et chaudes, des snacks et des repas légers. Pour les groupes importants, un service traiteur peut être organisé sur réservation.",
    tag: "Restauration",
  },
  {
    emoji: "📅",
    q: "Comment effectuer votre réservation ?",
    a: "Vous pouvez réserver directement via notre formulaire en ligne, par téléphone au +216 71 790 501, ou par email à promoscout.contact@gmail.com. Un acompte de 30% est requis pour confirmer la réservation.",
    tag: "Réservation",
  },
  {
    emoji: "👕",
    q: "Que dois-je prévoir comme vêtements ?",
    a: "Nous recommandons des vêtements confortables et adaptés aux activités de plein air : pantalon long, t-shirt à manches longues, et chaussures fermées et robustes. Évitez les sandales et les vêtements trop larges pour les activités en hauteur.",
    tag: "Équipement",
  },
  {
    emoji: "👨‍👩‍👧",
    q: "À partir de quel âge peut-on participer ?",
    a: "La plupart de nos activités sont accessibles dès 6 ans avec encadrement parental. Certaines activités comme le paintball sont réservées aux 12 ans et plus. Contactez-nous pour adapter le programme à votre groupe.",
    tag: "Âge & Accès",
  },
  {
    emoji: "🚗",
    q: "Y a-t-il un parking sur place ?",
    a: "Oui, Yakoo Events dispose d'un grand parking gratuit pouvant accueillir cars et véhicules individuels. Le parc est situé Avenue Jugurtha, Tunis, facilement accessible depuis le centre-ville.",
    tag: "Accès",
  },
];

function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase.from('faq').select('*').order('display_order', { ascending: true });
        if (!error && data && data.length > 0) {
          setFaqs(data);
        } else {
          setFaqs(FAQS);
        }
      } catch (e) {
        console.error(e);
        setFaqs(FAQS);
      }
    };
    fetchFaqs();
  }, []);

  const displayList = faqs.length > 0 ? faqs : FAQS;

  return (
    <section className="relative overflow-hidden py-24" style={{ background: "#07101f" }}>

      {/* Subtle dot grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "36px 36px" }} />

      {/* Ambient glows */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.08] pointer-events-none" style={{ background: GOLD }} />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.05] pointer-events-none" style={{ background: "#a78bfa" }} />

      <div className="relative max-w-7xl mx-auto px-6 z-10">

        {/* ── Header ── */}
        <FadeUp className="grid lg:grid-cols-2 gap-6 items-end mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10" style={{ background: GOLD }} />
              <span className="text-xs font-black tracking-[0.3em] uppercase"
                style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                Aide & Support
              </span>
            </div>
            <h2 className="font-black leading-none"
              style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "-0.03em" }}>
              Questions<br />
              <span style={{ color: "transparent", WebkitTextStroke: `2px ${GOLD}` }}>fréquentes</span>
            </h2>
          </div>
          <p className="text-base leading-relaxed lg:pb-3"
            style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)", maxWidth: "420px" }}>
            Tout ce que vous devez savoir avant de vivre votre aventure chez Yakoo Events. Une question spécifique ? Notre équipe est à votre écoute.
          </p>
        </FadeUp>

        {/* ── Two-column layout ── */}
        <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-start">

          {/* Left — accordion list */}
          <div className="flex flex-col gap-3">
            {displayList.map((f, i) => {
              const isOpen = open === i;
              const question = f.question || f.q;
              const answer = f.answer || f.a;
              return (
                <FadeUp key={i} delay={i * 0.05}>
                  <motion.div
                    animate={{
                      borderColor: isOpen ? `rgba(245,166,35,0.25)` : "rgba(255,255,255,0.06)",
                    }}
                    transition={{ duration: 0.3 }}
                    className="rounded-2xl overflow-hidden"
                    style={{ border: "1px solid", background: isOpen ? "rgba(245,166,35,0.04)" : "transparent" }}
                  >
                    <button
                      className="w-full flex items-center gap-5 p-5 md:p-6 text-left outline-none group"
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      {/* Number badge */}
                      <motion.div
                        animate={{
                          background: isOpen ? GOLD : "rgba(255,255,255,0.04)",
                          color: isOpen ? NAVY : "rgba(255,255,255,0.25)",
                          borderColor: isOpen ? GOLD : "rgba(255,255,255,0.08)",
                        }}
                        transition={{ duration: 0.3 }}
                        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-black"
                        style={{ fontFamily: "'KG Red Hands', sans-serif", border: "1px solid" }}
                      >
                        {String(i + 1).padStart(2, "0")}
                      </motion.div>

                      {/* Question text */}
                      <div className="flex-1 min-w-0">
                        <span
                          className="block font-bold text-[15px] md:text-base leading-snug transition-colors duration-300"
                          style={{ fontFamily: "'KG Red Hands', sans-serif", color: isOpen ? "#fff" : "rgba(255,255,255,0.75)" }}
                        >
                          {question}
                        </span>
                      </div>

                      {/* Chevron */}
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.35, type: "spring", stiffness: 300, damping: 25 }}
                        className="flex-shrink-0"
                        style={{ color: isOpen ? GOLD : "rgba(255,255,255,0.3)" }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="m6 9 6 6 6-6"/>
                        </svg>
                      </motion.div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          style={{ overflow: "hidden" }}
                        >
                          <div className="px-5 md:px-6 pb-6 pl-[4.5rem] md:pl-[5.25rem]">
                            <p className="text-sm leading-relaxed"
                              style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)" }}>
                              {answer}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </FadeUp>
              );
            })}
          </div>

          {/* Right — sticky contact card */}
          <FadeUp delay={0.2} className="lg:sticky lg:top-32 flex flex-col gap-5">

            {/* Still have questions card */}
            <div
              className="rounded-[32px] overflow-hidden relative group"
              style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.05)", boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            >
              {/* Subtle hover gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at top right, rgba(245,166,35,0.1), transparent 60%)` }} />

              {/* Image */}
              <div className="relative h-48 overflow-hidden" style={{ background: "#0d1929" }}>
                <img
                  src="https://images.unsplash.com/photo-1780733063138-8a847437ab96?w=600&h=300&fit=crop&auto=format"
                  alt="Equipe Yakoo Events"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ opacity: 0.5 }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, #07101f 0%, transparent 80%)` }} />
                <div className="absolute bottom-5 left-6">
                  <div className="flex -space-x-2 mb-2">
                    {["#f97316", "#22c55e", "#38bdf8"].map((c) => (
                      <div key={c} className="w-8 h-8 rounded-full border-[3px]" style={{ background: c, borderColor: "#07101f" }} />
                    ))}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-widest" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                    Notre équipe vous répond
                  </p>
                </div>
              </div>

              <div className="p-8 relative z-10">
                <h3 className="font-black text-xl text-white mb-3 leading-snug" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
                  Vous avez encore des questions ?
                </h3>
                <p className="text-sm leading-relaxed mb-6 font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)" }}>
                  Notre équipe est disponible du mardi au dimanche pour répondre à toutes vos demandes.
                </p>
                <div className="flex flex-col gap-3">
                  <motion.a
                    href="#contact"
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-shadow"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY, boxShadow: "0 10px 20px rgba(245,166,35,0.2)" }}
                  >
                    <Mail size={16} /> Nous écrire
                  </motion.a>
                  <motion.a
                    href="tel:+21671790501"
                    whileHover={{ scale: 1.02, background: "rgba(255,255,255,0.08)" }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-sm transition-colors"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: "transparent", color: "rgba(255,255,255,0.8)", border: "1.5px solid rgba(255,255,255,0.1)" }}
                  >
                    <Phone size={16} /> +216 71 790 501
                  </motion.a>
                </div>
              </div>
            </div>

            {/* Quick hours card */}
            <div
              className="rounded-3xl p-6 relative overflow-hidden"
              style={{ background: "rgba(245,166,35,0.05)", border: "1.5px solid rgba(245,166,35,0.15)" }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[40px] opacity-[0.1]" style={{ background: GOLD }} />
              <div className="flex items-center gap-3 mb-5 relative z-10">
                <span className="text-xl">🕗</span>
                <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                  Horaires d'ouverture
                </span>
              </div>
              <div className="flex flex-col gap-3 relative z-10">
                {[
                  { day: "Mardi → Dimanche", hours: "08:00 – 18:00", open: true },
                  { day: "Lundi", hours: "Fermé", open: false },
                ].map(({ day, hours, open: isOpen }) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.7)" }}>{day}</span>
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-full"
                      style={{ 
                        fontFamily: "'KG Red Hands', sans-serif", 
                        color: isOpen ? GOLD : "rgba(255,255,255,0.4)",
                        background: isOpen ? "rgba(245,166,35,0.1)" : "rgba(255,255,255,0.05)"
                      }}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  const [cName, setCName]       = useState("");
  const [cEmail, setCEmail]     = useState("");
  const [cMessage, setCMessage] = useState("");
  const [sent, setSent]         = useState(false);

  const inp: React.CSSProperties = {
    fontFamily: "'KG Red Hands', sans-serif",
    background: "rgba(255,255,255,0.02)",
    border: "1.5px solid rgba(255,255,255,0.06)",
    borderRadius: "16px",
    color: "#fff",
    padding: "18px 24px",
    outline: "none",
    width: "100%",
    fontSize: "15px",
    transition: "all 0.3s ease",
  };

  const INFOS = [
    { icon: <Phone size={22} />, label: "Appelez-nous", value: "+216 71 790 501", href: "tel:+21671790501", colSpan: "col-span-1" },
    { icon: <Mail size={22} />, label: "Écrivez-nous", value: "contact@yakoo.tn", href: "mailto:promoscout.contact@gmail.com", colSpan: "col-span-1" },
  ];

  return (
    <section id="contact" className="relative overflow-hidden py-32" style={{ background: "#040914" }}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[180px] opacity-[0.05] pointer-events-none" style={{ background: GOLD }} />
      <div className="absolute bottom-0 left-[-200px] w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.03] pointer-events-none" style={{ background: "#38bdf8" }} />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />

      <div className="relative max-w-7xl mx-auto px-6">

        {/* Header */}
        <FadeUp className="mb-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12" style={{ background: GOLD }} />
                <span className="text-[11px] font-black tracking-[0.3em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                  Parlons-en
                </span>
              </div>
              <h2 className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(3rem, 7vw, 5rem)", color: "#fff", letterSpacing: "-0.04em" }}>
                Contactez<br />
                <span style={{ color: "transparent", WebkitTextStroke: `2px ${GOLD}` }}>Notre équipe</span>
              </h2>
            </div>
            <p className="text-lg leading-relaxed lg:pb-2 max-w-md" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)" }}>
              Une question, une demande de devis sur mesure ou une réservation de groupe ? Nous sommes à votre écoute et répondons sous 24h.
            </p>
          </div>
        </FadeUp>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-8">

          {/* ── Form ── */}
          <FadeUp delay={0.1}>
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-[32px] flex flex-col items-center justify-center text-center p-16 h-full min-h-[500px]"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 16, delay: 0.2 }}
                    className="w-24 h-24 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl"
                    style={{ background: "rgba(245,166,35,0.1)", border: `2px solid rgba(245,166,35,0.3)` }}
                  >
                    <CheckCircle2 size={40} style={{ color: GOLD }} />
                  </motion.div>
                  <h3 className="font-black text-3xl text-white mb-4" style={{ fontFamily: "'KG Red Hands', sans-serif", letterSpacing: "-0.02em" }}>Message Envoyé</h3>
                  <p className="text-base mb-10" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)", maxWidth: "320px" }}>
                    Merci <strong style={{ color: "#fff" }}>{cName}</strong>. Notre équipe a bien reçu votre demande et vous répondra dans les plus brefs délais.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => { setSent(false); setCName(""); setCEmail(""); setCMessage(""); }}
                    className="px-8 py-4 rounded-2xl font-bold text-sm uppercase tracking-wider transition-shadow hover:shadow-[0_10px_30px_rgba(245,166,35,0.2)]"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY }}
                  >
                    Nouveau message
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                  className="rounded-[32px] p-8 md:p-12 flex flex-col gap-6"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }}
                >
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[11px] font-black tracking-[0.2em] uppercase mb-3 ml-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.5)" }}>Nom Complet</label>
                      <input type="text" placeholder="Votre nom" value={cName} onChange={(e) => setCName(e.target.value)} 
                        className="focus:bg-white/[0.04] focus:border-[rgba(245,166,35,0.5)] placeholder-white/20" style={inp} required />
                    </div>
                    <div>
                      <label className="block text-[11px] font-black tracking-[0.2em] uppercase mb-3 ml-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.5)" }}>Email</label>
                      <input type="email" placeholder="votre@email.com" value={cEmail} onChange={(e) => setCEmail(e.target.value)} 
                        className="focus:bg-white/[0.04] focus:border-[rgba(245,166,35,0.5)] placeholder-white/20" style={inp} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-black tracking-[0.2em] uppercase mb-3 ml-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.5)" }}>Message</label>
                    <textarea rows={5} placeholder="Comment pouvons-nous vous aider aujourd'hui ?" value={cMessage} onChange={(e) => setCMessage(e.target.value)} 
                      className="focus:bg-white/[0.04] focus:border-[rgba(245,166,35,0.5)] placeholder-white/20" style={{ ...inp, resize: "none" }} required />
                  </div>
                  <Button type="submit" icon={Mail} fullWidth className="mt-2 text-base uppercase tracking-wider py-3">
                    Envoyer la demande
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </FadeUp>

          {/* ── Bento Info Grid ── */}
          <FadeUp delay={0.2} className="flex flex-col gap-6">
            
            {/* Map Bento Box */}
            <div className="rounded-[32px] overflow-hidden relative group h-[280px]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.05)" }}>
              <img
                src="https://images.unsplash.com/photo-1752097439028-b167f1d0901a?w=800&h=400&fit=crop&auto=format"
                alt="Localisation Yakoo Events"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                style={{ opacity: 0.4 }}
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(4,9,20,0.9) 0%, transparent 100%)` }} />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex items-end justify-between">
                <div>
                  <div className="w-12 h-12 rounded-[18px] flex items-center justify-center mb-4 backdrop-blur-md" style={{ background: "rgba(245,166,35,0.2)", border: `1px solid rgba(245,166,35,0.3)` }}>
                    <MapPin size={22} color={GOLD} />
                  </div>
                  <h4 className="font-bold text-xl text-white mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>Avenue Jugurtha</h4>
                  <p className="text-sm font-medium" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)" }}>Tunis, Tunisie</p>
                </div>
                <motion.a 
                  href="#"
                  whileHover={{ scale: 1.1, background: "rgba(255,255,255,1)", color: NAVY }}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }}
                >
                  <ArrowRight size={18} />
                </motion.a>
              </div>
            </div>

            {/* Quick Contact Bento Boxes */}
            <div className="grid grid-cols-2 gap-3 sm:gap-6">
              {INFOS.map(({ icon, label, value, href, colSpan }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ y: -5, background: "rgba(255,255,255,0.04)" }}
                  className={`rounded-[20px] sm:rounded-[32px] p-5 sm:p-8 flex flex-col justify-between transition-colors ${colSpan}`}
                  style={{ background: "rgba(255,255,255,0.02)", border: "1.5px solid rgba(255,255,255,0.05)", minHeight: "140px" }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <span style={{ color: "#fff" }}>{icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] mb-1 sm:mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.4)" }}>{label}</p>
                    <p className="text-xs sm:text-sm md:text-base font-bold text-white break-words" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>{value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

          </FadeUp>
        </div>
      </div>
    </section>
  );
}




// ─── Section transitions ──────────────────────────────────────────────────────

/**
 * T1 — About → Activities
 * Full-bleed film-strip: scrolling mini activity photo cards over a dark overlay.
 * Teases the activities section visually before the user reaches it.
 */
function TransitionFilmStrip() {
  const frames = [
    { img: "https://images.unsplash.com/photo-1648853070657-6d58398bee93?w=400&h=300&fit=crop&auto=format", label: "Accrobranche" },
    { img: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?w=400&h=300&fit=crop&auto=format", label: "Kayak" },
    { img: "https://images.unsplash.com/photo-1637511077877-3c6a00eb32ba?w=400&h=300&fit=crop&auto=format", label: "Tyrolienne" },
    { img: "https://images.unsplash.com/photo-1624410722888-eeb4f0c99905?w=400&h=300&fit=crop&auto=format", label: "Escalade" },
    { img: "https://images.unsplash.com/photo-1771525552094-ce394cf95343?w=400&h=300&fit=crop&auto=format", label: "Tir à l'arc" },
    { img: "https://images.unsplash.com/photo-1780733063138-8a847437ab96?w=400&h=300&fit=crop&auto=format", label: "Team Building" },
    { img: "https://images.unsplash.com/photo-1774599661355-327e322f53c2?w=400&h=300&fit=crop&auto=format", label: "Paintball" },
    { img: "https://images.unsplash.com/photo-1521336575822-6da63fb45455?w=400&h=300&fit=crop&auto=format", label: "Séminaire" },
  ];

  return (
    <div className="relative overflow-hidden py-16" style={{ background: "#040c18" }}>
      <style>{`
        @keyframes marquee-scroll { 
          from { transform: translateX(0) } 
          to { transform: translateX(calc(-50% - 0.75rem)) } 
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Background Decorative Typography */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="font-black whitespace-nowrap text-[12vw]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#fff" }}>
          EXPLOREZ L'AVENTURE
        </span>
      </div>

      {/* Edge fades for smooth entry/exit */}
      <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #040c18, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #040c18, transparent)" }} />

      {/* Scrolling Marquee */}
      <div className="relative z-20 w-full overflow-hidden flex items-center">
        <div
          className="marquee-track flex gap-6 w-max cursor-pointer"
          style={{ animation: "marquee-scroll 35s linear infinite", willChange: "transform" }}
        >
          {[1, 2].map((group) => (
            <div key={group} className="flex gap-6 w-max">
              {frames.map((f, i) => (
                <div
                  key={i}
                  className="group relative flex-shrink-0 overflow-hidden rounded-[24px] transition-all duration-500 ease-out hover:scale-[1.02] hover:shadow-2xl"
                  style={{ width: "280px", height: "180px", background: "#0d1929" }}
                >
                  <img 
                    src={f.img} 
                    alt={f.label} 
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" 
                    style={{ opacity: 0.8 }} 
                  />
                  
                  {/* Premium dark gradient overlay */}
                  <div 
                    className="absolute inset-0 transition-opacity duration-500" 
                    style={{ background: "linear-gradient(to top, rgba(4,12,24,0.95) 0%, rgba(4,12,24,0.1) 60%, transparent 100%)" }} 
                  />
                  
                  {/* Text label */}
                  <div className="absolute bottom-0 left-0 w-full p-6 flex items-end justify-between">
                    <span
                      className="text-sm font-bold uppercase tracking-widest transition-transform duration-300 group-hover:-translate-y-1"
                      style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#fff" }}
                    >
                      {f.label}
                    </span>
                    
                    {/* Arrow icon that appears on hover */}
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center opacity-0 translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
                      style={{ background: GOLD, color: "#040c18" }}
                    >
                      <ArrowRight size={14} strokeWidth={3} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Central Floating Pill */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <div 
          className="px-6 py-3 rounded-full flex items-center gap-3 text-xs font-black uppercase tracking-[0.15em] shadow-2xl backdrop-blur-md transition-all"
          style={{ 
            background: "rgba(4,12,24,0.5)", 
            color: "#fff", 
            border: "1px solid rgba(255,255,255,0.15)",
            fontFamily: "'KG Red Hands', sans-serif" 
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
          Découvrez
        </div>
      </div>
    </div>
  );
}

/**
 * T2 — Activities → Packs
 * Full-width dark panel with a massive animated number centred,
 * flanked by two smaller stats. Bold typographic editorial moment.
 */
function TransitionStats() {
  return (
    <div
      className="relative overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Diagonal gold shimmer */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ background: "linear-gradient(115deg, transparent 25%, #F5A623 50%, transparent 75%)" }} />
      {/* Dot grid texture */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "30px 30px" }} />

      <div className="relative max-w-7xl mx-auto px-6 py-10 sm:py-14">
        <div className="flex flex-col items-center gap-6 sm:grid sm:grid-cols-3 sm:items-center sm:gap-4">

          {/* Left stat — hidden on mobile */}
          <FadeUp className="text-center hidden sm:block">
            <div className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "rgba(255,255,255,0.22)" }}>
               <span className="text-2xl"></span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] mt-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.3)" }}>
              
            </div>
          </FadeUp>

          {/* Centre — hero number */}
          <FadeUp delay={0.1} className="text-center">
            <div
              className="font-black leading-none"
              style={{
                fontFamily: "'KG Red Hands', sans-serif",
                fontSize: "clamp(4rem, 14vw, 10rem)",
                color: "transparent",
                WebkitTextStroke: `2px ${GOLD}`,
                letterSpacing: "-0.04em",
              }}
            >
              3
            </div>
            <div className="font-black text-white text-base sm:text-lg uppercase tracking-[0.15em] -mt-2" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
              Packs disponibles
            </div>
            <a
              href="#packs"
              className="inline-flex items-center gap-2 mt-4 px-5 sm:px-6 py-2.5 rounded-full text-sm font-bold"
              style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY }}
            >
              Voir les offres <ArrowRight size={14} />
            </a>
          </FadeUp>

          {/* Right stat — hidden on mobile */}
          <FadeUp delay={0.2} className="text-center hidden sm:block">
            <div className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)", color: "rgba(255,255,255,0.22)" }}>
              <span className="text-2xl"></span>
            </div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] mt-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.3)" }}>
              
            </div>
          </FadeUp>
        </div>
      </div>
    </div>
  );
}

/**
 * T3 — Packs → Reservation
 * Gold full-bleed CTA with a nature photo behind it, dark overlay.
 * The most visually dramatic CTA on the page.
 */
function TransitionBookCTA() {
  return (
    <div className="relative overflow-hidden" style={{ minHeight: "240px" }}>
      {/* Background photo */}
      <img
        src="https://images.unsplash.com/photo-1758272959533-201492a5d36c?w=1600&h=400&fit=crop&auto=format"
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.28 }}
      />
      {/* Gold gradient overlay */}
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY}f0 0%, rgba(27,42,74,0.82) 50%, #F5A62388 100%)` }} />

      {/* Top + bottom gold lines */}
      <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: GOLD }} />
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: GOLD }} />

      <div className="relative flex flex-col items-center justify-center text-center px-4 sm:px-6 py-12 sm:py-16 gap-5 sm:gap-6">
        <FadeUp>
          <p className="text-xs font-bold uppercase tracking-[0.28em] mb-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
            Réservation en ligne · Réponse sous 24h
          </p>
          <h2
            className="font-black leading-none"
            style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(1.6rem, 5vw, 3.8rem)", color: "#fff", letterSpacing: "-0.03em" }}
          >
            Prêt à vivre l'aventure ?
          </h2>
        </FadeUp>
        <FadeUp delay={0.12} className="flex flex-wrap gap-3 justify-center">
          <motion.a
            href="#reservation"
            whileHover={{ scale: 1.06, boxShadow: "0 12px 36px rgba(245,166,35,0.5)" }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-black text-sm sm:text-base"
            style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY }}
          >
            Réserver maintenant <ArrowRight size={16} />
          </motion.a>
          <motion.a
            href="tel:+21671790501"
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-sm sm:text-base"
            style={{ fontFamily: "'KG Red Hands', sans-serif", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.2)" }}
          >
            <Phone size={15} /> +216 71 790 501
          </motion.a>
        </FadeUp>
      </div>
    </div>
  );
}



/**
 * T5 — Testimonials → FAQ
 * Elegant full-width nature photo with a single bold line of text.
 * A breathing moment before the FAQ.
 */
function TransitionNatureQuote() {
  return (
    <div className="relative overflow-hidden" style={{ height: "180px" }}>
      <img
        src="https://images.unsplash.com/photo-1752097439028-b167f1d0901a?w=1600&h=300&fit=crop&auto=format"
        alt="Forêt Yakoo Events"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.4 }}
      />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${NAVY}dd 0%, rgba(27,42,74,0.6) 50%, ${NAVY}dd 100%)` }} />

      {/* Top line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60, transparent)` }} />
      {/* Bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${GOLD}60, transparent)` }} />

      <div className="relative h-full flex flex-col items-center justify-center text-center px-6 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-black leading-none"
            style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(1.6rem, 4vw, 3rem)", color: "#fff", letterSpacing: "-0.02em", fontStyle: "italic" }}
          >
            "Rien ne vous retient"
          </p>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-px w-10" style={{ background: `rgba(245,166,35,0.5)` }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
              Yakoo Events — Tunis
            </span>
            <div className="h-px w-10" style={{ background: `rgba(245,166,35,0.5)` }} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * T6 — FAQ → Contact
 * Dark-to-gold diagonal split with a bold headline nudging users to get in touch.
 */
function TransitionContactNudge() {
  return (
    <div className="relative overflow-hidden" style={{ background: "#07101f" }}>
      {/* Diagonal gold shape */}
      <div
        className="absolute top-0 right-0 bottom-0 w-1/2 hidden md:block"
        style={{ background: `linear-gradient(135deg, transparent 0%, rgba(245,166,35,0.06) 100%)`, clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
const FOOTER_ACTIVITIES = ["Accrobranche", "Kayak", "Tyrolienne", "Paintball", "Tir à l'arc", "Team Building", "Séminaire", "Camping"];
const SOCIALS = [
  { Icon: Facebook,  href: "#", label: "Facebook" },
  { Icon: Instagram, href: "#", label: "Instagram" },
  { Icon: Twitter,   href: "#", label: "Twitter" },
  { Icon: Youtube,   href: "#", label: "Youtube" },
];

function Footer() {
  const content = useContent();
  const phone = content['footer_phone'] || "+216 71 790 501";
  const email = content['footer_email'] || "promoscout.contact@gmail.com";
  const address = content['footer_address'] || "Avenue Jugurtha, Tunis, Tunisie";
  const tagline = content['footer_tagline'] || "Un parc modèle en pleine nature, est un vécu précieux. Explorez sans limites avec Yakoo Events.";

  const facebook = content['footer_facebook'] || "facebook.com/yakooevents";
  const instagram = content['footer_instagram'] || "instagram.com/yakooevents";
  const youtube = content['footer_youtube'] || "youtube.com/@yakooevents";

  const footerSocials = [
    { Icon: Facebook,  href: facebook.startsWith('http') ? facebook : `https://${facebook}`, label: "Facebook" },
    { Icon: Instagram, href: instagram.startsWith('http') ? instagram : `https://${instagram}`, label: "Instagram" },
    { Icon: Twitter,   href: "#", label: "Twitter" },
    { Icon: Youtube,   href: youtube.startsWith('http') ? youtube : `https://${youtube}`, label: "Youtube" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: "#040c18" }}>

      {/* Top CTA band */}
      <div className="relative overflow-hidden" style={{ background: NAVY, borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {/* Diagonal gold stripe */}
        <div
          className="absolute top-0 right-0 h-full w-64 opacity-10"
          style={{ background: `linear-gradient(135deg, transparent 40%, ${GOLD} 100%)` }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
          <div className="text-center md:text-left">
            <h3
              className="font-black text-white leading-tight"
              style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(1.3rem, 3vw, 2.4rem)", letterSpacing: "-0.02em" }}
            >
              Prêt pour votre prochaine<br />
              <span style={{ color: GOLD }}>aventure ?</span>
            </h3>
            <p className="text-sm mt-2" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.65)" }}>
              Réservez dès aujourd'hui et vivez une expérience inoubliable.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-end w-full md:w-auto">
            <motion.a
              href="#reservation"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-bold text-sm"
              style={{ fontFamily: "'KG Red Hands', sans-serif", background: GOLD, color: NAVY, boxShadow: `0 8px 24px rgba(245,166,35,0.35)` }}
            >
              Réserver maintenant <ArrowRight size={15} />
            </motion.a>
            <motion.a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl font-bold text-sm"
              style={{ fontFamily: "'KG Red Hands', sans-serif", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <Phone size={14} /> {phone}
            </motion.a>
          </div>
        </div>
      </div>

      {/* Main footer body */}
      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-8">

        {/* Ambient glow */}
        <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full blur-[140px] opacity-[0.05] pointer-events-none" style={{ background: GOLD }} />

        {/* ── Top grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-8 sm:gap-10 mb-14">

          {/* Brand column */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: GOLD }}>
                <span className="font-black text-base leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", color: NAVY }}>Y∞</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-wide text-white" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>YAKOO</span>
                <span className="text-[8px] font-semibold tracking-[0.22em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>EVENTS</span>
              </div>
            </div>

            <p className="text-sm leading-relaxed mb-6" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.32)", maxWidth: "240px" }}>
              {tagline}
            </p>

            {/* Socials */}
            <div className="flex gap-2">
              {footerSocials.map(({ Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ y: -4, background: `rgba(245,166,35,0.18)`, borderColor: `rgba(245,166,35,0.4)` }}
                  whileTap={{ scale: 0.93 }}
                  className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.65)" }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>Navigation</p>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm group flex items-center gap-2 transition-colors"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)" }}
                  >
                    <span className="w-0 h-px transition-all duration-300 group-hover:w-4" style={{ background: GOLD }} />
                    <span className="group-hover:text-white transition-colors duration-200">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Activities */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>Activités</p>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_ACTIVITIES.map((act) => (
                <li key={act}>
                  <a
                    href="#activites"
                    className="text-sm group flex items-center gap-2 transition-colors"
                    style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)" }}
                  >
                    <span className="w-0 h-px transition-all duration-300 group-hover:w-4" style={{ background: GOLD }} />
                    <span className="group-hover:text-white transition-colors duration-200">{act}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] mb-5" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>Contact</p>
            <ul className="flex flex-col gap-4">
              {[
                { icon: <Phone size={13} />, text: phone, href: `tel:${phone.replace(/\s+/g, '')}` },
                { icon: <Mail size={13} />, text: email, href: `mailto:${email}` },
                { icon: <MapPin size={13} />, text: address, href: "#" },
                { icon: <Clock size={13} />, text: "Mar–Dim : 08h–18h", href: "#" },
              ].map(({ icon, text, href }) => (
                <li key={text}>
                  <a
                    href={href}
                    className="flex items-start gap-3 group"
                    style={{ textDecoration: "none" }}
                  >
                    <span
                      className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center"
                      style={{ background: "rgba(245,166,35,0.1)", color: GOLD }}
                    >
                      {icon}
                    </span>
                    <span
                      className="text-xs leading-relaxed group-hover:text-white transition-colors"
                      style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)" }}
                    >
                      {text}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Big watermark text ── */}
        <div className="relative overflow-hidden mb-8">
          <div
            className="font-black select-none leading-none text-center"
            style={{
              fontFamily: "'KG Red Hands', sans-serif",
              fontSize: "clamp(4rem, 12vw, 10rem)",
              letterSpacing: "-0.04em",
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.04)",
            }}
          >
            YAKOO EVENTS
          </div>
        </div>

        {/* ── Bottom bar ── */}
  <div
  className="relative flex flex-col items-center gap-3 pt-6 sm:flex-row sm:justify-between"
  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
>
  {/* Left */}
  <p
    className="text-xs order-2 sm:order-1"
    style={{
      fontFamily: "'KG Red Hands', sans-serif",
      color: "rgba(255,255,255,0.2)"
    }}
  >
    Yakoo Events {new Date().getFullYear()}
  </p>

  {/* Center */}
  <p
    className="text-xs order-1 sm:order-2 text-center"
    style={{
      fontFamily: "'KG Red Hands', sans-serif",
      color: "rgba(255,255,255,0.2)"
    }}
  >
    Conçu par{" "}
    <a
      href="https://www.linkedin.com/in/youssef-ben-yaacoub-a390b8338/"
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:opacity-70"
      style={{ color: "rgba(255,255,255,0.2)" }}
    >
      Youssef Ben Yaacoub
    </a>
  </p>

  {/* Right */}
  <div className="flex items-center gap-3 sm:gap-5 order-3 flex-wrap justify-center sm:justify-end">
    {["Mentions légales", "Confidentialité", "CGV"].map((item) => (
      <a
        key={item}
        href="#"
        className="text-xs transition-colors hover:text-white"
        style={{
          fontFamily: "'KG Red Hands', sans-serif",
          color: "rgba(255,255,255,0.2)"
        }}
      >
        {item}
      </a>
    ))}
  </div>
</div>
      </div>
    </footer>
  );
}

// ─── Hero-About Separator ──────────────────────────────────────────────────
function HeroAboutSeparator() {
  return (
    <div className="relative z-20 w-full h-0 pointer-events-none">
      <svg
        className="absolute top-0 left-0 w-full h-16 sm:h-28 text-[#070e1b]"
        preserveAspectRatio="none"
        viewBox="0 -12 1440 66"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M0 -12V23.719C281.875 -10.963 607.375 -4.01395 918 36.653C1138.5 65.5173 1319.5 45.4214 1440 23.719V-12H0Z" />
      </svg>
    </div>
  );
}

// ─── Event Management Section ────────────────────────────────────────────────
function EventManagementSection() {
  const eventsServices = [
    {
      title: "Team Building & Corporate",
      desc: "Renforcez la cohésion de vos équipes avec des challenges sur mesure, des chasses au trésor et des parcours d'aventure en pleine nature.",
      icon: "🏢",
      color: "#3B82F6",
    },
    {
      title: "Anniversaires & Fêtes",
      desc: "Des formules complètes pour petits et grands : gâteau, animateurs dédiés, activités encadrées et moments inoubliables assurés.",
      icon: "🎉",
      color: "#22C55E",
    },
    {
      title: "Sorties Scolaires & Clubs",
      desc: "Sensibilisation à l'environnement et dépassement de soi à travers des ateliers scientifiques et des parcours sportifs adaptés à tous les âges.",
      icon: "🚌",
      color: "#8B5CF6",
    },
    {
      title: "Événements sur Mesure",
      desc: "Que ce soit pour une fête de famille, un enterrement de vie de célibataire ou un événement associatif, nous personnalisons chaque détail.",
      icon: "✨",
      color: "#EF4444",
    },
  ];

  return (
    <section id="evenements" className="relative overflow-hidden py-24" style={{ background: "#07101f" }}>
      {/* Ambient glows */}
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.06] pointer-events-none" style={{ background: GOLD }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[140px] opacity-[0.04] pointer-events-none" style={{ background: "#a78bfa" }} />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <FadeUp className="grid lg:grid-cols-2 gap-6 items-end mb-16">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-10" style={{ background: GOLD }} />
              <span className="text-xs font-black tracking-[0.3em] uppercase"
                style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                Organisation d'Événements
              </span>
            </div>
            <h2 className="font-black leading-none"
              style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "-0.03em" }}>
              Nous gérons<br />
              <span style={{ color: "transparent", WebkitTextStroke: "2px " + GOLD }}>vos événements</span>
            </h2>
          </div>
          <div>
            <p className="text-base leading-relaxed lg:pb-3 mb-6"
              style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.60)", maxWidth: "520px" }}>
              Yakoo Events prend en charge l'organisation de vos rassemblements de A à Z. Logistique, animation, restauration, sécurité : notre équipe de professionnels s'occupe de tout pour faire de votre projet une réussite totale.
            </p>
            <Button href="#reservation" icon={ArrowRight}>
              Organiser mon événement
            </Button>
          </div>
        </FadeUp>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {eventsServices.map((s, i) => (
            <FadeUp key={s.title} delay={i * 0.1}>
              <div
                className="rounded-3xl p-8 h-full relative group transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1.5px solid rgba(255,255,255,0.05)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
                  style={{
                    background: "radial-gradient(circle at top right, " + s.color + "15, transparent 65%)",
                  }}
                />
                <div className="text-4xl mb-6">{s.icon}</div>
                <h3 className="text-lg font-black text-white mb-3" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>
                  {s.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Equipment Showcase Section ──────────────────────────────────────────────
function EquipmentShowcaseSection() {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    const fetchPublicMateriels = async () => {
      const { data, error } = await supabase.from('materiels').select('*');
      if (!error && data) {
        setEquipments(data);
      }
    };
    fetchPublicMateriels();
  }, []);

  const displayList = equipments.length > 0 ? equipments.map(eq => ({
    name: eq.name,
    category: eq.category,
    location: eq.location || "Non spécifié",
    status: eq.condition || "Bon",
    desc: eq.description || "",
    icon: eq.category === "Escalade" ? "🧗" : eq.category === "Kayak" ? "🛶" : eq.category === "Paintball" ? "🔫" : "⛺"
  })) : [
    {
      name: "Harnais & Mousquetons",
      category: "Escalade",
      location: "Entrepôt Principal — Zone A, Étagère 1",
      status: "Excellent état",
      icon: "🧗",
      desc: "Équipement de sécurité individuel haut de gamme de marque Edelrid, inspecté mensuellement.",
    },
    {
      name: "Kayaks & Gilets",
      category: "Kayak",
      location: "Hangar à Bateaux — Près du Lac",
      status: "Bon état",
      icon: "🛶",
      desc: "Kayaks monoplaces et biplaces robustes, avec gilets de sauvetage certifiés pour tous les âges.",
    },
    {
      name: "Marqueurs & Masques Paintball",
      category: "Paintball",
      location: "Armurerie Paintball — Stand de Tir",
      status: "Excellent état",
      icon: "🔫",
      desc: "Lanceurs Tippmann 98, masques antibuée double écran pour une protection et une visibilité optimales.",
    },
    {
      name: "Tentes & Matelas Camping",
      category: "Camping",
      location: "Entrepôt Logistique — Secteur B",
      status: "Excellent état",
      icon: "⛺",
      desc: "Tentes étanches Quechua de 2 à 4 places et matelas isolants confortables pour vos nuitées en nature.",
    },
  ];

  return (
    <section id="equipements" className="relative overflow-hidden py-24" style={{ background: "#040914" }}>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)", backgroundSize: "64px 64px" }} />
      
      {/* Ambient glows */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[180px] opacity-[0.04] pointer-events-none" style={{ background: GOLD }} />
      
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <FadeUp className="mb-16">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px w-12" style={{ background: GOLD }} />
                <span className="text-[11px] font-black tracking-[0.3em] uppercase" style={{ fontFamily: "'KG Red Hands', sans-serif", color: GOLD }}>
                  Sécurité & Logistique
                </span>
              </div>
              <h2 className="font-black leading-none" style={{ fontFamily: "'KG Red Hands', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#fff", letterSpacing: "-0.04em" }}>
                Nos Matériels<br />
                <span style={{ color: "transparent", WebkitTextStroke: "2px " + GOLD }}>& Équipements</span>
              </h2>
            </div>
            <p className="text-base leading-relaxed max-w-md" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.6)" }}>
              Nous garantissons une sécurité maximale grâce à des équipements de premier choix. Tous nos matériels sont stockés dans des emplacements dédiés et inspectés quotidiennement par nos moniteurs qualifiés.
            </p>
          </div>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayList.map((eq, i) => (
            <FadeUp key={eq.name} delay={i * 0.1}>
              <div
                className="rounded-[32px] p-8 relative overflow-hidden group transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1.5px solid rgba(255,255,255,0.05)",
                }}
              >
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                    {eq.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-2">
                      <h3 className="text-lg font-black text-white" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
                        {eq.name}
                      </h3>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider" style={{ background: GOLD + "20", color: GOLD, border: "1px solid " + GOLD + "40" }}>
                        {eq.category}
                      </span>
                    </div>
                    
                    <p className="text-sm leading-relaxed mb-5" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.55)" }}>
                      {eq.desc}
                    </p>

                    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3 sm:gap-4 pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.4)" }}>
                          Emplacement
                        </div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5" style={{ fontFamily: "'KG Red Hands', sans-serif" }}>
                          📍 {eq.location}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-black uppercase tracking-[0.1em] mb-1" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "rgba(255,255,255,0.4)" }}>
                          État de fonctionnement
                        </div>
                        <div className="text-xs font-bold flex items-center gap-1.5" style={{ fontFamily: "'KG Red Hands', sans-serif", color: "#22C55E" }}>
                          🛡️ {eq.status}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase.from('site_content').select('*');
        if (!error && data) {
          const map: Record<string, string> = {};
          data.forEach((row: any) => {
            map[row.key_name] = row.content_value;
          });
          setContent(map);

          // Dynamically update SEO tags
          if (map['seo_title']) {
            document.title = map['seo_title'];
          }
          if (map['seo_description']) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
              meta = document.createElement('meta');
              meta.setAttribute('name', 'description');
              document.head.appendChild(meta);
            }
            meta.setAttribute('content', map['seo_description']);
          }
        }
      } catch (e) {
        console.error(e);
      }
    };
    fetchContent();
  }, []);

  return (
    <ContentContext.Provider value={content}>
      <div style={{ fontFamily: "'KG Red Hands', sans-serif", overflowX: "hidden" }} className="min-h-screen bg-background text-foreground">
        <GlobalStyles />
        <Navbar />
        <Hero />
        <HeroAboutSeparator />
        <About />
        <TransitionFilmStrip />
        <Activities />
        <TransitionStats />
        <Packs />
        <TransitionBookCTA />
        <EventManagementSection />
        <EquipmentShowcaseSection />
        <Reservation />
        <Testimonials />
        <TransitionNatureQuote />
        <FAQ />
        <TransitionContactNudge />
        <Contact />
        <Footer />
      </div>
    </ContentContext.Provider>
  );
}
