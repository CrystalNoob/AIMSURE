import Image from "next/image";

export function HowItWorks() {
  const videoId = "1E6QrIedofdkNZuGrt_Y8Ilm3G-7sdoNb";
  const embedUrl = `https://drive.google.com/file/d/${videoId}/preview`;
  return (
    <section id="how-to-use" className="bg-aimsure-blue py-20 px-8 text-white">
      <div className="container mx-auto flex flex-col items-center space-y-8">
        <h2 className="flex  font-lato items-center space-x-4 text-4xl font-bold font-heading">
          <span className="text-aimsure-yellow">Stay Sure with</span>
          <Image
            src="/logo/Logo AIMSURE 1.png"
            alt="AIMSure Logo"
            width={400}
            height={400}
          />
        </h2>

        <div className="w-full max-w-3xl space-y-4">
          <div className="aspect-video w-full bg-black rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              allow="autoplay; encrypted-media"
              allowFullScreen
              title="AIMSURE Explainer Video"
              className="border-0"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
