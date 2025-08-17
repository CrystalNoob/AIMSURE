"use client";

import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";

const HEADER_WORDS = ["Business Loan", "Startup Capital", "Working Capital"];
const PLACEHOLDER_WORDS = [
  "e.g., 'I need a loan for my new cafe'",
  "e.g., 'What are the requirements for KUR?'",
  "e.g., 'Compare interest rates for a 100jt loan'",
];
const TYPING_SPEED = 120;
const DELETING_SPEED = 60;
const PAUSE_DURATION = 2000;

export function Hero() {
  const [headerText, setHeaderText] = useState("");
  const [headerWordIndex, setHeaderWordIndex] = useState(0);
  const [isDeletingHeader, setIsDeletingHeader] = useState(false);

  const [placeholderText, setPlaceholderText] = useState("Start Chatting Now!");

  useEffect(() => {
    const handleHeaderTyping = () => {
      const currentWord = HEADER_WORDS[headerWordIndex % HEADER_WORDS.length];
      const updatedText = isDeletingHeader
        ? currentWord.substring(0, headerText.length - 1)
        : currentWord.substring(0, headerText.length + 1);

      setHeaderText(updatedText);

      if (!isDeletingHeader && updatedText === currentWord) {
        setTimeout(() => setIsDeletingHeader(true), PAUSE_DURATION);
      } else if (isDeletingHeader && updatedText === "") {
        setIsDeletingHeader(false);
        setHeaderWordIndex((prev) => prev + 1);
      }
    };

    const timer = setTimeout(
      handleHeaderTyping,
      isDeletingHeader ? DELETING_SPEED : TYPING_SPEED
    );

    return () => clearTimeout(timer);
  }, [headerText, isDeletingHeader, headerWordIndex]);

  useEffect(() => {
    let placeholderIndex = 0;
    const intervalId = setInterval(() => {
      placeholderIndex = (placeholderIndex + 1) % PLACEHOLDER_WORDS.length;
      setPlaceholderText(PLACEHOLDER_WORDS[placeholderIndex]);
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <main className="container mx-auto py-16 px-8">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
        <div className="space-y-6  md:col-span-3">
          <h1 className="font-montserrat text-5xl font-bold text-aimsure-blue leading-tight min-h-[12rem] md:min-h-[10rem]">
            Find Your Best{" "}
            <span className="text-aimsure-yellow whitespace-nowrap">
              {headerText}
            </span>
            <span className="animate-pulse text-gray-400">|</span>
          </h1>
          <p className="font-lato text-lg text-gray-600">
            Get personalized bank recommendations based on your needs. Save
            time. Skip the hassle. Focus on growing your business.
          </p>
          <div className="flex flex-col items-start space-y-4 w-full">
            <div className="flex items-center justify-between w-full p-1 border-2 border-gray-200 rounded-lg bg-white focus-within:ring-2 focus-within:ring-aimsure-yellow transition-all duration-300">
              <p className="font-lato text-gray-500 px-3 truncate">
                {placeholderText}
              </p>
              <Link href="/chat">
                <Button
                  className="
                text-aimsure-white
                bg-aimsure-lavender hover:bg-aimsure-blue font-montserrat font-bold flex-shrink-0"
                >
                  Start Chatting Now
                </Button>
              </Link>
            </div>

            <Link href="#features" className="flex-grow w-full">
              <Button className="bg-aimsure-yellow hover:bg-yellow-500 font-montserrat font-bold">
                See How It Works
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center  md:col-span-2">
          <Image
            src="/Introduction Image.png"
            alt="Business professionals"
            width={400}
            height={400}
          />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center mt-32">
        <p className="font-lato font-bold text-2xl text-aimsure-lavender mb-4">
          Trusted by Indonesia&apos;s Leading Banks
        </p>
        <div className="w-full max-w-4xl overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
          <div className="flex animate-scroll space-x-16">
            <Image
              src="/banks/BCA.png"
              alt="BCA Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BNI.png"
              alt="BNI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BRI.png"
              alt="BRI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BSI.png"
              alt="BSI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BTN.png"
              alt="BTN Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BCA.png"
              alt="BCA Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BNI.png"
              alt="BNI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BRI.png"
              alt="BRI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BSI.png"
              alt="BSI Logo"
              width={180}
              height={180}
              className="flex-none"
            />
            <Image
              src="/banks/BTN.png"
              alt="BTN Logo"
              width={180}
              height={180}
              className="flex-none"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
