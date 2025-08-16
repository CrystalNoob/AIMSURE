"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Document = {
  name: string;
  content: string;
};

function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-full space-y-4">
      <div className="w-32 h-32 animate-spin-slow">
        <Image
          src="/logo/aimsure-logo.svg"
          alt="AIMSURE Logo"
          width={128}
          height={128}
        />
      </div>
      <h1 className="text-3xl font-heading font-bold">Preparing Documents</h1>
      <p className="font-sans">
        Please wait a moment while I generate your documents!
      </p>
    </div>
  );
}

export default function ResultsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      // ? testing
      const session_id = "test-session-123";

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(
        `${apiUrl}/generate-documents/${session_id}`,
        { method: "POST" }
      );
      const data = await response.json();

      setDocuments(data.documents);
      setIsLoading(false);
    };

    const timer = setTimeout(() => {
      fetchDocuments();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-aimsure-blue text-white p-8">
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div className="container mx-auto">
          <div className="flex justify-center mb-8">
            <Image
              src="/logo/aimsure-logo.svg"
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
                  <Button className="w-full bg-aimsure-yellow hover:bg-yellow-500 text-black font-heading">
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
