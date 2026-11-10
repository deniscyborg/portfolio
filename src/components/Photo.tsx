type Props = {
  /** Базовое имя файла в public/images, например "quality-gate" */
  name: string;
  widths: number[];
  alt: string;
  sizes: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
};

/**
 * Фото с заранее подготовленными размерами (WebP, без EXIF).
 * next/image при статическом экспорте не генерирует srcset, поэтому собираем его сами.
 */
export function Photo({ name, widths, alt, sizes, width, height, className, priority }: Props) {
  const srcSet = widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = `/images/${name}-${widths[widths.length - 1]}.webp`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- srcset собирается вручную, см. комментарий выше
    <img
      src={fallback}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
    />
  );
}
