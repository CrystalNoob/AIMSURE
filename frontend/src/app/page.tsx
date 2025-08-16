import { Navbar } from "@/components/Navbar";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Hero } from "@/components/Hero";

export default function HomePage() {
  return (
    <div className="bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
    </div>
  );
}
