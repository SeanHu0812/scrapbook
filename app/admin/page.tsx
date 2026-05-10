"use client";

import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

export default function AdminPage() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const router = useRouter();

  const adminCheck = useQuery(api.admin.isAdmin, isAuthenticated ? {} : "skip");
  const users = useQuery(api.admin.listUsers, adminCheck === true ? {} : "skip");
  const invites = useQuery(api.admin.listInvites, adminCheck === true ? {} : "skip");
  const deleteUser = useMutation(api.admin.deleteUser);
  const revokeInvite = useMutation(api.admin.revokeInvite);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/sign-in?next=/admin");
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || adminCheck === undefined) {
    return (
      <Shell>
        <p className="text-sm text-gray-400">Loading…</p>
      </Shell>
    );
  }

  if (!adminCheck) {
    return (
      <Shell>
        <p className="text-sm font-medium text-red-500">Access denied.</p>
      </Shell>
    );
  }

  async function handleDeleteUser(userId: Id<"users">, name: string) {
    if (!confirm(`Delete "${name || "this user"}"? This cannot be undone.`)) return;
    await deleteUser({ userId });
  }

  async function handleRevokeInvite(inviteId: Id<"invites">, code: string) {
    if (!confirm(`Revoke invite "${code}"?`)) return;
    await revokeInvite({ inviteId });
  }

  return (
    <Shell>
      <div className="space-y-12">
        {/* Users */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Users{users ? ` (${users.length})` : ""}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {!users ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                      Loading…
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                      No users
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {u.name || <span className="italic text-gray-400">unnamed</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{u.email}</td>
                      <td className="px-4 py-3 text-gray-500">{u.spaceName ?? "—"}</td>
                      <td className="px-4 py-3">
                        {u.spaceStatus ? (
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                              u.spaceStatus === "paired"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {u.spaceStatus}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {u.joinedAt ? new Date(u.joinedAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="text-xs font-medium text-red-400 hover:text-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Invites */}
        <section>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Invites{invites ? ` (${invites.length})` : ""}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-400">
                  <th className="px-4 py-3">Code</th>
                  <th className="px-4 py-3">Created by</th>
                  <th className="px-4 py-3">Space</th>
                  <th className="px-4 py-3">Used by</th>
                  <th className="px-4 py-3">Expires</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {!invites ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                      Loading…
                    </td>
                  </tr>
                ) : invites.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-400">
                      No invites
                    </td>
                  </tr>
                ) : (
                  invites.map((inv) => (
                    <tr key={inv._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">{inv.code}</td>
                      <td className="px-4 py-3 text-gray-500">
                        {inv.creatorName}
                        {inv.creatorEmail && (
                          <span className="ml-1 text-xs text-gray-400">({inv.creatorEmail})</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{inv.spaceName}</td>
                      <td className="px-4 py-3">
                        {inv.usedByName ? (
                          <span className="text-gray-700">{inv.usedByName}</span>
                        ) : (
                          <span className="text-xs text-gray-400">unused</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">
                        {inv.expiresAt ? new Date(inv.expiresAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {!inv.usedByName && (
                          <button
                            onClick={() => handleRevokeInvite(inv._id, inv.code)}
                            className="text-xs font-medium text-red-400 hover:text-red-600"
                          >
                            Revoke
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-gray-50">
      <header className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-base font-semibold text-gray-900">Admin</h1>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
