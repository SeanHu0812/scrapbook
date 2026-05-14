"use client";

import { useRef, useState, useEffect } from "react";
import { X, Check, Sparkles, Loader2 } from "lucide-react";

const CROP_SIZE = 280;

type Props = {
  imageUrl: string;
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
};

export function ImageCropModal({ imageUrl, onConfirm, onCancel }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const scaleRef = useRef(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const imgSizeRef = useRef({ w: 0, h: 0 });
  const dragRef = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);

  const [ready, setReady] = useState(false);
  const [, tick] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [aiSoon, setAiSoon] = useState(false);

  function redraw() {
    tick((n) => n + 1);
  }

  // Load image and set initial crop
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      const { naturalWidth: w, naturalHeight: h } = img;
      imgSizeRef.current = { w, h };
      const initScale = Math.max(CROP_SIZE / w, CROP_SIZE / h);
      scaleRef.current = initScale;
      offsetRef.current = {
        x: (w - CROP_SIZE / initScale) / 2,
        y: (h - CROP_SIZE / initScale) / 2,
      };
      setReady(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  // Draw canvas whenever state ticks
  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !ready) return;
    const ctx = canvas.getContext("2d")!;
    const s = scaleRef.current;
    const { x, y } = offsetRef.current;
    const srcW = CROP_SIZE / s;
    const srcH = CROP_SIZE / s;

    ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
    ctx.drawImage(img, x, y, srcW, srcH, 0, 0, CROP_SIZE, CROP_SIZE);

    // Circular clip
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(CROP_SIZE / 2, CROP_SIZE / 2, CROP_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  // Non-passive wheel listener
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const { w, h } = imgSizeRef.current;
      if (!w) return;
      const factor = e.deltaY < 0 ? 1.1 : 0.91;
      const minScale = Math.max(CROP_SIZE / w, CROP_SIZE / h);
      const s = scaleRef.current;
      const newS = Math.min(12, Math.max(minScale, s * factor));
      const srcW = CROP_SIZE / s;
      const srcH = CROP_SIZE / s;
      const cx = offsetRef.current.x + srcW / 2;
      const cy = offsetRef.current.y + srcH / 2;
      const newSrcW = CROP_SIZE / newS;
      const newSrcH = CROP_SIZE / newS;
      scaleRef.current = newS;
      offsetRef.current = {
        x: Math.max(0, Math.min(w - newSrcW, cx - newSrcW / 2)),
        y: Math.max(0, Math.min(h - newSrcH, cy - newSrcH / 2)),
      };
      tick((n) => n + 1);
    }
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [ready]);

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      px: e.clientX,
      py: e.clientY,
      ox: offsetRef.current.x,
      oy: offsetRef.current.y,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current) return;
    const { w, h } = imgSizeRef.current;
    const s = scaleRef.current;
    const dx = (e.clientX - dragRef.current.px) / s;
    const dy = (e.clientY - dragRef.current.py) / s;
    const srcW = CROP_SIZE / s;
    const srcH = CROP_SIZE / s;
    offsetRef.current = {
      x: Math.max(0, Math.min(w - srcW, dragRef.current.ox - dx)),
      y: Math.max(0, Math.min(h - srcH, dragRef.current.oy - dy)),
    };
    redraw();
  }

  function onPointerUp() {
    dragRef.current = null;
  }

  function handleConfirm() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExporting(true);
    canvas.toBlob(
      (blob) => {
        if (blob) onConfirm(blob);
        setExporting(false);
      },
      "image/jpeg",
      0.92,
    );
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm">
      <div className="w-full max-w-[440px] px-6 pb-8 pt-5">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onCancel}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          <p className="hand text-[17px] font-semibold text-white">Crop photo</p>
          <button
            onClick={handleConfirm}
            disabled={exporting || !ready}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-coral text-white disabled:opacity-50 transition"
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Canvas crop area */}
        <div className="flex justify-center mb-4">
          <div
            className="relative"
            style={{ width: CROP_SIZE, height: CROP_SIZE }}
          >
            <canvas
              ref={canvasRef}
              width={CROP_SIZE}
              height={CROP_SIZE}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className="rounded-full cursor-grab active:cursor-grabbing touch-none"
              style={{
                boxShadow:
                  "0 0 0 3px rgba(249,133,146,0.7), 0 0 0 9999px rgba(0,0,0,0.55)",
              }}
            />
            {!ready && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-white/10">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>
        </div>

        <p className="text-center text-[12px] text-white/50 mb-6">
          Drag to reposition · Scroll to zoom
        </p>

        {/* AI Stylize */}
        <button
          onClick={() => setAiSoon(true)}
          className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-white/15 bg-white/8 py-3.5 text-[14px] font-semibold text-white/80 hover:bg-white/12 transition"
        >
          <Sparkles className="h-4 w-4 text-yellow-300" />
          AI Stylize
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium text-white/50">
            coming soon
          </span>
        </button>

        {aiSoon && (
          <p className="mt-2 text-center text-[12px] text-white/50 animate-pulse">
            AI styling is on the way ✨
          </p>
        )}
      </div>
    </div>
  );
}
