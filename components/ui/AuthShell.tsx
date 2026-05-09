import { ReactNode } from "react";
import Link from "next/link";
import { PhoneFrame } from "./PhoneFrame";
import { Card } from "./Card";
import { Heart, Sparkle, Flower } from "@/components/decorations";

type Props = {
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
  children: ReactNode;
};

export function AuthShell({
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerHref,
  children,
}: Props) {
  return (
    <PhoneFrame>
      {/* Header */}
      <div className="relative mt-6 mb-8 text-center">
        <div className="absolute -top-1 left-4 opacity-70">
          <Flower className="h-7 w-7" />
        </div>
        <div className="absolute top-0 right-6 opacity-60">
          <Sparkle className="h-6 w-6" />
        </div>
        <p className="handwrite text-[32px] text-coral leading-none">scrapbook</p>
        <div className="mt-1 flex items-center justify-center gap-1">
          <Heart className="h-4 w-4" />
        </div>
        <p className="mt-1 hand text-[13px] text-brown/70">{subtitle}</p>
      </div>

      {/* Form card */}
      <Card tint="white" className="px-5 py-6">
        <h1 className="hand text-[20px] font-semibold text-ink mb-5">{title}</h1>
        {children}
      </Card>

      {/* Footer link */}
      <p className="mt-5 text-center hand text-[14px] text-brown/80">
        {footerText}{" "}
        <Link href={footerHref} className="text-coral font-semibold underline-offset-2 hover:underline">
          {footerLinkText}
        </Link>
      </p>
    </PhoneFrame>
  );
}
