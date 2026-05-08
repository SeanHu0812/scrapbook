import Link from "next/link";
import { MapPin } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BottomNav } from "@/components/ui/BottomNav";
import { Card } from "@/components/ui/Card";
import { Polaroid } from "@/components/ui/Polaroid";
import { Tape } from "@/components/ui/Tape";
import { PhotoPlaceholder } from "@/components/ui/PhotoPlaceholder";
import { Sun, HeartTiny, Sparkle } from "@/components/decorations";
import { memories } from "@/lib/data";

export default function JournalPage() {
  // Group by month label
  const groups = new Map<string, typeof memories>();
  for (const m of memories) {
    const [y, mo] = m.date.split("-").map(Number);
    const label = `${monthName(mo)} ${y}`;
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label)!.push(m);
  }

  return (
    <PhoneFrame withNav>
      <header className="flex items-center justify-between py-2">
        <h1 className="handwrite text-[28px] text-ink">Journal</h1>
        <Sparkle className="h-6 w-6" />
      </header>
      <p className="hand text-[14px] text-brown/80 -mt-1">
        Every little moment, kept together.
      </p>

      <div className="mt-5 space-y-7">
        {[...groups.entries()].map(([label, list]) => (
          <section key={label}>
            <div className="mb-2 flex items-center gap-2">
              <span className="hand text-[14px] font-semibold tracking-wide text-brown">
                {label}
              </span>
              <span className="h-px flex-1 bg-border" />
              <span className="text-[12px] text-brown/70">
                {list.length} memor{list.length === 1 ? "y" : "ies"}
              </span>
            </div>

            <div className="space-y-4">
              {list.map((m, i) => (
                <Link
                  key={m.id}
                  href={`/memory/${m.id}`}
                  className="block"
                >
                  <Card tint="white" className="relative p-4">
                    <Tape
                      className={`-top-2 ${i % 2 ? "right-8" : "left-8"}`}
                      color={i % 2 ? "pink" : "yellow"}
                      rotate={i % 2 ? 6 : -6}
                    />
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-semibold text-ink">
                        {monthName(Number(m.date.split("-")[1]))}{" "}
                        {Number(m.date.split("-")[2])}
                      </span>
                      <span className="flex items-center gap-1 text-brown">
                        {m.weekday}
                        <Sun className="h-4 w-4" />
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-3">
                      <Polaroid
                        rotate={i % 2 ? 3 : -3}
                        tapeColor={i % 2 ? "blue" : "yellow"}
                        className="shrink-0"
                      >
                        <PhotoPlaceholder
                          scene={m.scene}
                          className="h-24 w-24"
                        />
                      </Polaroid>
                      <div className="flex-1">
                        <p className="hand text-[17px] font-semibold leading-tight text-ink">
                          {m.title}
                        </p>
                        <p className="mt-1 hand text-[13px] leading-snug text-brown line-clamp-2">
                          {m.body}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-[11px] text-brown/80">
                          {m.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {m.location}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <HeartTiny className="h-3 w-3" />
                            {m.likes}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      <BottomNav />
    </PhoneFrame>
  );
}

function monthName(m: number) {
  return [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ][m - 1];
}
