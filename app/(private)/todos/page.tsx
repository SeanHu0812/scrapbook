"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus, Calendar as CalIcon, Sparkles } from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { BackHeader } from "@/components/ui/BackHeader";
import { Card } from "@/components/ui/Card";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { Avatar } from "@/components/ui/Avatar";
import { useSpace } from "@/lib/useSpace";
import { todos as seed, categoryLabels, type Todo } from "@/lib/data";

export default function TodosPage() {
  const { status, members } = useSpace();
  const isSolo = status === "solo";
  const [list, setList] = useState<Todo[]>(seed);
  const [newTitle, setNewTitle] = useState("");

  const open = list.filter((t) => !t.done);
  const done = list.filter((t) => t.done);

  function toggle(id: string) {
    setList((cur) =>
      cur.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function add() {
    if (!newTitle.trim()) return;
    setList((cur) => [
      {
        id: `t${Date.now()}`,
        title: newTitle.trim(),
        assignee: "both",
        category: "home",
        done: false,
      },
      ...cur,
    ]);
    setNewTitle("");
  }

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
          aria-label="Add task"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-pink text-white shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") add();
          }}
          placeholder="add a little task..."
          className="flex-1 bg-transparent text-[14px] text-ink placeholder:text-brown/50 focus:outline-none"
        />
      </div>

      {/* Open list */}
      <section className="mt-5">
        <h2 className="hand text-[15px] font-semibold text-brown/80">To do</h2>
        <ul className="mt-2 space-y-2">
          {open.map((t) => (
            <TodoRow key={t.id} todo={t} onToggle={() => toggle(t.id)} isSolo={isSolo} />
          ))}
        </ul>
      </section>

      {/* Completed */}
      {done.length > 0 && (
        <section className="mt-6">
          <h2 className="hand text-[15px] font-semibold text-brown/80">
            Done together
          </h2>
          <ul className="mt-2 space-y-2">
            {done.map((t) => (
              <TodoRow
                key={t.id}
                todo={t}
                onToggle={() => toggle(t.id)}
                completed
                isSolo={isSolo}
              />
            ))}
          </ul>
        </section>
      )}
    </PhoneFrame>
  );
}

function TodoRow({
  todo,
  onToggle,
  completed = false,
  isSolo = false,
}: {
  todo: Todo;
  onToggle: () => void;
  completed?: boolean;
  isSolo?: boolean;
}) {
  const cat = categoryLabels[todo.category];
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
            <p
              className={`hand text-[15px] leading-snug text-ink ${
                todo.done ? "line-through" : ""
              }`}
            >
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
              <AssigneeChip assignee={todo.assignee} isSolo={isSolo} />
              {completed && (
                <Link
                  href="/new"
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

function AssigneeChip({ assignee, isSolo }: { assignee: Todo["assignee"]; isSolo?: boolean }) {
  if (isSolo) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 border border-border text-[11px] font-semibold text-brown">
        you
      </span>
    );
  }
  if (assignee === "both") {
    return (
      <span className="inline-flex items-center rounded-full bg-white px-1 py-0.5 border border-border">
        <Avatar variant="mia" size={18} name="mia" className="border" />
        <Avatar variant="jake" size={18} name="jake" className="-ml-1.5 border" />
        <span className="ml-1 pr-1 text-[11px] font-semibold text-brown">us</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white px-1 py-0.5 border border-border">
      <Avatar variant={assignee} size={18} name={assignee} />
      <span className="pr-1 text-[11px] font-semibold text-brown">{assignee}</span>
    </span>
  );
}
