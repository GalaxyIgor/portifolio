"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const IDLE_MS = 1200;
const MIN_THUMB = 48;
/** Distância da borda direita (px) em que o mouse faz o trilho aparecer. */
const EDGE_PX = 24;

/**
 * Barra de rolagem própria, no estilo HUD. Some quando a página está parada e
 * reaparece com desfoque ao rolar, ao chegar com o mouse na borda direita ou
 * ao passar por cima. A haste pode ser arrastada e o trilho clicado.
 * É só visual: a rolagem nativa (roda, teclado, toque) continua igual.
 */
export function ScrollRail() {
  const rail = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLDivElement>(null);
  const hideTimer = useRef(0);
  const hovering = useRef(false);
  const draggingRef = useRef(false);
  const [visible, setVisible] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  const show = useCallback(() => {
    setVisible(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (!hovering.current && !draggingRef.current) setVisible(false);
    }, IDLE_MS);
  }, []);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const total = document.documentElement.scrollHeight;
      const view = window.innerHeight;
      const canScroll = total > view + 1;
      setScrollable(canScroll);
      const t = thumb.current;
      const r = rail.current;
      if (!t || !r || !canScroll) return;
      const track = r.clientHeight;
      const size = Math.max(MIN_THUMB, (view / total) * track);
      const progress = window.scrollY / (total - view);
      t.style.height = `${size}px`;
      t.style.transform = `translateY(${progress * (track - size)}px)`;
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const onScroll = () => {
      schedule();
      show();
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && window.innerWidth - e.clientX < EDGE_PX)
        show();
    };

    schedule();
    // A altura da página muda com imagens, fontes e troca de rota
    const resize = new ResizeObserver(schedule);
    resize.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(hideTimer.current);
      resize.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onMove);
    };
  }, [show]);

  // Arrastar a haste: o deslocamento do ponteiro vira rolagem proporcional
  const onThumbDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const t = thumb.current;
    const r = rail.current;
    if (!t || !r || e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    t.setPointerCapture(e.pointerId);

    const startY = e.clientY;
    const startScroll = window.scrollY;
    const ratio =
      (document.documentElement.scrollHeight - window.innerHeight) /
      Math.max(1, r.clientHeight - t.offsetHeight);

    draggingRef.current = true;
    setDragging(true);

    const move = (ev: PointerEvent) => {
      window.scrollTo({
        top: startScroll + (ev.clientY - startY) * ratio,
        behavior: "instant",
      });
    };
    const end = () => {
      t.removeEventListener("pointermove", move);
      t.removeEventListener("pointerup", end);
      t.removeEventListener("pointercancel", end);
      draggingRef.current = false;
      setDragging(false);
      show();
    };
    t.addEventListener("pointermove", move);
    t.addEventListener("pointerup", end);
    t.addEventListener("pointercancel", end);
  };

  // Clique no trilho: vai para aquele ponto da página
  const onTrackDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = rail.current;
    if (!r || e.button !== 0) return;
    const fraction =
      (e.clientY - r.getBoundingClientRect().top) / r.clientHeight;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: fraction * max });
  };

  return (
    <div
      ref={rail}
      aria-hidden
      hidden={!scrollable}
      data-visible={visible || dragging ? "" : undefined}
      data-dragging={dragging ? "" : undefined}
      onPointerDown={onTrackDown}
      onPointerEnter={() => {
        hovering.current = true;
        show();
      }}
      onPointerLeave={() => {
        hovering.current = false;
        show();
      }}
      className="scroll-rail fixed inset-y-0 right-0 z-[70] w-3 [@media(pointer:coarse)]:pointer-events-none"
    >
      <div className="absolute inset-y-0 left-0 w-px bg-line" />
      <div
        ref={thumb}
        onPointerDown={onThumbDown}
        className="scroll-rail-thumb absolute top-0 left-0 w-full cursor-grab touch-none active:cursor-grabbing"
      />
    </div>
  );
}
