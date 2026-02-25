import { Suspense } from "react";
import { MessagesClient } from "@/components/messages/messages-client";

export const metadata = {
  title: "Messages",
  description: "Chat with listers and renters",
};

function MessagesFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="text-sm text-zinc-500">Loading…</div>
    </div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<MessagesFallback />}>
      <MessagesClient />
    </Suspense>
  );
}
