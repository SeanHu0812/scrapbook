"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Calendar as CalIcon, Sparkles, Loader2 } from "lucide-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { useSpace } from "@/lib/useSpace";
import { categoryLabels } from "@/lib/categories";

type Category = "errand" | "date" | "trip" | "read" | "home";

type ConvexTodo = {
  _id: Id<"todos">;
  title: string;
  notes?: string;
  assigneeId?: Id<"users">;
  category: Category;
  due?: string;
  done: boolean;
  createdBy: Id<"users">;
  createdAt: number;
  spaceId: Id<"spaces">;
};

export default function TodosPage() {
  const { status, members, currentUser } = useSpace();
  const isSolo = status === "solo";

  const todos = useQuery(api.todos.list);
  const createTodo = useMutation(api.todos.create);
  const toggleTodo = useMutation(api.todos.toggle);
  const removeTodo = useMutation(api.todos.remove);

  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);

  const open = (todos ?? []).filter((t) => !t.done);
  const done = (todos ?? []).filter((t) => t.done);

  async function add() {
    if (!newTitle.trim()) return;
    setAdding(true);
    try {
      await createTodo({ title: newTitle.trim(), category: "home" });
      setNewTitle("");
    } finally {
      setAdding(false);
    }
  }

  const isLoading = todos === undefined;

  return (
    <PhoneFrame>
      <BackHeader title="Our little list" />

      {/* Header with avatars */}
      <Card tint="white" className="mt-3 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          {members[0] && (
            <UserAvatar
              name={members[0].name}
              avatarPreset={members[0].avatarPreset}
              avatarUrl={members[0].avatarUrl}
              size={36}
            />
          )}
          {members[1] && (
            <UserAvatar
              name={members[1].name}
              avatarPreset={members[1].avatarPreset}
              avatarUrl={members[1].avatarUrl}
              size={36}
              className="-ml-2"
            />
          )}
          <span className="hand text-[15px] text-ink ml-1">
            {isSolo
              ? (members[0]?.name ?? "my list")
              : `${members[0]?.name} & ${members[1]?.name}`}
          </span>
        </div>
        <span className="text-[12px] text-brown/70">
          {open.length} open · {done.length} done
        </span>
      </Card>

      {/* Add new */}
      <div className="mt-3 flex items-center gap-2 rounded-2xl border border-border bg-white px-3 py-2">
        <button
          onClick={add}
          disabled={adding || !newTitle.trim()}
          aria-label="Add task"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-pink text-white shadow-sm disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
        </button>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") add(); }}
          placeholder="add a little task..."
          className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-brown/50 focus:outline-none"
        />
      </div>

      {isLoading ? (
        <div className="mt-5 space-y-2 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl bg-border" />
          ))}
        </div>
      ) : (
        <>
          {/* Open list */}
          {open.length > 0 && (
            <section className="mt-5">
              <h2 className="hand text-[15px] font-semibold text-brown/80">To do</h2>
              <ul className="mt-2 space-y-2">
                {open.map((t) => (
                  <TodoRow
                    key={t._id}
                    todo={t as ConvexTodo}
                    onToggle={() => toggleTodo({ id: t._id as Id<"todos"> })}
                    onRemove={() => removeTodo({ id: t._id as Id<"todos"> })}
                    isSolo={isSolo}
                    members={members.map((m) => ({ ...m, avatarPreset: m.avatarPreset ?? undefined, avatarUrl: m.avatarUrl ?? undefined }))}
                    currentUserId={currentUser?._id}
                  />
                ))}
              </ul>
            </section>
          )}

          {/* Completed */}
          {done.length > 0 && (
            <section className="mt-6">
              <h2 className="hand text-[15px] font-semibold text-brown/80">Done together</h2>
              <ul className="mt-2 space-y-2">
                {done.map((t) => (
                  <TodoRow
                    key={t._id}
                    todo={t as ConvexTodo}
                    onToggle={() => toggleTodo({ id: t._id as Id<"todos"> })}
                    onRemove={() => removeTodo({ id: t._id as Id<"todos"> })}
                    completed
                    isSolo={isSolo}
                    members={members.map((m) => ({ ...m, avatarPreset: m.avatarPreset ?? undefined, avatarUrl: m.avatarUrl ?? undefined }))}
                    currentUserId={currentUser?._id}
                  />
                ))}
              </ul>
            </section>
          )}

          {todos.length === 0 && (
            <div className="mt-16 text-center">
              <p className="handwrite text-[28px] text-coral">nothing here yet</p>
              <p className="mt-1 hand text-[14px] text-brown/60">add your first little task above ☁️</p>
            </div>
          )}
        </>
      )}
    </PhoneFrame>
  );
}

function TodoRow({
  todo,
  onToggle,
  onRemove,
  completed = false,
  isSolo = false,
  members,
  currentUserId,
}: {
  todo: ConvexTodo;
  onToggle: () => void;
  onRemove: () => void;
  completed?: boolean;
  isSolo?: boolean;
  members: { userId: string; name: string; avatarPreset?: string; avatarUrl?: string }[];
  currentUserId?: string;
}) {
  const cat = categoryLabels[todo.category];
  const assigneeMember = todo.assigneeId
    ? members.find((m) => m.userId === todo.assigneeId)
    : null;

  return (
    <li>
      <Card tint="white" className={`p-3 ${completed ? "opacity-60" : ""}`}>
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            aria-label={completed ? "Mark not done" : "Mark done"}
            className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 transition ${
              todo.done
                ? "border-coral bg-coral text-white"
                : "border-brown/40 bg-white"
            }`}
          >
            {todo.done && (
              <svg viewBox="0 0 12 10" className="h-3 w-3" fill="none">
                <path
                  d="M1 5l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <div className="flex-1">
            <p className={`hand text-[15px] leading-snug text-ink ${todo.done ? "line-through" : ""}`}>
              {todo.title}
            </p>
            {todo.notes && (
              <p className="mt-0.5 text-[12px] text-brown/80">{todo.notes}</p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 rounded-full ${cat.tint} px-2 py-0.5 text-[11px] font-semibold text-brown border border-border`}
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </span>
              {todo.due && (
                <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-0.5 text-[11px] text-brown border border-border">
                  <CalIcon className="h-3 w-3" />
                  {todo.due}
                </span>
              )}
              <AssigneeChip
                assigneeId={todo.assigneeId}
                isSolo={isSolo}
                assigneeMember={assigneeMember}
                currentUserId={currentUserId}
                members={members}
              />
              {completed && (
                <Link
                  href={`/new?prefillTitle=${encodeURIComponent(todo.title)}`}
                  className="ml-auto inline-flex items-center gap-1 rounded-full bg-pink-soft px-2 py-0.5 text-[11px] font-semibold text-coral border border-pink/40"
                >
                  <Sparkles className="h-3 w-3" />
                  Turn into memory
                </Link>
              )}
            </div>
          </div>
        </div>
      </Card>
    </li>
  );
}

function AssigneeChip({
  assigneeId,
  isSolo,
  assigneeMember,
  currentUserId,
  members,
}: {
  assigneeId?: string;
  isSolo?: boolean;
  assigneeMember?: { name: string; avatarPreset?: string; avatarUrl?: string } | null;
  currentUserId?: string;
  members: { userId: string; name: string; avatarPreset?: string; avatarUrl?: string }[];
}) {
  if (isSolo || !assigneeId) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-border text-[11px] font-semibold text-brown">
        {isSolo || !assigneeId ? "us" : "you"}
      </span>
    );
  }

  const label = assigneeId === currentUserId ? "you" : (assigneeMember?.name ?? "them");

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-border">
      {assigneeMember && (
        <UserAvatar
          name={assigneeMember.name}
          avatarPreset={assigneeMember.avatarPreset}
          avatarUrl={assigneeMember.avatarUrl}
          size={18}
        />
      )}
      <span className="pr-1 text-[11px] font-semibold text-brown">{label}</span>
    </span>
  );
}
