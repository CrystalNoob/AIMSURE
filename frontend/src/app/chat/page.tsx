"use client";
import { ChatInput } from "@/components/ChatInput";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { MessageBubble } from "@/components/MessageBubble";
import { BankResultCard } from "@/components/BankResultCard";
import { Button } from "@/components/ui/button";

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

type ConversationMessage = TextMessage | ChecklistMessage | BankResultsMessage;

const DUMMY_CONVERSATION: ConversationMessage[] = [
  {
    role: "ai",
    type: "checklist",
    content: [
      "Hi! First, let's check what information you already have so I can prepare the right document template.",
      "So, do you have this documents?",
      "• Do you have a National ID (NIK)?",
      "• Do you have a Tax Number (NPWP)?",
      "• Do you have a Business Identification Number (NIB) or Business License (SIUP)?",
      "• Do you know your KBLI code (business classification code)?",
    ],
  },
  {
    role: "user",
    type: "text",
    content: "Yes, i have. but I don't have KBLI",
  },
  {
    role: "ai",
    type: "text",
    content:
      "That's all I need, please hold on a moment and let the magic happens",
  },
  {
    role: "ai",
    type: "bank_results",
    content: {
      intro:
        "Based on your business profile and loan request, I've found some banks that are the best match for you. Let me show you the details so you can compare easily:",
      cards: [
        {
          bankName: "Bank Mandiri",
          productName: "Kur Mikro",
          logoUrl: "/images/mandiri-white.png",
          details: [
            "Target: Small businesses with annual turnover ≤ IDR 2.5B",
            "Max Loan: IDR 100M",
            "Interest: 6% p.a.",
            "Tenor: up to 3 years",
            "Eligibility: Business running ≥ 6 months, revenue ≥ IDR 50M/year",
            "Required Docs: NIK, Business License (optional), Bank Statements",
          ],
        },
        {
          bankName: "Bank BRI",
          productName: "Kupedes",
          logoUrl: "/bri-logo.png",
          details: [
            "Target: Small businesses with annual turnover ≤ IDR 2.5B",
            "Max Loan: IDR 100M",
            "Interest: 6% p.a.",
            "Tenor: up to 3 years",
            "Eligibility: Business running ≥ 6 months, revenue ≥ IDR 50M/year",
            "Required Docs: NIK, Business License (optional), Bank Statements",
          ],
        },
      ],
    },
  },
];

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b">
        <Link
          href="/"
          className="flex items-center space-x-2 text-gray-500 hover:text-aimsure-blue"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-sans">Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-tra">
        {DUMMY_CONVERSATION.map((msg, index) => {
          switch (msg.type) {
            case "text":
              return (
                <MessageBubble key={index} role={msg.role} text={msg.content} />
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
                <div key={index}>
                  <MessageBubble role={msg.role} text={msg.content.intro} />
                  <div className="mt-4 flex flex-wrap gap-4">
                    {msg.content.cards.map((card, cardIndex) => (
                      <BankResultCard key={cardIndex} {...card} />
                    ))}
                  </div>
                </div>
              );
            default:
              return null;
          }
        })}
      </main>

      <footer className="flex justify-center items-center fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="container max-w-3xl px-4 py-3 pointer-events-auto">
          <div className="flex justify-end mb-2">
            <Button variant="outline" className="rounded-full bg-white">
              Yes, i have. but I don&apos;t have KBLI
            </Button>
          </div>
          <ChatInput />
        </div>
      </footer>
    </div>
  );
}
