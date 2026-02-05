"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const MOCK_THREADS = [
  { id: "t1", withId: "u2", withName: "Jordan", preview: "Thanks for your interest in the cabin!", unread: true },
  { id: "t2", withId: "u3", withName: "Sam", preview: "Check-in is after 3pm.", unread: false },
];

const MOCK_MESSAGES: Record<string, { from: string; text: string }[]> = {
  t1: [
    { from: "u2", text: "Hi! You asked about the cabin — it's available those dates." },
    { from: "me", text: "Great, I'd like to book for next weekend." },
    { from: "u2", text: "Thanks for your interest in the cabin!" },
  ],
  t2: [
    { from: "u3", text: "Check-in is after 3pm." },
  ],
};

export function MessagesClient() {
  const [activeId, setActiveId] = useState<string | null>(MOCK_THREADS[0]?.id ?? null);
  const [draft, setDraft] = useState("");

  const activeThread = MOCK_THREADS.find((t) => t.id === activeId);
  const messages = activeId ? (MOCK_MESSAGES[activeId] ?? []) : [];

  return (
    <div className="flex h-full w-full">
      <aside className="w-full border-r bg-card sm:w-80 sm:min-w-[280px] flex flex-col shrink-0">
        <div className="flex-1 overflow-auto">
          <ul className="p-2">
            {MOCK_THREADS.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => setActiveId(thread.id)}
                  className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-muted focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring min-h-[44px] touch-manipulation ${
                    activeId === thread.id ? "bg-muted" : ""
                  }`}
                >
                  <Avatar className="size-10 shrink-0">
                    <AvatarFallback>{thread.withName.slice(0, 1)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">{thread.withName}</span>
                      {thread.unread && (
                        <span className="size-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                      )}
                    </div>
                    <p className="truncate text-sm text-muted-foreground">{thread.preview}</p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      <div className="flex flex-1 flex-col min-w-0 w-full">
        {activeThread ? (
          <>
            <div className="border-b px-4 py-3 flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>{activeThread.withName.slice(0, 1)}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{activeThread.withName}</span>
            </div>
            <div className="flex-1 overflow-auto p-4" tabIndex={0}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-4 py-2 ${
                        msg.from === "me"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      <p className="text-sm">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="border-t p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDraft("");
                }}
                className="flex gap-2"
              >
                <Label htmlFor="message-input" className="sr-only">
                  Type a message
                </Label>
                <Input
                  id="message-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="min-h-[44px] flex-1 text-base"
                  autoComplete="off"
                />
                <Button type="submit" className="min-h-[44px] min-w-[44px]">
                  Send
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <p className="text-muted-foreground">Select a conversation or start a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
}
