import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  animate,
  motion,
  motionValue,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { Check } from "lucide-react";

type FalloffStatus = "idle" | "error" | "success";

export type CodeSlotsStatus = FalloffStatus;

export type CodeSlotsProps = {
  length?: number;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  onComplete?: (code: string) => void;
  status?: CodeSlotsStatus;
  mask?: boolean;
  caret?: boolean;
  disabled?: boolean;
  autoFocus?: boolean;
  accentColor?: string;
  inkColor?: string;
  slotColor?: string;
  digitColor?: string;
  dangerColor?: string;
  slotSize?: number;
  gap?: number;
  radius?: number;
  bounce?: number;
  settle?: number;
  rise?: number;
  cascade?: number;
  ariaLabel?: string;
  className?: string;
};

type Live = {
  settle: number;
  bounce: number;
  cascade: number;
  reduce: boolean | null;
};

type SlotProps = {
  mv: MotionValue<number>;
  drop: MotionValue<number>;
  char: string;
  active: boolean;
  rise: number;
  sink: number;
};

const EASE_OUT: [number, number, number, number] = [0.23, 1, 0.32, 1];
const WASH_IN = 0.3;
const WASH_OUT = 0.2;
const SINK_DELAY = 0.06;
const SINK_STEP = 0.03;
const CHECK_DELAY = 0.28;
const CHECK_RISE = 8;
const SINK_FADE = 0.6;

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const digitsOf = (raw: string | undefined) => String(raw ?? "").replace(/\D/g, "");
const toSlots = (raw: string | undefined, count: number) => {
  const digits = digitsOf(raw).slice(0, count);
  return Array.from({ length: count }, (_, index) => digits[index] ?? "");
};
const firstEmptyOf = (slots: string[]) => {
  const index = slots.indexOf("");
  return index === -1 ? slots.length - 1 : index;
};
const isFull = (slots: string[]) => slots.every(Boolean);

export default function CodeSlots({
  length = 6,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  status = "idle",
  mask = false,
  caret = true,
  disabled = false,
  autoFocus = false,
  accentColor = "#0095FF",
  inkColor = "#f5f5f5",
  slotColor = "#27272a",
  digitColor = "#ffffff",
  dangerColor = "#ff3b30",
  slotSize = 44,
  gap = 8,
  radius = 12,
  bounce = 0.2,
  settle = 0.3,
  rise = 8,
  cascade = 20,
  ariaLabel = "One-time code",
  className = "",
}: CodeSlotsProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState(() => toSlots(value ?? defaultValue, length));
  const [active, setActive] = useState(() => firstEmptyOf(slots));
  const [focused, setFocused] = useState(false);
  const [veiled, setVeiled] = useState(status === "success");
  const activeMv = useMotionValue(active);
  const openMv = useMotionValue(status === "success" ? 1 : 0);
  const checkMv = useMotionValue(status === "success" ? 1 : 0);
  const glide = useRef(new Set<number>());
  const target = useRef<number[]>([]);
  const draining = useRef(false);
  const drainTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const statusRef = useRef(status);
  const emitted = useRef(digitsOf(value ?? defaultValue).slice(0, length));
  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const live = useRef({} as Live);
  live.current = { settle, bounce, cascade, reduce };

  const springs = useMemo(
    () => ({
      mvs: Array.from({ length }, (_, index) =>
        motionValue(slotsRef.current[index] ? 1 : 0)
      ),
      drops: Array.from({ length }, () =>
        motionValue(statusRef.current === "success" ? 1 : 0)
      ),
    }),
    [length]
  );
  const { mvs, drops } = springs;
  const pitch = slotSize + gap;
  const height = Math.round(slotSize * 1.18);
  const washRadius = Math.min(radius, slotSize / 2);

  const drive = useCallback(
    (index: number, to: number, delayMs = 0) => {
      const mv = mvs[index];
      if (!mv) {
        return;
      }
      target.current[index] = to;
      const current = live.current;
      if (current.reduce) {
        mv.jump(to);
        return;
      }
      void animate(mv, to, {
        type: "spring",
        duration: current.settle,
        bounce: current.bounce,
        delay: delayMs / 1000,
      });
    },
    [mvs]
  );

  const land = useCallback(
    (index: number, delayMs = 0) => {
      if (mvs[index].get() > 0) {
        mvs[index].jump(0);
      }
      drive(index, 1, delayMs);
    },
    [drive, mvs]
  );

  const moveActive = useCallback(
    (next: number, crossed: number[]) => {
      crossed.forEach((item) => glide.current.add(item));
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );

  const jumpActive = useCallback(
    (next: number) => {
      glide.current.clear();
      activeMv.jump(next);
      setActive(next);
    },
    [activeMv]
  );

  const caretX = useTransform(() => {
    const current = activeMv.get();
    let x = current * pitch;
    for (let index = 0; index < mvs.length; index++) {
      const held = clamp01(mvs[index].get());
      if (!glide.current.has(index)) {
        continue;
      }
      const to = target.current[index];
      if (to === undefined || held === clamp01(to)) {
        glide.current.delete(index);
        continue;
      }
      x += index < current ? -(1 - held) * pitch : held * pitch;
    }
    return Math.min(Math.max(x, 0), (mvs.length - 1) * pitch);
  });
  const caretTransform = useTransform(caretX, (x: number) => `translateX(${x}px)`);
  const washClip = useTransform(
    openMv,
    (open: number) => `inset(0 ${(1 - clamp01(open)) * 50}% round ${washRadius}px)`
  );
  const checkTransform = useTransform(
    checkMv,
    (check: number) =>
      `translateY(${(1 - check) * CHECK_RISE}px) scale(${0.85 + 0.15 * Math.max(check, 0)})`
  );
  const checkOpacity = useTransform(checkMv, clamp01);

  const commit = useCallback(
    (next: string[]) => {
      const prev = slotsRef.current;
      slotsRef.current = next;
      setSlots(next);
      const code = next.join("");
      emitted.current = code;
      onChange?.(code);
      if (!isFull(prev) && isFull(next)) {
        onComplete?.(code);
      }
    },
    [onChange, onComplete]
  );

  const insert = (raw: string, from = active) => {
    const digits = digitsOf(raw);
    if (!digits) {
      return;
    }
    const next = [...slotsRef.current];
    const crossed: number[] = [];
    const step = reduce ? 0 : cascade;
    let index = from;
    for (const char of digits) {
      if (index >= length) {
        break;
      }
      next[index] = char;
      land(index, (index - from) * step);
      crossed.push(index);
      index += 1;
    }
    if (!crossed.length) {
      return;
    }
    commit(next);
    moveActive(Math.min(index, length - 1), crossed);
  };

  const clearSlot = (index: number, stepBack = false) => {
    if (!slotsRef.current[index]) {
      if (stepBack) {
        jumpActive(index);
      }
      return;
    }
    const next = [...slotsRef.current];
    next[index] = "";
    drive(index, 0);
    commit(next);
    if (stepBack) {
      moveActive(index, [index]);
    }
  };

  const busy = disabled || draining.current || status === "success";

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (busy || event.metaKey || event.ctrlKey || event.altKey) {
      return;
    }
    const key = event.key;
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      insert(key);
    } else if (key === "Backspace") {
      event.preventDefault();
      if (slots[active]) {
        clearSlot(active);
      } else if (active > 0) {
        clearSlot(active - 1, true);
      }
    } else if (key === "Delete") {
      event.preventDefault();
      clearSlot(active);
    } else if (key === "ArrowLeft") {
      event.preventDefault();
      jumpActive(Math.max(active - 1, 0));
    } else if (key === "ArrowRight") {
      event.preventDefault();
      jumpActive(Math.min(active + 1, length - 1));
    }
  };

  const onPaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    if (busy) {
      return;
    }
    event.preventDefault();
    insert(event.clipboardData.getData("text"));
  };

  const onInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (busy) {
      return;
    }
    const digits = digitsOf(event.target.value);
    if (!digits) {
      return;
    }
    insert(digits, digits.length === 1 ? active : 0);
  };

  const onRowMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      return;
    }
    event.preventDefault();
    const row = rowRef.current;
    if (row && !draining.current && status !== "success") {
      const rect = row.getBoundingClientRect();
      const zoom = rect.width / (row.offsetWidth || rect.width) || 1;
      const index = Math.floor((event.clientX - rect.left) / zoom / pitch);
      jumpActive(Math.max(0, Math.min(index, firstEmptyOf(slotsRef.current))));
    }
    inputRef.current?.focus();
  };

  useEffect(() => {
    glide.current.clear();
    target.current = [];
    const next = Array.from({ length }, (_, index) => slotsRef.current[index] ?? "");
    slotsRef.current = next;
    setSlots(next);
    jumpActive(firstEmptyOf(next));
    const code = next.join("");
    if (code !== emitted.current) {
      emitted.current = code;
      onChange?.(code);
    }
    // Restart slots when the length changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length]);

  useEffect(() => {
    if (value === undefined) {
      return;
    }
    const clean = digitsOf(value).slice(0, length);
    if (clean === emitted.current) {
      return;
    }
    emitted.current = clean;
    const prev = slotsRef.current;
    const next = toSlots(clean, length);
    const hidden = statusRef.current === "success";
    const landing: number[] = [];
    const leaving: number[] = [];
    next.forEach((char, index) => {
      if (char === prev[index]) {
        return;
      }
      (char ? landing : leaving).push(index);
    });
    const step = live.current.reduce || hidden ? 0 : live.current.cascade;
    landing.forEach((index, order) => land(index, order * step));
    leaving.reverse().forEach((index, order) => {
      if (hidden) {
        target.current[index] = 0;
        mvs[index].jump(0);
        drops[index].jump(0);
      } else {
        drive(index, 0, order * step);
      }
    });
    slotsRef.current = next;
    setSlots(next);
    moveActive(firstEmptyOf(next), [...landing, ...leaving]);
    if (!isFull(prev) && isFull(next)) {
      onComplete?.(clean);
    }
  }, [drive, drops, land, length, moveActive, mvs, onComplete, value]);

  useEffect(() => {
    const previous = statusRef.current;
    const current = live.current;
    if (status === "success") {
      setVeiled(true);
      if (current.reduce) {
        openMv.jump(1);
        drops.forEach((drop) => drop.jump(1));
        checkMv.jump(1);
        return;
      }
      void animate(openMv, 1, { duration: WASH_IN, ease: EASE_OUT });
      drops.forEach((drop, index) =>
        animate(drop, 1, {
          type: "spring",
          duration: 0.3,
          bounce: 0,
          delay: SINK_DELAY + index * SINK_STEP,
        })
      );
      void animate(checkMv, 1, {
        type: "spring",
        duration: 0.35,
        bounce: current.bounce,
        delay: CHECK_DELAY,
      });
      return;
    }
    if (previous !== "success") {
      return;
    }
    if (current.reduce) {
      openMv.jump(0);
      checkMv.jump(0);
      drops.forEach((drop) => drop.jump(0));
      setVeiled(false);
      return;
    }
    void animate(checkMv, 0, { duration: 0.15, ease: EASE_OUT });
    void animate(openMv, 0, { duration: WASH_OUT, ease: EASE_OUT, delay: 0.06 }).then(() => {
      if (openMv.get() === 0) {
        setVeiled(false);
      }
    });
    drops.forEach((drop) => animate(drop, 0, { type: "spring", duration: 0.3, bounce: 0, delay: 0.1 }));
  }, [checkMv, drops, openMv, status]);

  useEffect(() => {
    if (status !== "error") {
      return;
    }
    const filled = slotsRef.current
      .map((char, index) => (char ? index : -1))
      .filter((index) => index >= 0);
    if (!filled.length) {
      return;
    }
    filled.reverse();
    draining.current = true;
    const current = live.current;
    const step = current.reduce ? 0 : current.cascade;
    filled.forEach((index, order) => drive(index, 0, order * step));
    moveActive(
      0,
      slotsRef.current.map((_, index) => index)
    );
    clearTimeout(drainTimer.current);
    drainTimer.current = setTimeout(
      () => {
        draining.current = false;
        commit(Array.from({ length }, () => ""));
      },
      current.reduce ? 300 : (filled.length - 1) * step + current.settle * 1000
    );
  }, [commit, drive, length, moveActive, status]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(() => () => clearTimeout(drainTimer.current), []);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current?.focus();
    }
  }, [autoFocus]);

  const view = slots.length === length ? slots : Array.from({ length }, (_, index) => slots[index] ?? "");
  const showCaret =
    caret &&
    focused &&
    !disabled &&
    !veiled &&
    status !== "success" &&
    (status === "error" || !view[active]);

  return (
    <div
      className={`relative inline-block${className ? ` ${className}` : ""}`}
      style={
        {
          "--cs-accent": accentColor,
          "--cs-ink": inkColor,
          "--cs-slot": slotColor,
          "--cs-digit": digitColor,
          "--cs-danger": dangerColor,
          "--cs-size": `${slotSize}px`,
          "--cs-height": `${height}px`,
          "--cs-gap": `${gap}px`,
          "--cs-radius": `${Math.min(radius, slotSize / 2)}px`,
          "--cs-font": `${Math.round(slotSize * 0.5)}px`,
        } as CSSProperties
      }
    >
      <style>
        {
          "@keyframes code-slots-blink{0%,49.9%{opacity:1}50%,100%{opacity:0}}"
        }
      </style>
      <div
        ref={rowRef}
        className="group/row relative inline-flex cursor-text touch-manipulation gap-[var(--cs-gap)] [-webkit-tap-highlight-color:transparent] [transition:opacity_200ms_ease] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
        data-status={status}
        data-focused={focused ? "" : undefined}
        data-disabled={disabled ? "" : undefined}
        onMouseDown={onRowMouseDown}
      >
        <input
          ref={inputRef}
          className="absolute inset-0 z-[4] m-0 cursor-[inherit] appearance-none border-0 bg-transparent p-0 text-[16px] text-transparent opacity-0 outline-0 [caret-color:transparent]"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          value=""
          maxLength={length}
          aria-label={ariaLabel}
          aria-invalid={status === "error"}
          aria-describedby={`${uid}-count`}
          disabled={disabled}
          readOnly={status === "success"}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onChange={onInput}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        {view.map((char, index) => (
          <Slot
            key={index}
            mv={mvs[index]}
            drop={drops[index]}
            char={mask && char ? "•" : char}
            active={focused && index === active}
            rise={rise}
            sink={Math.round(height * 0.5)}
          />
        ))}
        <motion.span
          className="pointer-events-none absolute inset-0 z-[1] grid place-items-center rounded-[var(--cs-radius)] bg-[var(--cs-accent)] [color:var(--cs-digit)]"
          aria-hidden
          style={{ clipPath: washClip }}
        >
          <motion.span
            className="grid place-items-center"
            style={{ transform: checkTransform, opacity: checkOpacity }}
          >
            <Check size={22} strokeWidth={2.6} />
          </motion.span>
        </motion.span>
        <motion.span
          className="pointer-events-none absolute left-[calc(var(--cs-size)/2_-_0.75px)] top-1/4 z-[3] h-1/2 w-[1.5px] opacity-0 data-[show]:opacity-100"
          aria-hidden
          data-show={showCaret ? "" : undefined}
          style={{ transform: caretTransform }}
        >
          <span
            key={active}
            className="block h-full w-full animate-[code-slots-blink_1s_linear_infinite] bg-[var(--cs-ink)] motion-reduce:animate-none"
          />
        </motion.span>
        <span id={`${uid}-count`} className="sr-only">
          {status === "success"
            ? "Code accepted"
            : `${view.filter(Boolean).length} of ${length} digits entered`}
        </span>
      </div>
    </div>
  );
}

function Slot({ mv, drop, char, active, rise, sink }: SlotProps) {
  const [shown, setShown] = useState(char);
  if (char && char !== shown) {
    setShown(char);
  }
  const fill = useTransform(mv, (value: number) => `scale(${Math.max(value, 0)})`);
  const lift = useTransform(
    [mv, drop],
    ([held, falling]: number[]) =>
      `translateY(${(1 - held) * rise + Math.max(falling, 0) * sink}px)`
  );
  const ink = useTransform([mv, drop], ([held, falling]: number[]) =>
    clamp01(held) * (1 - clamp01(falling / SINK_FADE))
  );

  return (
    <span
      className="relative h-[var(--cs-height)] w-[var(--cs-size)] select-none overflow-hidden rounded-[var(--cs-radius)] bg-[var(--cs-slot)] [transition:background-color_200ms_ease] data-[active]:[background-color:color-mix(in_srgb,var(--cs-ink)_8%,var(--cs-slot))] in-data-[status=error]:[background-color:color-mix(in_srgb,var(--cs-danger)_20%,var(--cs-slot))]"
      data-active={active ? "" : undefined}
      data-filled={char ? "" : undefined}
      aria-hidden
    >
      <motion.span
        className="absolute inset-0 origin-center rounded-[inherit] bg-[var(--cs-accent)] [transition:background-color_200ms_ease] in-data-[status=error]:bg-[var(--cs-danger)]"
        style={{ transform: fill }}
      />
      {shown ? (
        <motion.span
          className="absolute inset-0 z-[2] grid place-items-center font-semibold tabular-nums leading-none [color:var(--cs-digit)] [font-family:inherit] [font-size:var(--cs-font)]"
          style={{ transform: lift, opacity: ink }}
        >
          {shown}
        </motion.span>
      ) : null}
    </span>
  );
}
