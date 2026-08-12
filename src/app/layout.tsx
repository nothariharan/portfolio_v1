import type { Metadata } from "next";
import { Press_Start_2P, Inter, DM_Serif_Display, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import { TransitionProvider } from "@/hooks/use-transition";
import { FlashOverlay } from "@/components/transition/flash-overlay";
import { FunTabTitle } from "@/components/site/fun-tab-title";
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
  metadataBase: new URL("https://hariharann.me"),
  title: "hariharan — welcome to my world",
  description:
    "flip the GBA trainer card. peek the DATA FILE. trust me you wont be bored — AI, web, open source, and a little AGI??",
  openGraph: {
    title: "hariharan — welcome to my world",
    description:
      "flip the GBA trainer card. peek the DATA FILE. trust me you wont be bored.",
    url: "https://hariharann.me",
    siteName: "hari",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "hari — Welcome to my world",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "hariharan — welcome to my world",
    description:
      "flip the GBA trainer card. peek the DATA FILE. trust me you wont be bored.",
    images: ["/og.png"],
  },
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
          <FunTabTitle />
          {children}
          <FlashOverlay />
        </TransitionProvider>
      </body>
    </html>
  );
}
