export const categoryLabels: Record<
  "errand" | "date" | "trip" | "read" | "home",
  { emoji: string; label: string; tint: string }
> = {
  errand: { emoji: "🌿", label: "errand", tint: "bg-green-soft" },
  date: { emoji: "🍰", label: "date", tint: "bg-pink-soft" },
  trip: { emoji: "✈️", label: "trip", tint: "bg-blue-soft" },
  read: { emoji: "📚", label: "read", tint: "bg-yellow-soft" },
  home: { emoji: "🏡", label: "home", tint: "bg-cream" },
};
