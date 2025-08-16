import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type MessageBubbleProps = {
  role: "ai" | "user";
  text: string;
};

export function MessageBubble({ role, text }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI Avatar */}
      {!isUser && (
        <Avatar className="w-10 h-10 border">
          {/* You can replace this with an Image of your AI logo */}
          <AvatarFallback className="bg-aimsure-blue text-white font-bold">
            AI
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={`max-w-md rounded-2xl p-4 whitespace-pre-wrap ${
          isUser
            ? "bg-aimsure-blue text-white rounded-br-none"
            : "bg-gray-100 text-black rounded-bl-none"
        }`}
      >
        <p className="font-sans">{text}</p>
      </div>

      {/* User Avatar */}
      {isUser && (
        <Avatar className="w-10 h-10 border">
          {/* You can change the fallback letter */}
          <AvatarFallback className="bg-orange-500 text-white font-bold">
            J
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
