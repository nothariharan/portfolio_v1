import type { Metadata } from "next";
import { Press_Start_2P, Inter, DM_Serif_Display } from "next/font/google";
import localFont from "next/font/local";
import { TransitionProvider } from "@/hooks/use-transition";
import { FlashOverlay } from "@/components/transition/flash-overlay";
import "./globals.css";

// pixel art font for card elements
const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

// clean sans font for portfolio body text
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

// elegant serif font for portfolio headings
const dmSerifDisplay = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

// the authentic pokemon ds bitmap font for the developer card
const pokemonDS = localFont({
  src: "../../public/fonts/pokemon-ds.ttf",
  variable: "--font-card",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trainer Card & Portfolio",
  description: "pokemon gba-style trainer card and personal developer portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${inter.variable} ${dmSerifDisplay.variable} ${pokemonDS.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gba-teal transition-colors duration-500">
        <TransitionProvider>
          {children}
          <FlashOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}
