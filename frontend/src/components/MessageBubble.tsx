import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

type MessageBubbleProps = {
  role: "ai" | "user";
  text: string;
};

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start ${
        isUser ? "justify-end gap-3" : "justify-start"
      }`}
    >
      {!isUser && (
        <Avatar className="w-10 h-10 border-none mr-6">
          <AvatarImage src="/Logo Chatbot.png" alt="AI Avatar" />
          <AvatarFallback className="bg-aimsure-blue text-white font-bold">
            AI
          </AvatarFallback>
        </Avatar>
      )}
      {/* Message Content */}
      <div
        className={`whitespace-pre-wrap ${
          isUser
            ? "max-w-md rounded-2xl p-4 bg-aimsure-blue text-white rounded-br-none"
            : "w-full text-black pt-1" // No bubble, full-width for AI
        }`}
      >
        <p className="font-sans">{text}</p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="w-10 h-10 border">
          <AvatarFallback className="bg-orange-500 text-white font-bold">
            J
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
