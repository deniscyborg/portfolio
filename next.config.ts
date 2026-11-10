import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Статический экспорт: `next build` кладёт готовый сайт в out/, на сервере нужен только nginx
  output: "export",
  // /en/ -> out/en/index.html — так nginx отдаёт страницы без дополнительных правил
  trailingSlash: true,
  // Оптимизация картинок требует сервер; фото заранее подготовлены в public/images
  images: { unoptimized: true },
  experimental: {
    // Единая страница 404: корневых layout два ([lang] и редирект с "/")
    globalNotFound: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
