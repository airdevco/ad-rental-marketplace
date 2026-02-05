import { MessagesClient } from "@/components/messages/messages-client";

export const metadata = {
  title: "Messages",
  description: "Chat with listers and renters",
};

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-full flex-col">
      <div className="border-b px-4 py-3 sm:px-6">
        <h1 className="text-xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground">
          Your conversations with listers and renters.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <MessagesClient />
      </div>
    </div>
  );
}
