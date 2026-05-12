"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Locate, Loader2, X } from "lucide-react";

type Suggestion = {
  displayName: string;
  shortName: string;
  lat: string;
  lon: string;
};

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  compact?: boolean;
};

export function LocationSearch({ value, onChange, placeholder = "Search for a place…", compact = false }: Props) {
  const [query, setQuery] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const q = query.trim();
    if (!q || q === value) { setSuggestions([]); return; }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=0`,
          { headers: { Accept: "application/json" } }
        );
        const data = await res.json();
        setSuggestions(
          data.map((r: any) => ({
            displayName: r.display_name,
            shortName: r.name || r.display_name.split(",")[0].trim(),
            lat: r.lat,
            lon: r.lon,
          }))
        );
        setOpen(true);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400);
  }, [query]);

  function selectSuggestion(s: Suggestion) {
    const label = s.shortName || s.displayName.split(",")[0].trim();
    setQuery(label);
    onChange(label);
    setSuggestions([]);
    setOpen(false);
  }

  async function useCurrentLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, { timeout: 8000 })
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        { headers: { Accept: "application/json" } }
      );
      const data = await res.json();
      const addr = data.address ?? {};
      const label =
        addr.amenity ||
        addr.cafe ||
        addr.restaurant ||
        addr.shop ||
        addr.building ||
        addr.road
          ? [addr.amenity || addr.road, addr.city || addr.town || addr.village]
              .filter(Boolean)
              .join(", ")
          : data.display_name.split(",").slice(0, 2).join(",").trim();
      setQuery(label);
      onChange(label);
      setSuggestions([]);
      setOpen(false);
    } catch {
      // silently fail
    } finally {
      setLocating(false);
    }
  }

  function clear() {
    setQuery("");
    onChange("");
    setSuggestions([]);
    setOpen(false);
  }

  if (compact) {
    return (
      <div ref={containerRef} className="relative h-full">
        <div className="flex h-full items-center gap-1.5 px-2.5 py-2">
          <MapPin className="h-4 w-4 shrink-0 text-coral/70" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Add place…"
            className="flex-1 min-w-0 bg-transparent hand text-[12px] text-ink placeholder:text-brown/50 focus:outline-none"
          />
          {loading && <Loader2 className="h-3 w-3 shrink-0 animate-spin text-brown/50" />}
          {!loading && !query && (
            <button
              onClick={useCurrentLocation}
              disabled={locating}
              title="Use current location"
              className="shrink-0 text-brown/50 hover:text-coral disabled:opacity-50 transition"
            >
              {locating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Locate className="h-3 w-3" />}
            </button>
          )}
        </div>
        {open && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-border bg-white shadow-lg">
            {suggestions.map((s, i) => (
              <li key={i}>
                <button
                  onClick={() => selectSuggestion(s)}
                  className="flex w-full items-start gap-1.5 px-3 py-2 text-left hover:bg-pink-soft transition text-[12px] border-b border-border/40 last:border-b-0"
                >
                  <MapPin className="mt-0.5 h-3 w-3 shrink-0 text-coral/70" />
                  <p className="font-semibold text-ink leading-snug line-clamp-1">{s.shortName}</p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-3 py-3">
        <MapPin className="h-5 w-5 shrink-0 text-coral" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent hand text-[15px] text-ink placeholder:text-brown/50 focus:outline-none"
        />
        {loading && <Loader2 className="h-4 w-4 shrink-0 animate-spin text-brown/50" />}
        {!loading && query && (
          <button onClick={clear} className="shrink-0 text-brown/40 hover:text-coral">
            <X className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={useCurrentLocation}
          disabled={locating}
          title="Use current location"
          className="shrink-0 text-brown/50 hover:text-coral disabled:opacity-50 transition"
        >
          {locating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Locate className="h-4 w-4" />}
        </button>
      </div>

      {open && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-2xl border border-border bg-white shadow-lg">
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                onClick={() => selectSuggestion(s)}
                className="flex w-full items-start gap-2 px-4 py-3 text-left hover:bg-pink-soft transition text-[14px] border-b border-border/40 last:border-b-0"
              >
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-coral/70" />
                <div>
                  <p className="font-semibold text-ink leading-snug">{s.shortName}</p>
                  <p className="text-[12px] text-brown/60 line-clamp-1">{s.displayName}</p>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
