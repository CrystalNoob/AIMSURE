import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

type BankResultCardProps = {
  bankName: string;
  productName: string;
  logoUrl: string;
  details: string[];
};

export function BankResultCard({
  bankName,
  productName,
  logoUrl,
  details,
}: BankResultCardProps) {
  return (
    <Card className="bg-aimsure-blue text-white w-full max-w-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Image
            src={logoUrl}
            alt={`${bankName} Logo`}
            width={40}
            height={40}
          />
          <CardTitle className="font-heading text-lg">
            {bankName} - {productName}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc list-inside font-sans text-sm">
          {details.map((detail, index) => (
            <li key={index}>{detail}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
