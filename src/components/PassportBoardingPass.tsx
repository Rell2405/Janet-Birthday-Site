import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import gsap from "gsap";
import {
  Plane,
  PlaneTakeoff,
  MapPin,
  CalendarDays,
  Clock,
  Ticket,
  ShieldCheck,
  Volume2,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { playTakeoffSequence } from "@/lib/cabinAudio";

const PAGE_W = 340;
const PAGE_H = 470;

export default function PassportBoardingPass() {
  const [open, setOpen] = useState(false);
  const shineRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const playedRef = useRef(false);

  // GSAP: idle float + repeating shine sweep on the closed cover.
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (floatRef.current) {
        gsap.to(floatRef.current, {
          y: -12,
          duration: 2.4,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (open || !shineRef.current) return;
    const tween = gsap.fromTo(
      shineRef.current,
      { xPercent: -160, opacity: 0 },
      {
        xPercent: 160,
        opacity: 1,
        duration: 1.6,
        ease: "power2.inOut",
        repeat: -1,
        repeatDelay: 2.2,
      }
    );
    return () => {
      tween.kill();
    };
  }, [open]);

  const handleOpen = () => {
    if (open) return;
    setOpen(true);
    // The click is the user gesture that unlocks audio playback.
    if (!playedRef.current) {
      playedRef.current = true;
      void playTakeoffSequence();
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className="perspective select-none"
        style={{ width: PAGE_W * 2, maxWidth: "100%" }}
      >
        <motion.div
          ref={floatRef}
          className="relative mx-auto"
          style={{ width: PAGE_W * 2, height: PAGE_H }}
          animate={{ x: open ? 0 : PAGE_W / 2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Boarding pass sits under the cover, on the right page. */}
          <div
            className="absolute top-0 right-0"
            style={{ width: PAGE_W, height: PAGE_H }}
          >
            <BoardingPass open={open} />
          </div>

          {/* The passport cover, hinged at the centre spine. */}
          <div
            className="absolute top-0 left-1/2 preserve-3d cursor-pointer"
            style={{
              width: PAGE_W,
              height: PAGE_H,
              transformStyle: "preserve-3d",
            }}
            onClick={handleOpen}
            role="button"
            tabIndex={0}
            aria-label="Open passport"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleOpen();
              }
            }}
          >
            <motion.div
              className="absolute inset-0 preserve-3d"
              style={{ transformOrigin: "left center", transformStyle: "preserve-3d" }}
              animate={{ rotateY: open ? -178 : 0 }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* FRONT: US passport cover */}
              <div className="absolute inset-0 backface-hidden">
                <PassportCover shineRef={shineRef} pulsing={!open} />
              </div>
              {/* BACK: inside cover / left page */}
              <div
                className="absolute inset-0 backface-hidden"
                style={{ transform: "rotateY(180deg)" }}
              >
                <InsideCover />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {!open ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Volume2 className="h-4 w-4" />
            Tap the passport to open — sound on for takeoff
          </motion.p>
        ) : (
          <motion.button
            key="reset"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setOpen(false)}
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Close passport
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

function PassportCover({
  shineRef,
  pulsing,
}: {
  shineRef: React.RefObject<HTMLDivElement>;
  pulsing: boolean;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-l-md rounded-r-2xl border border-emerald-950 bg-gradient-to-br from-[#123524] via-[#0f2e1f] to-[#0a2317] shadow-2xl">
      {/* gold foil frame */}
      <div className="absolute inset-3 rounded-[10px] border border-amber-300/40" />

      <div className="flex h-full flex-col items-center justify-between px-6 py-10 text-amber-200/90">
        <div className="text-center">
          <p className="text-[11px] font-semibold tracking-[0.35em]">UNITED STATES</p>
          <p className="text-[11px] font-semibold tracking-[0.35em]">OF AMERICA</p>
        </div>

        {/* eagle emblem */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-amber-300/50 bg-amber-300/5">
            <Plane className="h-12 w-12 -rotate-45 text-amber-200/90" />
          </div>
          <p className="text-lg font-semibold tracking-[0.3em]">PASSPORT</p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 text-amber-300/70">
            <span className="h-[2px] w-6 bg-amber-300/40" />
            <div className="h-3 w-3 rounded-full border border-amber-300/60" />
            <span className="h-[2px] w-6 bg-amber-300/40" />
          </div>
          <p className="text-[10px] tracking-[0.3em] text-amber-200/60">
            E-PASSPORT
          </p>
        </div>
      </div>

      {/* animated shine sweep */}
      <div
        ref={shineRef}
        className="pointer-events-none absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      {pulsing ? (
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-r-2xl ring-2 ring-amber-300/0"
          animate={{ boxShadow: [
            "0 0 0px 0px rgba(252,211,77,0.0)",
            "0 0 26px 4px rgba(252,211,77,0.35)",
            "0 0 0px 0px rgba(252,211,77,0.0)",
          ] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        />
      ) : null}
    </div>
  );
}

function InsideCover() {
  return (
    <div className="h-full w-full overflow-hidden rounded-l-2xl rounded-r-md border border-emerald-950 bg-gradient-to-br from-[#f5f1e6] to-[#e7dfca] p-6 shadow-inner">
      <div className="flex h-full flex-col justify-between text-emerald-950/80">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.3em] text-emerald-900/60">
            TYPE / CODE
          </p>
          <p className="font-mono text-sm">P &nbsp; USA</p>
        </div>

        <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-2 border-emerald-900/20">
          <PlaneTakeoff className="h-14 w-14 text-emerald-900/40" />
        </div>

        <div className="space-y-1">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-emerald-900/60">
            AUTHORITY
          </p>
          <p className="font-mono text-xs">Ministry of Wanderlust</p>
          <div className="mt-3 border-t border-dashed border-emerald-900/20 pt-3 font-mono text-[10px] leading-relaxed text-emerald-900/50">
            P&lt;USADOE&lt;&lt;JANET&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;&lt;
            <br />
            3141592653USA9001019F3012254&lt;&lt;&lt;&lt;&lt;&lt;06
          </div>
        </div>
      </div>
    </div>
  );
}

function BoardingPass({ open }: { open: boolean }) {
  const rows = [
    { icon: MapPin, label: "From", value: "JFK · New York" },
    { icon: MapPin, label: "To", value: "MBJ · Montego Bay" },
    { icon: CalendarDays, label: "Date", value: "24 MAY" },
    { icon: Clock, label: "Boarding", value: "10:45 AM" },
  ];

  return (
    <motion.div
      className="h-full w-full overflow-hidden rounded-l-md rounded-r-2xl border border-border bg-card shadow-2xl"
      initial={false}
      animate={open ? "open" : "closed"}
    >
      {/* header: Jamaica flag stripes */}
      <div className="relative h-20 bg-gradient-to-r from-[#009B3A] via-[#000000] to-[#FED100]">
        <div className="absolute inset-0 opacity-90">
          <div className="absolute left-0 top-0 h-full w-full [clip-path:polygon(0_0,45%_0,0_100%)] bg-[#009B3A]" />
          <div className="absolute right-0 top-0 h-full w-full [clip-path:polygon(100%_0,100%_100%,55%_100%)] bg-[#FED100]" />
          <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-black/70" />
        </div>
        <div className="relative flex h-full items-center justify-between px-5">
          <div className="flex items-center gap-2 text-white drop-shadow">
            <Ticket className="h-5 w-5" />
            <span className="text-xs font-bold tracking-[0.2em]">
              BOARDING PASS
            </span>
          </div>
          <PlaneTakeoff className="h-6 w-6 text-white drop-shadow" />
        </div>
      </div>

      <div className="flex flex-col gap-4 p-5">
        <motion.div
          variants={{
            open: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
            closed: {},
          }}
          className="flex flex-col gap-4"
        >
          <Field delay label="Passenger" value="JANET" big />

          <div className="grid grid-cols-2 gap-3">
            {rows.map((r) => (
              <Row key={r.label} icon={r.icon} label={r.label} value={r.value} />
            ))}
          </div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between rounded-lg border border-dashed border-border bg-secondary/40 px-4 py-3"
          >
            <Meta label="Flight" value="JB 246" />
            <Meta label="Gate" value="B7" />
            <Meta label="Seat" value="1A" />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
              <span>TSA PreCheck · Verified</span>
            </div>
            <Badge variant="accent">FIRST CLASS</Badge>
          </motion.div>

          {/* barcode */}
          <motion.div variants={itemVariants} className="flex gap-[3px] pt-1">
            {barcode.map((w, i) => (
              <span
                key={i}
                className="block h-9 rounded-[1px] bg-foreground/80"
                style={{ width: w }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}

const itemVariants = {
  open: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  closed: { opacity: 0, y: 12 },
} as const;

function Field({
  label,
  value,
  big,
}: {
  label: string;
  value: string;
  big?: boolean;
  delay?: boolean;
}) {
  return (
    <motion.div variants={itemVariants}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          big
            ? "text-2xl font-bold tracking-tight text-foreground"
            : "text-base font-semibold text-foreground"
        }
      >
        {value}
      </p>
    </motion.div>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <motion.div variants={itemVariants} className="flex items-start gap-2">
      <Icon className="mt-0.5 h-4 w-4 text-primary" />
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground">{value}</p>
      </div>
    </motion.div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        {label}
      </p>
      <p className="font-mono text-base font-bold text-foreground">{value}</p>
    </div>
  );
}

const barcode = [
  3, 2, 5, 2, 3, 6, 2, 4, 3, 2, 7, 3, 2, 5, 2, 3, 4, 6, 2, 3, 3, 5, 2, 4, 2, 6,
  3, 2, 4, 2, 5, 3, 2, 6, 2, 3,
].map((n) => `${n}px`);
