import { Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";
import ResultsPageContent from "@/components/ResultsPageContent";

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-aimsure-blue text-white p-8">
      <Suspense fallback={<LoadingScreen />}>
        <ResultsPageContent />
      </Suspense>
    </div>
  );
}
