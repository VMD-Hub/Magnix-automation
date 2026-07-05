"use client";

import { useState } from "react";
import { IMAGE_FALLBACK } from "@/lib/content/safe-image";

type FallbackImageProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "onError" | "src"
> & {
  src: string | undefined | null;
  fallbackSrc?: string;
};

/**
 * <img> có lưới an toàn: nếu ảnh gốc lỗi (404 / bên thứ ba đổi path / chặn hotlink)
 * thì tự chuyển sang ảnh dự phòng local — KHÔNG bao giờ hiện ảnh vỡ.
 *
 * Dùng cho ảnh landing (đặc biệt landing thương mại còn hotlink CDN ngoài):
 * ảnh thật vẫn hiển thị khi còn sống, chỉ fallback khi thực sự hỏng.
 */
export function FallbackImage({
  src,
  fallbackSrc = IMAGE_FALLBACK,
  ...rest
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed || !src ? fallbackSrc : src;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...rest}
      src={resolved}
      onError={() => {
        if (!failed) setFailed(true);
      }}
    />
  );
}
