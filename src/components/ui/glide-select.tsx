"use client";

// Adapted from React Bits GlideSelect (JS/CSS source supplied by the user).
// Strict types, measured rows, scrolling, viewport positioning and form integration.
import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";

export type GlideOption = { value: string; label: string; tag?: string };
type Props = {
  options: readonly (string | GlideOption)[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string, option: GlideOption) => void;
  placeholder?: string;
  ariaLabel?: string;
  id?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  showTags?: boolean;
  accentColor?: string;
  surfaceColor?: string;
  highlightColor?: string;
  textColor?: string;
  size?: "sm" | "md" | "lg";
  radius?: number;
  menuWidth?: number;
  placement?: "bottom" | "top";
  align?: "left" | "right";
  popDuration?: number;
  glideDuration?: number;
  rememberPosition?: boolean;
  className?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

export default function GlideSelect({ options, value, defaultValue = "", onChange, placeholder = "Select…", ariaLabel = "Select", id: suppliedId, name, required, disabled = false, showTags = true, accentColor = "var(--accent)", surfaceColor = "var(--surface)", highlightColor = "var(--select-highlight)", textColor = "var(--text)", size = "lg", radius = 10, menuWidth = 240, placement = "bottom", align = "left", popDuration = 180, glideDuration = 220, rememberPosition = true, className = "", "aria-invalid": invalid, "aria-describedby": describedBy }: Props) {
  const generatedId = useId();
  const id = suppliedId ?? `glide-${generatedId}`;
  const items = options.map((option) => typeof option === "string" ? { value: option, label: option } : option);
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const selected = items.findIndex((item) => item.value === current);
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");
  const [active, setActive] = useState<number | null>(null);
  const [swap, setSwap] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const scrub = useRef<number | null>(null);
  const typeahead = useRef({ text: "", time: 0 });
  const live = phase !== "closed" && !disabled;

  function open(viaKey: boolean, last = false) {
    if (disabled || !items.length) return;
    clearTimeout(closeTimer.current);
    setActive(selected >= 0 ? selected : viaKey ? last ? items.length - 1 : 0 : null);
    setPhase("open");
  }
  function close(animate = false) {
    clearTimeout(closeTimer.current);
    scrub.current = null;
    setActive(null);
    if (animate && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("closing");
      closeTimer.current = setTimeout(() => setPhase("closed"), Math.round(popDuration * 2 / 3));
    } else setPhase("closed");
  }
  function pick(index: number) {
    const item = items[index];
    if (!item || disabled || trigger.current?.matches(":disabled")) return;
    if (item.value !== current) {
      if (value === undefined) setInner(item.value);
      onChange?.(item.value, item);
      setSwap(true);
    }
    close();
    trigger.current?.focus({ preventScroll: true });
  }

  useLayoutEffect(() => {
    if (!live) return;
    const anchor = trigger.current;
    const panel = menu.current;
    if (!anchor || !panel) return;
    function position() {
      const rect = anchor!.getBoundingClientRect();
      const viewport = window.visualViewport;
      const leftEdge = (viewport?.offsetLeft ?? 0) + 8;
      const topEdge = (viewport?.offsetTop ?? 0) + 8;
      const rightEdge = leftEdge + (viewport?.width ?? innerWidth) - 16;
      const bottomEdge = topEdge + (viewport?.height ?? innerHeight) - 16;
      const width = Math.min(Math.max(rect.width, menuWidth), rightEdge - leftEdge);
      panel!.style.width = `${Math.max(0, width)}px`;
      panel!.style.left = `${Math.max(leftEdge, Math.min(align === "right" ? rect.right - width : rect.left, rightEdge - width))}px`;
      const below = Math.max(0, bottomEdge - rect.bottom - 6);
      const above = Math.max(0, rect.top - topEdge - 6);
      const desired = Math.min(panel!.scrollHeight, 360);
      const side = placement === "bottom" ? below >= desired || below >= above ? "bottom" : "top" : above >= desired || above >= below ? "top" : "bottom";
      panel!.dataset.side = side;
      panel!.style.maxHeight = `${Math.min(360, side === "bottom" ? below : above)}px`;
      panel!.style.top = `${side === "bottom" ? rect.bottom + 6 : Math.max(topEdge, rect.top - 6 - Math.min(desired, above))}px`;
      panel!.style.setProperty("--gs-origin", `${side === "bottom" ? "top" : "bottom"} ${align}`);
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(anchor);
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    window.visualViewport?.addEventListener("resize", position);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
      window.visualViewport?.removeEventListener("resize", position);
    };
  }, [live, menuWidth, placement, align, items.length]);

  useLayoutEffect(() => {
    if (!live || !pill.current || !list.current) return;
    const row = active === null ? null : document.getElementById(`${id}-${active}`);
    pill.current.style.opacity = row ? "1" : "0";
    if (row) {
      pill.current.style.transform = `translateY(${row.offsetTop}px)`;
      pill.current.style.height = `${row.offsetHeight}px`;
      const panel = menu.current!;
      const top = row.offsetTop + 4;
      if (top < panel.scrollTop) panel.scrollTop = top;
      else if (top + row.offsetHeight > panel.scrollTop + panel.clientHeight) panel.scrollTop = top + row.offsetHeight - panel.clientHeight;
    }
  }, [active, live, id]);

  useEffect(() => {
    if (!live) return;
    function onDown(event: PointerEvent) {
      if (event.target instanceof Node && !trigger.current?.contains(event.target) && !menu.current?.contains(event.target)) close(true);
    }
    document.addEventListener("pointerdown", onDown, true);
    return () => document.removeEventListener("pointerdown", onDown, true);
    // close only reads immutable animation configuration for this open session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [live, popDuration]);
  useEffect(() => () => clearTimeout(closeTimer.current), []);
  useEffect(() => {
    // A parent can disable an already-open control (for example during submission).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (disabled) close();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disabled]);

  function onKey(event: KeyboardEvent<HTMLButtonElement>) {
    const key = event.key;
    const isOpen = phase === "open";
    const cur = active ?? Math.max(0, selected);
    const go = (index: number) => { event.preventDefault(); setActive(Math.max(0, Math.min(items.length - 1, index))); };
    if (key === "Escape" && isOpen) { event.preventDefault(); event.stopPropagation(); close(); }
    else if (key === "Tab") close();
    else if (["Enter", " ", "ArrowDown", "ArrowUp", "Home", "End"].includes(key)) {
      event.preventDefault();
      if (!isOpen) { open(true, key === "ArrowUp" || key === "End"); if (key === "Home" || key === "End") setActive(key === "Home" ? 0 : items.length - 1); }
      else if (key === "Enter" || key === " ") pick(cur);
      else go(key === "Home" ? 0 : key === "End" ? items.length - 1 : cur + (key === "ArrowDown" ? 1 : -1));
    } else if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      event.preventDefault();
      const now = Date.now();
      const previous = now - typeahead.current.time < 700 ? typeahead.current.text : "";
      const text = previous + key.toLowerCase();
      typeahead.current = { text, time: now };
      const term = [...text].every((char) => char === text[0]) ? key.toLowerCase() : text;
      const start = term.length > 1 ? cur - 1 : cur;
      for (let offset = 1; offset <= items.length; offset++) {
        const index = (start + offset + items.length) % items.length;
        if (items[index]!.label.toLowerCase().startsWith(term)) { if (!isOpen) open(true); setActive(index); break; }
      }
    }
  }
  function rowAt(y: number) {
    return items.findIndex((_, index) => {
      const rect = document.getElementById(`${id}-${index}`)?.getBoundingClientRect();
      return rect && y >= rect.top && y <= rect.bottom;
    });
  }
  const variables = { "--gs-accent": accentColor, "--gs-surface": surfaceColor, "--gs-highlight": highlightColor, "--gs-text": textColor, "--gs-radius": `${radius}px`, "--gs-inner-radius": `${Math.max(3, radius - 4)}px`, "--gs-font": size === "sm" ? ".8125rem" : size === "md" ? ".875rem" : "1rem", "--gs-pop": `${popDuration}ms`, "--gs-pop-out": `${Math.round(popDuration * 2 / 3)}ms`, "--gs-glide": `${glideDuration}ms` } as CSSProperties;

  return <div className={`glide-select ${className}`} data-size={size} data-disabled={disabled || undefined} data-swap={swap || undefined} style={variables}>
    {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    <button id={id} ref={trigger} type="button" role="combobox" aria-haspopup="listbox" aria-expanded={live && phase === "open"} aria-controls={live ? `${id}-list` : undefined} aria-activedescendant={live && active !== null ? `${id}-${active}` : undefined} aria-label={ariaLabel} aria-required={required || undefined} aria-invalid={invalid} aria-describedby={describedBy} disabled={disabled || !items.length} className="glide-select__trigger" data-value={current} onClick={() => phase === "open" ? close(true) : open(false)} onKeyDown={onKey} onBlur={(event) => { if (event.relatedTarget instanceof Node && !menu.current?.contains(event.relatedTarget)) close(); }}>
      <span className="glide-select__label" key={current} data-empty={selected < 0 || undefined} onAnimationEnd={() => setSwap(false)}>{selected >= 0 ? items[selected]!.label : placeholder}</span>
      <svg className="glide-select__chevron" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
    {live && createPortal(<div id={`${id}-list`} ref={menu} role="listbox" aria-label={ariaLabel} className="glide-select__menu" style={variables} data-state={phase} onPointerDown={(event) => { if (event.pointerType === "mouse") event.preventDefault(); }}>
      <div ref={list} className="glide-select__list" data-live={active !== null || undefined}
        onPointerLeave={() => { if (scrub.current === null && !rememberPosition) setActive(null); }}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse" || event.button !== 0 || phase !== "open") return;
          event.preventDefault(); event.currentTarget.setPointerCapture(event.pointerId); scrub.current = event.pointerId;
          const index = rowAt(event.clientY); if (index >= 0) setActive(index);
        }}
        onPointerMove={(event) => { if (event.pointerType !== "mouse") return; const index = rowAt(event.clientY); if (index >= 0) setActive(index); }}
        onPointerUp={(event) => { if (scrub.current !== event.pointerId) return; scrub.current = null; const index = rowAt(event.clientY); if (index >= 0) pick(index); }}
        onPointerCancel={() => { scrub.current = null; }} onLostPointerCapture={() => { scrub.current = null; }}>
        <span ref={pill} className="glide-select__pill" aria-hidden="true" />
        {items.map((item, index) => <div key={item.value} id={`${id}-${index}`} role="option" aria-selected={index === selected} data-index={index} data-value={item.value} className="glide-select__option" onClick={() => pick(index)}>
          <span className="glide-select__name">{item.label}</span>{showTags && item.tag && <span className="glide-select__tag">{item.tag}</span>}
          <svg className="glide-select__check" data-on={index === selected || undefined} aria-hidden="true" viewBox="0 0 16 16" width="16" height="16" fill="none"><path d="m3 8 3 3 7-7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>)}
      </div>
    </div>, document.body)}
  </div>;
}
