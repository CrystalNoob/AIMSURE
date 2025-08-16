import type { Metadata } from "next";
import { Montserrat, Lato } from "next/font/google"; // Import fonts
import "./globals.css";

// Configure fonts
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "AIMSure",
  description: "Find Your Best Business Loan in Instant!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* Apply the font variables to the whole app */}
      <body className={`${montserrat.variable} ${lato.variable}`}>
        {children}
      </body>
    </html>
  );
}
