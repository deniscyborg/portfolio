import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// IBM Plex — прямая отсылка к IBM PC и DOS; шрифты скачиваются при сборке и отдаются с нашего домена
export const plexSans = IBM_Plex_Sans({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
});

export const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const fontVariables = `${plexSans.variable} ${plexMono.variable}`;
