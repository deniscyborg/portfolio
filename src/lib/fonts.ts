import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// IBM Plex is a nod to the IBM PC and DOS; fonts are downloaded at build time and served from our domain
// Latin subset only: the site is English and German; umlauts, ß and „“ are in the base set.
// Only the weights actually used; every extra weight is one more file to download.
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = `${plexSans.variable} ${plexMono.variable}`;
