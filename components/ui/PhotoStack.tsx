"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Loader2, Plus, X } from "lucide-react";
import { Tape } from "./Tape";

export type StackPhoto = {
  key: string;
  src: string;
  storageId?: string;
};

type Props = {
  photos: StackPhoto[];
  onAdd?: () => void;
  onRemove?: (storageId: string) => void;
  onTap?: (index: number) => void;
  uploading?: boolean;
};

// Visual offsets for the 2 cards peeking behind the front card
const PEEK = [
  { y: 9, rotate: 3.5, scale: 0.97 },
  { y: 18, rotate: -2.5, scale: 0.94 },
] as const;

export function PhotoStack({ photos, onAdd, onRemove, onTap, uploading = false }: Props) {
  const [current, setCurrent] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const startX = useRef<number | null>(null);
  const didDrag = useRef(false);

  const total = photos.length;

  // Keep current in bounds when photos change
  useEffect(() => {
    setCurrent((c) => Math.min(c, Math.max(0, total - 1)));
  }, [total]);

  const idx = Math.min(current, Math.max(0, total - 1));

  function prev() { setCurrent((c) => Math.max(0, c - 1)); }
  function next() { setCurrent((c) => Math.min(total - 1, c + 1)); }

  function pointerDown(clientX: number) {
    startX.current = clientX;
    didDrag.current = false;
    setDragging(true);
  }
  function pointerMove(clientX: number) {
    if (!dragging || startX.current === null) return;
    const dx = clientX - startX.current;
    if (Math.abs(dx) > 6) didDrag.current = true;
    setDragX(dx);
  }
  function pointerUp() {
    if (!dragging) return;
    if (!didDrag.current) {
      onTap?.(idx);
    } else if (dragX < -60) {
      next();
    } else if (dragX > 60) {
      prev();
    }
    setDragX(0);
    setDragging(false);
    startX.current = null;
  }

  if (total === 0) {
    return (
      <button
        onClick={onAdd}
        disabled={uploading}
        className="flex h-52 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-brown/40 text-brown/60 hover:border-coral hover:text-coral transition disabled:opacity-50"
      >
        {uploading
          ? <Loader2 className="h-6 w-6 animate-spin" />
          : <><Camera className="h-6 w-6 mb-2" /><span className="text-[13px]">Add photos</span></>
        }
      </button>
    );
  }

  // Render back-to-front so the active card is on top
  const renderIndices = [idx + 2, idx + 1, idx].filter((i) => i < total);

  return (
    <div className="flex flex-col items-center">
      {/* Stack — fixed size; peek cards overflow below */}
      <div
        className="relative mx-auto select-none"
        style={{ height: 224, width: 192, touchAction: "none" }}
        onMouseDown={(e) => pointerDown(e.clientX)}
        onMouseMove={(e) => { if (dragging) pointerMove(e.clientX); }}
        onMouseUp={pointerUp}
        onMouseLeave={pointerUp}
        onTouchStart={(e) => pointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => { e.preventDefault(); pointerMove(e.touches[0].clientX); }}
        onTouchEnd={pointerUp}
      >
        {renderIndices.map((photoIdx) => {
          const offset = photoIdx - idx; // 0 = front, 1 = second, 2 = third
          const isTop = offset === 0;
          const photo = photos[photoIdx];
          const peek = PEEK[offset - 1];

          const baseTransform = isTop
            ? `translate(${dragX}px, 0px) rotate(${dragX * 0.04}deg)`
            : `translateY(${peek.y}px) rotate(${peek.rotate}deg) scale(${peek.scale})`;

          const tapeColor = photoIdx % 2 === 0 ? "yellow" : "pink";
          const tapeRotate = photoIdx % 2 === 0 ? -8 : 7;

          return (
            <div
              key={photo.key}
              className="absolute inset-0"
              style={{
                zIndex: 10 - offset,
                transform: baseTransform,
                transition: dragging && isTop ? "none" : "transform 0.22s ease",
                transformOrigin: "center bottom",
                cursor: isTop ? "grab" : "default",
              }}
            >
              <Tape className="-top-3 left-8" color={tapeColor} rotate={tapeRotate} />
              <div className="h-full w-full overflow-hidden rounded-xl border-[5px] border-white shadow-[0_8px_18px_-10px_rgba(108,90,78,0.4)]">
                <img
                  src={photo.src}
                  alt=""
                  draggable={false}
                  className="h-full w-full object-cover pointer-events-none"
                />
              </div>
              {isTop && onRemove && photo.storageId && (
                <button
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  onClick={(e) => { e.stopPropagation(); onRemove(photo.storageId!); }}
                  className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white shadow"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      {total > 1 && (
        <div className="mt-8 flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`rounded-full transition-all duration-200 ${
                i === idx ? "h-2 w-5 bg-coral" : "h-2 w-2 bg-brown/30"
              }`}
            />
          ))}
        </div>
      )}

      {/* Add more button */}
      {onAdd && (
        <button
          onClick={onAdd}
          disabled={uploading}
          className="mt-4 flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 text-[13px] font-semibold text-brown hover:border-coral hover:text-coral transition disabled:opacity-50"
        >
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Add photo
        </button>
      )}
    </div>
  );
}
