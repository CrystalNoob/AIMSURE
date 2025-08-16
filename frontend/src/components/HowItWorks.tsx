import Image from "next/image";
import { PlayIcon } from "lucide-react"; // A nice icon for the play button

export function HowItWorks() {
  return (
    // The main container with the blue background
    <section id="how-to-use" className="bg-aimsure-blue py-20 px-8 text-white">
      <div className="container mx-auto flex flex-col items-center space-y-8">
        {/* Headline with Logo */}
        <h2 className="flex items-center space-x-4 text-4xl font-bold font-heading">
          <span>Stay Sure with</span>
          {/* Using the logo path you provided */}
          <Image
            src="/logo/aimsure-logo.svg"
            alt="AIMSure Logo"
            width={150}
            height={40}
          />
        </h2>

        {/* Video Player Area */}
        <div className="w-full max-w-3xl space-y-4">
          {/* The main white box for the video */}
          <div className="aspect-video w-full bg-white rounded-2xl shadow-lg flex justify-center items-center">
            <p className="font-sans text-gray-400">Video Player Placeholder</p>
          </div>

          {/* The player controls below the box */}
          <div className="flex items-center w-full space-x-4 px-2">
            <PlayIcon className="h-6 w-6 text-white cursor-pointer" />
            <div className="flex-grow h-1 bg-white/30 rounded-full relative">
              <div className="absolute top-0 left-0 h-1 w-1/3 bg-aimsure-yellow rounded-full"></div>
              <div className="absolute top-1/2 -translate-y-1/2 left-1/3 h-4 w-4 bg-aimsure-yellow rounded-full border-2 border-white"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
