import { SVGProps } from "react";

type Props = SVGProps<SVGSVGElement>;

export function Cloud(props: Props) {
  return (
    <svg viewBox="0 0 60 32" fill="none" {...props}>
      <path
        d="M14 22c-5 0-9-3.5-9-8s4-8 9-8c1.6 0 3 .4 4.2 1.1C20.6 4 24.5 1.5 29 1.5c6.6 0 12 5 12 11.2v.3c4.6.4 8 4 8 8.2 0 4.6-4 8.3-9 8.3H14z"
        fill="#CFE9FA"
        stroke="#2F2A28"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Sparkle(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 2c.6 4 1.6 5 5.5 5.5C13.6 8.4 12.6 9.4 12 13c-.6-3.6-1.6-4.6-5.5-5.5C10.4 7 11.4 6 12 2z"
        fill="#FFD479"
      />
      <path
        d="M19 14c.4 2.5 1 3.1 3.4 3.5-2.4.4-3 1-3.4 3.5-.4-2.5-1-3.1-3.4-3.5 2.4-.4 3-1 3.4-3.5z"
        fill="#FFD479"
        opacity="0.85"
      />
    </svg>
  );
}

export function Heart(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21s-7-4.4-7-10.2C5 7.6 7.4 5.2 10.4 5.2c1.6 0 2.8.7 3.6 1.7C14.8 5.9 16 5.2 17.6 5.2 20.6 5.2 23 7.6 23 10.8 23 16.6 16 21 12 21z"
        fill="#F98592"
        stroke="#2F2A28"
        strokeOpacity="0.4"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartTiny(props: Props) {
  return (
    <svg viewBox="0 0 16 16" fill="none" {...props}>
      <path
        d="M8 13.5s-5-2.8-5-7C3 4.7 4.5 3.5 6 3.5c.9 0 1.6.4 2 1 .4-.6 1.1-1 2-1 1.5 0 3 1.2 3 3 0 4.2-5 7-5 7z"
        fill="#F98592"
      />
    </svg>
  );
}

export function Sun(props: Props) {
  return (
    <svg viewBox="0 0 64 64" fill="none" {...props}>
      <circle cx="32" cy="32" r="14" fill="#FFD479" />
      <g stroke="#FFD479" strokeWidth="3" strokeLinecap="round">
        <path d="M32 6v6" />
        <path d="M32 52v6" />
        <path d="M6 32h6" />
        <path d="M52 32h6" />
        <path d="M14 14l4 4" />
        <path d="M46 46l4 4" />
        <path d="M50 14l-4 4" />
        <path d="M14 50l4-4" />
      </g>
      <g fill="#2F2A28" opacity="0.7">
        <circle cx="27" cy="32" r="1.4" />
        <circle cx="37" cy="32" r="1.4" />
      </g>
      <path
        d="M28 36c1.2 1.4 2.6 2 4 2s2.8-.6 4-2"
        stroke="#2F2A28"
        strokeOpacity="0.7"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function Flower(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="6" r="3" fill="#F8B4B9" />
      <circle cx="6" cy="12" r="3" fill="#F8B4B9" />
      <circle cx="18" cy="12" r="3" fill="#F8B4B9" />
      <circle cx="12" cy="18" r="3" fill="#F8B4B9" />
      <circle cx="12" cy="12" r="2.4" fill="#FFD479" />
    </svg>
  );
}

export function Sprout(props: Props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M12 21V12"
        stroke="#6FA86C"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 13c-3-1-5-3-5-7 4 0 6 2 5 7z"
        fill="#A8D29E"
        stroke="#6FA86C"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M12 14c3-1 5-3 5-6-4 0-6 2-5 6z"
        fill="#CFE8C9"
        stroke="#6FA86C"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Squiggle(props: Props) {
  return (
    <svg viewBox="0 0 60 8" fill="none" {...props}>
      <path
        d="M2 5 Q10 1 18 5 T34 5 T50 5 T58 5"
        stroke="#F98592"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
