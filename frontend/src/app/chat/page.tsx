"use client";
import { ChatInput } from "@/components/ChatInput";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MessageBubble } from "@/components/MessageBubble";
import { BankResultCard } from "@/components/BankResultCard";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ThinkingIndicator } from "@/components/ThinkingIndicator";
type MessageRole = "ai" | "user";
type TextMessage = {
  role: MessageRole;
  type: "text";
  content: string;
};

type ChecklistMessage = {
  role: MessageRole;
  type: "checklist";
  content: string[];
};

type BankCardData = {
  bankName: string;
  productName: string;
  logoUrl: string;
  details: string[];
};

type BankResultsMessage = {
  role: MessageRole;
  type: "bank_results";
  content: {
    intro: string;
    cards: BankCardData[];
  };
};

// const INITIAL_MESSAGE: ConversationMessage = {
//   role: "ai",
//   type: "text",
//   content: `Welcome to AIMSURE!

// I'm here to help you prepare all the necessary financial documents to make your business bankable.

// To get started, please tell me a little bit about your business and what you need the loan for. For example:

// *"Hi, I run a coffee shop and I need a 50 million rupiah loan to buy a new espresso machine."*`,
// };

const INITIAL_MESSAGE: ConversationMessage = {
  role: "ai",
  type: "text",
  content: `Welcome to AIMSURE!

I'm here to help you prepare the necessary documents to make your business bankable.

**How to get started:**
Just tell me about your business and your financial needs. For example:
*"Hi, I run a coffee shop and I need a 50 million rupiah loan to buy a new espresso machine."*
*"Or , just say Hi!"*
---
***MVP Disclaimer:*** *For this hackathon demo, I can generate a **Business Profile** document. In the full version, I'll also be able to generate your **Cash Flow Statement**, **Profit & Loss Report**, and a **Loan Proposal**.*
***MVP Disclaimer:*** *I'm currently only have RAG access to Banks listed in the home page. So it is better to provide information in Indonesia (e.g. Rupiah with amounts up to 50 Milion IDR)*`,
};

type ConversationMessage = TextMessage | ChecklistMessage | BankResultsMessage;

export default function ChatPage() {
  const router = useRouter();

  const [messages, setMessages] = useState<ConversationMessage[]>([
    INITIAL_MESSAGE,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => uuidv4());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const question = inputValue.trim();
    if (!question) return;

    const userMessage: ConversationMessage = {
      role: "user",
      type: "text",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(`${apiUrl}/invoke/${sessionId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!response.ok) throw new Error(`API error: ${response.statusText}`);

      const aiMessage: ConversationMessage = await response.json();

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get response from AI:", error);
      const errorMsg: ConversationMessage = {
        role: "ai",
        type: "text",
        content: "Sorry, I ran into an error. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateClick = () => {
    router.push(`/results?sessionId=${sessionId}`);
  };

  const shouldShowGenerateButton = useMemo(() => {
    const lastMessage = messages[messages.length - 1];
    return lastMessage?.type === "bank_results";
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="border-none shrink-0">
        <div className="container max-w-3xl p-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-gray-500 hover:text-aimsure-blue"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-sans">Back to Home</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto">
        <main className="container max-w-3xl mx-auto pt-6 pb-24 space-y-6">
          {messages.map((msg, index) => {
            switch (msg.type) {
              case "text":
                return (
                  <MessageBubble
                    key={index}
                    role={msg.role}
                    text={msg.content}
                  />
                );
              case "checklist":
                return (
                  <MessageBubble
                    key={index}
                    role={msg.role}
                    text={msg.content.join("\n")}
                  />
                );
              case "bank_results":
                return (
                  <div key={index} className="space-y-4">
                    <MessageBubble role={msg.role} text={msg.content.intro} />
                    <div className="flex flex-wrap justify-center gap-4">
                      {msg.content.cards.map((card, cardIndex) => (
                        <div
                          key={cardIndex}
                          className="flex-grow basis-[320px] max-w-md"
                        >
                          <BankResultCard {...card} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              default:
                return null;
            }
          })}
          {isLoading && <ThinkingIndicator />}
        </main>
      </div>

      <footer className="shrink-0">
        <div className="container max-w-3xl mx-auto px-4 py-3">
          {shouldShowGenerateButton && (
            <div className="flex justify-end mb-2 gap-2">
              <Button
                onClick={handleGenerateClick}
                className="bg-aimsure-yellow hover:bg-yellow-500 text-black font-heading rounded-full"
              >
                Generate Documents
              </Button>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <ChatInput
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </div>
      </footer>
    </div>
  );
}
