import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 justify-start">
      <Avatar className="w-10 h-10 border-none">
        <AvatarImage src="/Logo Chatbot.png" alt="AI Avatar" />
        <AvatarFallback className="bg-aimsure-blue text-white font-bold">
          AI
        </AvatarFallback>
      </Avatar>
      <div className="pt-2">
        <p className="font-lato font-semibold text-transparent bg-clip-text bg-gradient-to-r from-aimsure-yellow via-aimsure-lavender to-aimsure-blue animate-text-gradient">
          Thinking...
        </p>
      </div>
    </div>
  );
}
