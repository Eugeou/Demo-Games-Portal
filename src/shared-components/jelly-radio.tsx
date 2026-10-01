import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  animate,
  motion,
  motionValue,
  useReducedMotion,
  useTransform,
  type HTMLMotionProps,
  type MotionValue,
} from "framer-motion";

export type JellyRadioItem =
  | string
  | { value: string; label: ReactNode; icon?: ReactNode; disabled?: boolean };

export type JellyRadioProps = {
  items?: JellyRadioItem[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, index: number) => void;
  chipColor?: string;
  activeColor?: string;
  textColor?: string;
  activeTextColor?: string;
  size?: "sm" | "md" | "lg";
  gap?: number;
  radius?: number;
  swell?: number;
  barge?: number;
  shrink?: number;
  jelly?: number;
  bounce?: number;
  stagger?: number;
  stiffness?: number;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
};

type ChipValues = {
  x: MotionValue<number>;
  sx: MotionValue<number>;
  sy: MotionValue<number>;
};

type ChipProps = HTMLMotionProps<"button"> & {
  mv: ChipValues;
};

type Config = {
  swell: number;
  barge: number;
  shrink: number;
  jelly: number;
  bounce: number;
  stagger: number;
  stiffness: number;
  reduce: boolean | null;
  count: number;
};

const DEFAULT_ITEMS: JellyRadioItem[] = ["Off", "Low", "Medium", "High", "Max"];
const SIZES: Record<string, [number, number, number]> = {
  sm: [28, 12, 12],
  md: [36, 13, 16],
  lg: [44, 14, 20],
};

const spring = (k: number, m: number, bounce: number) => ({
  type: "spring" as const,
  stiffness: k,
  damping: 2 * Math.sqrt(k * m) * (1 - bounce),
  mass: m,
});

const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { mv, children, ...rest },
  ref
) {
  const transform = useTransform(
    () => `translateX(${mv.x.get()}px) scale(${mv.sx.get()}, ${mv.sy.get()})`
  );
  return (
    <motion.button ref={ref} style={{ transform }} {...rest}>
      {children}
    </motion.button>
  );
});

export default function JellyRadio({
  items = DEFAULT_ITEMS,
  value,
  defaultValue,
  onChange,
  chipColor = "rgb(var(--lift))",
  activeColor = "rgb(var(--brand))",
  textColor = "rgb(var(--ink))",
  activeTextColor = "#ffffff",
  size = "md",
  gap = 8,
  radius = 18,
  swell = 0.2,
  barge = 6,
  shrink = 0.05,
  jelly = 1,
  bounce = 0.25,
  stagger = 22,
  stiffness = 580,
  disabled = false,
  ariaLabel = "Options",
  className = "",
}: JellyRadioProps) {
  const list = items.map((item) =>
    typeof item === "string" ? { value: item, label: item } : item
  );
  const [inner, setInner] = useState(() => defaultValue ?? list[0]?.value);
  const current = value ?? inner;
  const at = Math.max(
    0,
    list.findIndex((item) => item.value === current)
  );
  const reduce = useReducedMotion();
  const groupRef = useRef<HTMLDivElement>(null);
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const widths = useRef<number[]>([]);
  const mvs = useRef<ChipValues[]>([]);
  const applied = useRef(at);
  const cfg = useRef<Config>({} as Config);
  cfg.current = {
    swell,
    barge,
    shrink,
    jelly,
    bounce,
    stagger,
    stiffness,
    reduce,
    count: list.length,
  };
  const [h, font, px] = SIZES[size] ?? SIZES.md;
  const itemsKey = list.map((item) => item.value).join("|");

  const mvFor = (index: number) => {
    let mv = mvs.current[index];
    if (!mv) {
      mv = { x: motionValue(0), sx: motionValue(1), sy: motionValue(1) };
      mvs.current[index] = mv;
    }
    return mv;
  };

  const apply = (sel: number, instant: boolean) => {
    const config = cfg.current;
    const group = groupRef.current;
    const rtl = group ? getComputedStyle(group).direction === "rtl" : false;
    const push = ((widths.current[sel] ?? 0) * config.swell) / 2 + config.barge;
    for (let i = 0; i < config.count; i += 1) {
      const mv = mvFor(i);
      const on = i === sel;
      const far = Math.abs(i - sel);
      const dir = Math.sign(i - sel) * (rtl ? -1 : 1);
      const x = dir * push;
      const s = on ? 1 + config.swell : 1 - config.shrink;
      if (instant || config.reduce) {
        mv.x.jump(x);
        mv.sx.jump(s);
        mv.sy.jump(s);
        continue;
      }
      const k = config.stiffness * (1 - 0.12 * Math.min(far, 3));
      const inFlight =
        mv.x.isAnimating() || mv.sx.isAnimating() || mv.sy.isAnimating();
      const delay = inFlight ? 0 : (far * config.stagger) / 1000;
      void animate(mv.x, x, { ...spring(k, 0.9, config.bounce), delay });
      const j = config.jelly;
      void animate(mv.sx, s, {
        ...spring(
          k * (1 + 0.24 * j),
          0.9 - 0.1 * j,
          Math.min(0.85, config.bounce + 0.3 * j)
        ),
        delay,
      });
      void animate(mv.sy, s, {
        ...spring(k * (1 - 0.14 * j), 0.9 + 0.05 * j, config.bounce),
        delay: delay + 0.05 * j,
      });
    }
  };

  const measure = () => {
    const group = groupRef.current;
    if (!group) {
      return;
    }
    widths.current = chipRefs.current.map((el) => el?.offsetWidth ?? 0);
    const chipH = chipRefs.current[0]?.offsetHeight ?? 0;
    const maxW = Math.max(0, ...widths.current);
    group.style.setProperty(
      "--jr-pad-x",
      `${Math.ceil((maxW * swell * 1.3) / 2 + barge) + 2}px`
    );
    group.style.setProperty("--jr-pad-y", `${Math.ceil((chipH * swell) / 2) + 2}px`);
  };

  useLayoutEffect(() => {
    const settle = () => {
      measure();
      apply(applied.current, true);
    };
    settle();
    const observer = new ResizeObserver(settle);
    if (groupRef.current) {
      observer.observe(groupRef.current);
    }
    void document.fonts?.ready.then(settle);
    return () => observer.disconnect();
  }, [itemsKey, size, gap, swell, barge, shrink]);

  useEffect(() => {
    if (applied.current === at) {
      return;
    }
    applied.current = at;
    apply(at, true);
  }, [at]);

  useEffect(
    () => () => {
      mvs.current.forEach((mv) => {
        mv.x.destroy();
        mv.sx.destroy();
        mv.sy.destroy();
      });
    },
    []
  );

  const commit = (index: number, instant: boolean) => {
    if (disabled || index === at || !list[index] || list[index].disabled) {
      return;
    }
    applied.current = index;
    apply(index, instant);
    if (value === undefined) {
      setInner(list[index].value);
    }
    onChange?.(list[index].value, index);
  };

  const stepFrom = (index: number, dir: number) => {
    const n = list.length;
    let next = index;
    for (let tries = 0; tries < n; tries += 1) {
      next = (next + dir + n) % n;
      if (!list[next].disabled) {
        return next;
      }
    }
    return index;
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next: number | null = null;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      next = stepFrom(index, 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      next = stepFrom(index, -1);
    } else if (event.key === "Home") {
      next = stepFrom(-1, 1);
    } else if (event.key === "End") {
      next = stepFrom(list.length, -1);
    } else if (event.key === " " || event.key === "Enter") {
      next = index;
    }
    if (next === null) {
      return;
    }
    event.preventDefault();
    commit(next, true);
    chipRefs.current[next]?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      data-disabled={disabled ? "" : undefined}
      className={`group inline-flex select-none items-center gap-[var(--jr-gap)] px-[var(--jr-pad-x)] py-[var(--jr-pad-y)] [-webkit-touch-callout:none] data-[disabled]:pointer-events-none data-[disabled]:opacity-50${className ? ` ${className}` : ""}`}
      style={
        {
          "--jr-chip": chipColor,
          "--jr-active": activeColor,
          "--jr-text": textColor,
          "--jr-active-text": activeTextColor,
          "--jr-gap": `${gap}px`,
          "--jr-radius": `${radius}px`,
          "--jr-h": `${h}px`,
          "--jr-font": `${font}px`,
          "--jr-px": `${px}px`,
        } as CSSProperties
      }
    >
      {list.map((item, index) => (
        <Chip
          key={item.value}
          mv={mvFor(index)}
          ref={(el) => {
            chipRefs.current[index] = el;
          }}
          type="button"
          role="radio"
          aria-checked={index === at}
          tabIndex={index === at ? 0 : -1}
          disabled={disabled || Boolean(item.disabled)}
          className="group/chip relative m-0 origin-center cursor-pointer touch-manipulation border-0 bg-transparent p-0 text-inherit outline-none [font:inherit] [-webkit-tap-highlight-color:transparent] data-[on=true]:cursor-default disabled:cursor-default disabled:opacity-40 group-data-[disabled]:disabled:opacity-100"
          data-on={index === at ? "true" : "false"}
          onClick={(event) => commit(index, event.detail === 0)}
          onKeyDown={(event) => onKeyDown(event, index)}
        >
          <span className="relative inline-flex h-[var(--jr-h)] items-center justify-center gap-[0.4em] overflow-hidden whitespace-nowrap rounded-[var(--jr-radius)] bg-[var(--jr-chip)] px-[var(--jr-px)] text-[length:var(--jr-font)] font-semibold leading-none text-[var(--jr-text)] transition-[transform,background-color,color] duration-200 ease-out before:pointer-events-none before:absolute before:inset-0 before:bg-[var(--jr-text)] before:opacity-0 before:content-[''] before:transition-opacity before:duration-160 group-active/chip:scale-[0.97] group-data-[on=true]/chip:bg-[var(--jr-active)] group-data-[on=true]/chip:text-[var(--jr-active-text)] motion-reduce:group-active/chip:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/chip:group-enabled/chip:group-data-[on=false]/chip:before:opacity-[0.11]">
            {item.icon ? <span className="inline-flex">{item.icon}</span> : null}
            <span className="jelly-radio__label">{item.label}</span>
          </span>
        </Chip>
      ))}
    </div>
  );
}
