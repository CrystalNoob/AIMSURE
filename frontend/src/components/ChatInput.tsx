"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export function ChatInput() {
  return (
    <div className="relative w-full ">
      <Input
        type="text"
        placeholder="Please create my letter bankable !"
        className="rounded-full pr-14 h-14  bg-white"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-aimsure-blue hover:bg-blue-800"
      >
        <Mic className="h-5 w-5" />
      </Button>
    </div>
  );
}
