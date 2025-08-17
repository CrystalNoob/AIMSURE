"use client";
import Image from "next/image";

export function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen -my-8 space-y-4">
      <div className="w-32 h-32">
        <Image
          src="/logo/Logo Loading.png"
          alt="AIMSURE Logo"
          width={128}
          height={128}
        />
      </div>
      <h1 className="text-3xl font-heading font-bold">Preparing Documents</h1>
      <p className="font-lato">
        Please wait a moment while I generate your documents!
      </p>
    </div>
  );
}
