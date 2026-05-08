import Image from "next/image";
import Link from "next/link";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { Cloud, HeartTiny, Sparkle } from "@/components/decorations";

export default function WelcomePage() {
  return (
    <PhoneFrame>
      <div className="relative flex min-h-[760px] flex-col">
        <Cloud className="absolute right-6 top-6 h-7 w-12 opacity-90" />
        <Sparkle className="absolute right-12 top-28 h-5 w-5" />
        <Sparkle className="absolute left-8 top-44 h-4 w-4" />

        <div className="flex flex-1 flex-col items-center justify-center gap-6 px-2 text-center">
          <h1 className="handwrite text-[44px] leading-[1.05] text-ink">
            Collect
            <br />
            little moments,
            <br />
            together <HeartTiny className="inline h-5 w-5 align-baseline" />
          </h1>

          <Image
            src="/welcome-couple.png"
            alt="Watercolor illustration of a couple holding flowers"
            width={560}
            height={760}
            priority
            className="h-auto w-[304px] max-w-full select-none"
          />
        </div>

        <div className="flex flex-col items-center gap-3 px-2 pb-10 pt-6">
          <Link
            href="/home"
            className="block w-full rounded-full bg-pink py-4 text-center text-[18px] font-semibold text-white shadow-[0_10px_24px_-10px_rgba(244,125,142,0.7)] transition active:scale-[0.98]"
          >
            Get started
          </Link>
          <Link
            href="/home"
            className="text-[14px] text-brown/80 underline-offset-4 hover:underline"
          >
            I already have an account
          </Link>
        </div>
      </div>
    </PhoneFrame>
  );
}
