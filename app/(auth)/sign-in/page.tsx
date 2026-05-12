"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/ui/AuthShell";
import { useAuth } from "@/lib/convex";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/home";
  const { isAuthenticated, isLoading, signIn } = useAuth();
  const justSignedInRef = useRef(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && justSignedInRef.current) {
      router.push(next);
    }
  }, [isLoading, isAuthenticated, next, router]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"apple" | "google" | null>(null);

  function validate() {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Enter a valid email address.";
    if (password.length < 8) return "Password must be at least 8 characters.";
    return null;
  }

  async function handleEmailSignIn(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError("");
    setLoading(true);
    try {
      const result = await signIn("password", { email, password, flow: "signIn" });
      if (!result.signingIn) {
        setError("Sign-in didn't complete — please try again.");
        return;
      }
      justSignedInRef.current = true;
      router.push(next);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Couldn't sign in. Check your details and try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOAuth(provider: "apple" | "google") {
    setOauthLoading(provider);
    try {
      const result = await signIn(provider);
      if (result.redirect) window.location.href = result.redirect.href;
    } catch {
      setError("OAuth sign-in failed. Please try again.");
      setOauthLoading(null);
    }
  }

  return (
    <AuthShell
      title="Welcome back 🌿"
      subtitle="collect little moments, together"
      footerText="Don't have an account?"
      footerLinkText="Create one"
      footerHref="/sign-up"
    >
      <form onSubmit={handleEmailSignIn} noValidate className="space-y-3">
        {/* Email */}
        <div>
          <label className="block hand text-[13px] text-brown/80 mb-1">Email</label>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-2xl border border-border bg-cream px-4 py-3 text-[15px] text-ink placeholder:text-brown/40 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition"
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="hand text-[13px] text-brown/80">Password</label>
            <Link href="#" className="hand text-[12px] text-coral">Forgot password?</Link>
          </div>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8+ characters"
            className="w-full rounded-2xl border border-border bg-cream px-4 py-3 text-[15px] text-ink placeholder:text-brown/40 focus:outline-none focus:border-coral focus:ring-1 focus:ring-coral transition"
          />
        </div>

        {/* Inline error */}
        {error && (
          <p className="hand text-[13px] text-coral">{error}</p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="mt-1 w-full flex items-center justify-center gap-2 rounded-2xl bg-coral py-3 hand text-[15px] font-semibold text-white shadow-sm disabled:opacity-60 transition active:scale-[0.98]"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Sign in
        </button>
      </form>

      {/* Divider */}
      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 border-t border-border" />
        <span className="hand text-[13px] text-brown/60">or</span>
        <div className="flex-1 border-t border-border" />
      </div>

      {/* OAuth */}
      <div className="space-y-2">
        <OAuthButton
          provider="apple"
          label="Continue with Apple"
          loading={oauthLoading === "apple"}
          onClick={() => handleOAuth("apple")}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.36.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
          }
        />
        <OAuthButton
          provider="google"
          label="Continue with Google"
          loading={oauthLoading === "google"}
          onClick={() => handleOAuth("google")}
          icon={
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
          }
        />
      </div>
    </AuthShell>
  );
}

function OAuthButton({
  label,
  loading,
  onClick,
  icon,
}: {
  provider: "apple" | "google";
  label: string;
  loading: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 rounded-2xl border border-border bg-white py-3 hand text-[14px] font-semibold text-ink shadow-sm disabled:opacity-60 transition active:scale-[0.98]"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      {label}
    </button>
  );
}
