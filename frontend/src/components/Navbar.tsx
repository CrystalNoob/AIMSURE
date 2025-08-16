// in components/Navbar.tsx
import Image from "next/image";
import Link from "next/link";

export function Navbar() {
  return (
    <header className="bg-aimsure-blue h-20 ">
      <nav className="container mx-auto flex justify-between items-center h-full">
        <Link
          href="/"
          className="font-heading text-2xl font-bold text-aimsure-white"
        >
          <Image
            width={100}
            height={100}
            src="/logo/aimsure-logo.svg"
            alt="AIMSure Logo"
            className="h-auto w-auto"
          />
        </Link>
        <div className="flex items-center space-x-6">
          <Link
            href="#about"
            className="font-lato font-bold text-aimsure-white hover:text-aimsure-yellow"
          >
            ABOUT US
          </Link>
          <Link
            href="#features"
            className="font-lato font-bold text-aimsure-white hover:text-aimsure-yellow"
          >
            FEATURES
          </Link>
          <Link
            href="#how-to-use"
            className="font-lato font-bold text-aimsure-white hover:text-aimsure-yellow"
          >
            HOW TO USE
          </Link>
        </div>
      </nav>
    </header>
  );
}
