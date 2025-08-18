import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { getBankLogo } from "@/lib/bankLogos";
import {
  Target,
  CircleDollarSign,
  Percent,
  Calendar,
  FileText,
} from "lucide-react";

type BankResultCardProps = {
  bankName: string;
  productName: string;
  details: string[];
};

// const DetailItem = ({
//   icon,
//   text,
// }: {
//   icon: React.ReactNode;
//   text: string;
// }) => {
//   const highlightedText = text.replace(
//     /(IDR \d+[B|M])|(\d+% p\.a\.)|(≥ \d+ months)/g,
//     '<span class="font-bold text-aimsure-yellow">$&</span>'
//   );

//   return (
//     <li className="flex items-start space-x-3">
//       <div className="mt-1">{icon}</div>
//       <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
//     </li>
//   );
// };

export function BankResultCard({
  bankName,
  productName,
  details,
}: BankResultCardProps) {
  const localLogoSrc = getBankLogo(bankName);

  return (
    <Card className="bg-aimsure-blue text-white w-full max-w-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Image
            src={localLogoSrc}
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

// export function BankResultCard({
//   bankName,
//   productName,
//   details,
// }: BankResultCardProps) {
//   const localLogoSrc = getBankLogo(bankName);

//   const getIconForDetail = (text: string) => {
//     const lowerText = text.toLowerCase();
//     if (lowerText.startsWith("target:"))
//       return <Target className="h-4 w-4 text-aimsure-yellow" />;
//     if (lowerText.startsWith("max loan:"))
//       return <CircleDollarSign className="h-4 w-4 text-aimsure-yellow" />;
//     if (lowerText.startsWith("interest:"))
//       return <Percent className="h-4 w-4 text-aimsure-yellow" />;
//     if (lowerText.startsWith("tenor:"))
//       return <Calendar className="h-4 w-4 text-aimsure-yellow" />;
//     if (lowerText.startsWith("eligibility:"))
//       return <FileText className="h-4 w-4 text-aimsure-yellow" />;
//     if (lowerText.startsWith("required docs:"))
//       return <FileText className="h-4 w-4 text-aimsure-yellow" />;
//     return <div className="w-4" />;
//   };

//   return (
//     <Card className="bg-aimsure-blue text-white w-full max-w-sm shadow-lg border border-white/20 flex flex-col">
//       <CardHeader>
//         <div className="flex items-center space-x-3">
//           <div className="p-1 bg-white rounded-md">
//             <Image
//               src={localLogoSrc}
//               alt={`${bankName} Logo`}
//               width={32}
//               height={32}
//             />
//           </div>
//           <CardTitle className="font-heading text-lg">
//             {bankName} - {productName}
//           </CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent className="flex-grow">
//         <ul className="space-y-3 font-sans text-sm text-gray-300">
//           {details.map((detail, index) => (
//             <DetailItem
//               key={index}
//               icon={getIconForDetail(detail)}
//               text={detail}
//             />
//           ))}
//         </ul>
//       </CardContent>
//     </Card>
//   );
// }
