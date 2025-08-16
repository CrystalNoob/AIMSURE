import Image from "next/image";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export function Hero() {
  return (
    <main className="container mx-auto py-16 px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6  ">
          <h1 className="font-montserrat text-5xl font-bold text-aimsure-blue leading-tight">
            Find Your Best Business Loan in Instant!
          </h1>
          <p className="font-lato text-lg text-gray-600">
            Get personalized bank recommendations based on your needs. Save
            time. Skip the hassle. Focus on growing your business.
          </p>
          <div className="flex flex-col items-start space-y-4 w-full">
            <Input
              placeholder="| Start Chatting Now!"
              className="font-lato w-full "
            />
            <Button className="bg-aimsure-yellow hover:bg-yellow-500 font-montserrat font-bold">
              See How It Works
            </Button>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src="/images/image-about-us.svg"
            alt="Business professionals"
            width={400}
            height={400}
          />
        </div>
      </div>

      <div className="text-center mt-16">
        <p className="font-lato text-gray-500 mb-4">
          Trusted by Indonesia&apos;s Leading Banks
        </p>
        <div className="flex justify-center items-center space-x-8">
          <Image src="/images/bsi.svg" alt="BSI Logo" width={80} height={40} />
          <Image src="/images/bca.svg" alt="BCA Logo" width={80} height={40} />
        </div>
      </div>
    </main>
  );
}
