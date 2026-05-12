import { RequireAuth } from "@/components/ui/RequireAuth";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>;
}
