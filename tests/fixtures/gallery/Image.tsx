import type { ImgHTMLAttributes } from "react";

/** Adapter de teste: a fixture usa imagens locais, sem o servidor de otimização Next. */
export default function Image({
  fill,
  alt = "",
  style,
  ...props
}: ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={alt}
      {...props}
      style={
        fill
          ? {
              ...style,
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }
          : style
      }
    />
  );
}
