// in components/Features.tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

export function Features() {
  return (
    <section id="features" className="bg-white py-20 px-8">
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center font-heading text-aimsure-blue mb-12">
          Our Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Side: Graphic */}
          <div>
            <div className="w-full h-64 bg-slate-200 rounded-lg flex justify-center items-center">
              <p className="text-gray-500">Graphic Asset Here</p>
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div>
            <Accordion
              type="single"
              collapsible
              defaultValue="item-1"
              className="w-full"
            >
              <AccordionItem value="item-1">
                <AccordionTrigger className="font-heading text-xl">
                  Easy Input
                </AccordionTrigger>
                <AccordionContent className="font-sans text-base">
                  Our AI chatbot guides you through a human-like conversation,
                  designed especially for SMEs unfamiliar with complex business
                  form requirements. We ensure you give the right information
                  without confusion of technical jargon.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger className="font-heading text-xl">
                  Smart Matching
                </AccordionTrigger>
                <AccordionContent className="font-sans text-base">
                  Our system analyzes your completed profile and matches you
                  with the most suitable banks and loan products based on their
                  specific criteria.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger className="font-heading text-xl">
                  Document Generation
                </AccordionTrigger>
                <AccordionContent className="font-sans text-base">
                  No more chasing templates or guessing what’s required. Once
                  your details are in, the system instantly generates complete,
                  bank-ready documents, ready to submit without extra
                  formatting.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
