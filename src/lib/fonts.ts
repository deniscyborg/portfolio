import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

// IBM Plex — прямая отсылка к IBM PC и DOS; шрифты скачиваются при сборке и отдаются с нашего домена
// Только латиница: сайт на английском и немецком, умлауты, ß и „“ входят в базовый набор.
// Начертания — те, что реально используются; каждый лишний набор — ещё один файл при загрузке.
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
