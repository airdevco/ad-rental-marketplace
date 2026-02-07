import { MessagesClient } from "@/components/messages/messages-client";

export const metadata = {
  title: "Messages",
  description: "Chat with listers and renters",
};

export default function MessagesPage() {
  return <MessagesClient />;
}
