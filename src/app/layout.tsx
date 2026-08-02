import type { Metadata } from "next";
import { Press_Start_2P, Inter, DM_Serif_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
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

// geometric display sans for portfolio headings (distinct, techy character)
const spaceGrotesk = Space_Grotesk({
  weight: ["500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-display",
});

// mono for meta labels, dates and section indices — gives the dev-tooling feel
const jetbrainsMono = JetBrains_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

// the authentic pokemon ds bitmap font for the developer card
const pokemonDS = localFont({
  src: "../../public/fonts/pokemon-ds.ttf",
  variable: "--font-card",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hariharan — Trainer Card & Portfolio",
  description:
    "N. Hariharan — full-stack + AI builder. Pokémon GBA trainer card and developer portfolio: 22+ projects, 9 hackathon wins, YC Startup School.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${pressStart2P.variable} ${inter.variable} ${dmSerifDisplay.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${pokemonDS.variable} h-full antialiased`}
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
