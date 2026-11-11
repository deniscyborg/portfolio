type Props = {
  /** Base file name in public/images, e.g. "quality-gate" */
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
 * Photo with pre-generated sizes (WebP, no EXIF).
 * next/image does not generate srcset in a static export, so we build it ourselves.
 */
export function Photo({ name, widths, alt, sizes, width, height, className, priority }: Props) {
  const srcSet = widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ");
  const fallback = `/images/${name}-${widths[widths.length - 1]}.webp`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- srcset is built manually, see the comment above
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
