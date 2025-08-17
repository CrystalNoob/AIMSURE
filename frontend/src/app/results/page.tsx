"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { BusinessProfilePDF } from "@/components/templates/BusinessProfilePDF";
import { BusinessProfileData } from "@/components/templates/BusinessProfilePDF";
import { useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";

type Document = {
  name: string;
  structuredContent: BusinessProfileData;
};

function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <div className="w-32 h-32 animate-spin-slow">
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

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const sessionId = searchParams.get("sessionId");

    if (sessionId) {
      const fetchDocuments = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const response = await fetch(
            `${apiUrl}/generate-documents/${sessionId}`,
            { method: "POST" }
          );
          if (!response.ok) {
            throw new Error("Failed to fetch documents from the server.");
          }
          const data = await response.json();
          setDocuments(data.documents);
        } catch (err) {
          console.error(err);
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("An unknown error occurred. Please try again.");
          }
        } finally {
          setIsLoading(false);
        }
      };
      const timer = setTimeout(() => {
        fetchDocuments();
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      console.error("No Session ID found in URL");
      setError("No Session ID was found. Please start the chat again.");
      setIsLoading(false);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-aimsure-blue text-white p-8">
      {isLoading ? (
        <LoadingScreen />
      ) : error ? (
        <div className="flex flex-col justify-center items-center h-screen -my-8 text-center space-y-4">
          <AlertTriangle className="h-16 w-16 text-red-400" />
          <h1 className="text-3xl font-heading font-bold">An Error Occurred</h1>
          <p className="font-lato text-red-300 max-w-md">{error}</p>
        </div>
      ) : (
        <div className="container mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo/Logo AIMSURE 1.png"
              alt="AIMSURE Logo"
              width={128}
              height={128}
            />
          </div>
          <h1 className="text-4xl text-center font-heading font-bold mb-8">
            Here are the documents!
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc, index) => (
              <Card
                key={index}
                className="bg-white/10 text-white border-white/20"
              >
                <CardHeader>
                  <CardTitle className="font-heading">{doc.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="font-sans text-sm text-gray-300">
                    This document has been generated based on your profile and
                    financial information.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-aimsure-yellow hover:bg-yellow-500 text-black font-heading"
                  >
                    <PDFDownloadLink
                      document={
                        <BusinessProfilePDF data={doc.structuredContent} />
                      }
                      fileName={`${doc.name}.pdf`}
                    >
                      {({ loading }) =>
                        loading ? "Loading document..." : "Download"
                      }
                    </PDFDownloadLink>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
