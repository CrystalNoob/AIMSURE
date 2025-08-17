"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";

export type ChatInputProps = React.InputHTMLAttributes<HTMLInputElement>;

export function ChatInput(props: ChatInputProps) {
  return (
    <div className="relative w-full">
      <Input
        type="text"
        placeholder="Describe your business and loan need..."
        className="rounded-full pr-12 h-12"
        {...props}
      />
      <Button
        type="submit"
        size="icon"
        disabled={props.disabled}
        className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-aimsure-blue hover:bg-aimsure-lavender"
      >
        <Mic className="h-5 w-5 text-white " />
      </Button>
    </div>
  );
}
