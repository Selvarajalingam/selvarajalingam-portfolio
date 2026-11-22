"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { canEnhanceSculpture } from "@/lib/sculpture-policy";

type ConnectionHints = EventTarget & { saveData?: boolean; effectiveType?: string };
type DeviceNavigator = Navigator & { deviceMemory?: number; connection?: ConnectionHints };

export function SculptureVisual() {
  const root = useRef<HTMLDivElement>(null);
  const mount = useRef<HTMLDivElement>(null);
  const [staticOnly, setStaticOnly] = useState(false);

  useEffect(() => {
    const element = root.current;
    const host = mount.current;
    if (!element || !host) return;
    const desktop = matchMedia("(min-width: 1024px) and (hover: hover) and (pointer: fine)");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const device = navigator as DeviceNavigator;
    let dispose: (() => void) | undefined;
    let observer: IntersectionObserver | undefined;
    let idle: number | undefined;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let generation = 0;

    function reset() {
      generation++;
      observer?.disconnect();
      if (idle !== undefined) window.cancelIdleCallback(idle);
      clearTimeout(timer);
      dispose?.();
      dispose = undefined;
      element!.dataset.renderer = "fallback";
    }
    function update() {
      reset();
      const eligible = canEnhanceSculpture({ desktop: desktop.matches, reducedMotion: reduced.matches, saveData: Boolean(device.connection?.saveData), cores: device.hardwareConcurrency, memory: device.deviceMemory, effectiveType: device.connection?.effectiveType });
      element!.dataset.eligible = String(eligible);
      if (!eligible || staticOnly) return;
      const current = generation;
      const load = () => {
        void import("./sculpture-scene").then(({ mountSculpture }) => {
          if (current !== generation) return;
          try {
            dispose = mountSculpture(host!, () => { reset(); element!.dataset.eligible = "false"; }, () => {
              if (current === generation) element!.dataset.renderer = "webgl";
            });
          } catch {
            reset();
            element!.dataset.eligible = "false";
          }
        }).catch(() => { if (current === generation) reset(); });
      };
      observer = new IntersectionObserver((entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer?.disconnect();
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(load, { timeout: 2000 });
        else timer = setTimeout(load, 400);
      });
      observer.observe(element!);
    }
    update();
    desktop.addEventListener("change", update);
    reduced.addEventListener("change", update);
    device.connection?.addEventListener("change", update);
    return () => {
      reset();
      desktop.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      device.connection?.removeEventListener("change", update);
    };
  }, [staticOnly]);

  return <div className="hero-art" ref={root} data-renderer="fallback" data-eligible="false">
    <div className="sculpture-viewport" aria-hidden="true">
      <Image className="sculpture-fallback" src="/assets/hero/fallback/sculpture.svg" alt="" width={560} height={560} unoptimized priority />
      <div className="sculpture-canvas" ref={mount} />
    </div>
    <button className="sculpture-control text-link" aria-pressed={staticOnly} onClick={() => setStaticOnly(!staticOnly)}>{staticOnly ? "Use 3D artwork" : "Use static artwork"}</button>
  </div>;
}
