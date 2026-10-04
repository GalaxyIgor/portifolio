"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { ProjectMedia } from "@/data/projects";
import type { Locale } from "@/i18n/routing";
import { PosterFrame } from "@/components/ui/PosterFrame";
import { Sparkle } from "@/components/ui/Sparkle";

type Props = {
  media?: ProjectMedia[];
  locale: Locale;
  projectTitle: string;
};

function PlayIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-10"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m10 8 6 4-6 4Z" />
    </svg>
  );
}

export function ProjectGallery({ media, ...props }: Props) {
  if (!media?.length) return null;
  return <GalleryViewer media={media} {...props} />;
}

function GalleryViewer({
  media,
  locale,
  projectTitle,
}: Props & { media: ProjectMedia[] }) {
  const t = useTranslations("projects.gallery");
  const headingId = useId();
  const modalHeadingId = useId();
  const captionId = useId();
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const backdropStart = useRef(false);
  const swipe = useRef<{ id: number; x: number; y: number } | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const isOpen = selected !== null;
  const item = selected === null ? null : media[selected];

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    dialog.current?.showModal();
    closeButton.current?.focus();
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    const element = dialog.current;
    return () => {
      element?.querySelector("video")?.pause();
      if (element?.open) element.close();
    };
  }, []);

  function finishClose() {
    video.current?.pause();
    setSelected(null);
    opener.current?.focus();
    swipe.current = null;
  }

  function close() {
    video.current?.pause();
    dialog.current?.close();
    finishClose();
  }

  function move(direction: number) {
    if (media.length < 2) return;
    video.current?.pause();
    swipe.current = null;
    setSelected((current) =>
      current === null
        ? null
        : (current + direction + media.length) % media.length,
    );
  }

  return (
    <section className="project-gallery mt-20" aria-labelledby={headingId}>
      <div className="mb-8 flex items-center gap-3">
        <Sparkle className="size-3 text-accent" />
        <h2 id={headingId} className="font-display text-4xl">
          {t("title")}
        </h2>
        <span aria-hidden="true" className="h-px flex-1 bg-line" />
      </div>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((entry, index) => {
          const thumbnail = entry.type === "image" ? entry.src : entry.poster;
          return (
            <li key={`${entry.src}-${index}`}>
              <button
                type="button"
                className="gallery-thumbnail w-full text-left"
                aria-haspopup="dialog"
                aria-label={t("open", {
                  type: t(entry.type),
                  caption: entry.caption[locale],
                })}
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setSelected(index);
                }}
              >
                <PosterFrame className="aspect-[16/10]">
                  {thumbnail && (
                    <Image
                      src={thumbnail}
                      alt={entry.type === "image" ? entry.alt[locale] : ""}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                  {entry.type === "video" && (
                    <span className="absolute inset-0 grid place-items-center bg-bg/30 text-ink">
                      <PlayIcon />
                    </span>
                  )}
                </PosterFrame>
                <span className="mt-3 block label-hud text-muted">
                  {t(entry.type)}
                </span>
                <span className="gallery-thumbnail-caption mt-1 block text-xl leading-snug">
                  {entry.caption[locale]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-labelledby={modalHeadingId}
        aria-describedby={captionId}
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={finishClose}
        onPointerDown={(event) => {
          backdropStart.current = event.target === event.currentTarget;
        }}
        onClick={(event) => {
          if (backdropStart.current && event.target === event.currentTarget)
            close();
        }}
        onKeyDown={(event) => {
          // As setas continuam disponíveis para volume e navegação no vídeo.
          if (
            event.target instanceof HTMLElement &&
            event.target.closest("video")
          )
            return;
          if (event.key === "Tab") {
            const controls = event.currentTarget.querySelectorAll<HTMLElement>(
              "button:not([disabled]), video[controls]",
            );
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault();
              last?.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault();
              first?.focus();
            }
          }
          if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
            event.preventDefault();
            move(event.key === "ArrowRight" ? 1 : -1);
          }
        }}
      >
        <div className="gallery-panel">
          <header className="flex items-center justify-between gap-4 border-b border-line px-4 py-2 sm:px-6">
            <h2
              id={modalHeadingId}
              className="min-w-0 font-display text-2xl sm:text-3xl"
            >
              {t("title")} — {projectTitle}
            </h2>
            <button
              ref={closeButton}
              type="button"
              className="ritual-control grid size-11 shrink-0 place-items-center text-2xl"
              aria-label={t("close")}
              onClick={close}
            >
              <span aria-hidden="true">×</span>
            </button>
          </header>
          {item && (
            <figure>
              {item.type === "image" ? (
                <div
                  className="gallery-stage gallery-image-stage"
                  onPointerDown={(event) => {
                    if (event.pointerType !== "touch") return;
                    swipe.current = {
                      id: event.pointerId,
                      x: event.clientX,
                      y: event.clientY,
                    };
                    event.currentTarget.setPointerCapture(event.pointerId);
                  }}
                  onPointerCancel={() => {
                    swipe.current = null;
                  }}
                  onPointerUp={(event) => {
                    const start = swipe.current;
                    swipe.current = null;
                    if (!start || start.id !== event.pointerId) return;
                    const dx = event.clientX - start.x;
                    const dy = event.clientY - start.y;
                    if (
                      Math.abs(dx) >= 48 &&
                      Math.abs(dx) > Math.abs(dy) * 1.25
                    )
                      move(dx < 0 ? 1 : -1);
                  }}
                >
                  <Image
                    key={item.src}
                    src={item.src}
                    alt={item.alt[locale]}
                    fill
                    sizes="95vw"
                    className="gallery-media-enter object-contain"
                    draggable={false}
                  />
                </div>
              ) : (
                <div className="gallery-stage">
                  <video
                    key={item.src}
                    ref={video}
                    src={item.src}
                    poster={item.poster}
                    controls
                    playsInline
                    preload="metadata"
                    aria-label={item.caption[locale]}
                    className="size-full object-contain"
                  >
                    {(["pt", "en"] as const).map((language) =>
                      item.captions?.[language] ? (
                        <track
                          key={language}
                          kind="captions"
                          src={item.captions[language]}
                          srcLang={language}
                          label={t(
                            language === "pt" ? "captionsPt" : "captionsEn",
                          )}
                          default={language === locale}
                        />
                      ) : null,
                    )}
                  </video>
                </div>
              )}
              <figcaption
                id={captionId}
                className="border-t border-line px-4 pt-4 text-lg sm:px-6"
              >
                {item.caption[locale]}
              </figcaption>
            </figure>
          )}
          <div className="flex items-center justify-between gap-2 px-4 py-4 sm:px-6">
            {media.length > 1 && (
              <button
                type="button"
                className="gallery-nav ritual-control"
                aria-label={t("previous")}
                onClick={() => move(-1)}
              >
                <span aria-hidden="true">←</span>
                <span className="hidden label-hud sm:inline">
                  {t("previous")}
                </span>
              </button>
            )}
            <p
              role="status"
              aria-live="polite"
              aria-atomic="true"
              className="mx-auto label-hud text-muted"
            >
              {t("position", {
                current: (selected ?? 0) + 1,
                total: media.length,
              })}
            </p>
            {media.length > 1 && (
              <button
                type="button"
                className="gallery-nav ritual-control"
                aria-label={t("next")}
                onClick={() => move(1)}
              >
                <span className="hidden label-hud sm:inline">{t("next")}</span>
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </div>
      </dialog>
    </section>
  );
}
