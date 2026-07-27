"use client";

import { Loading } from "@/ui";
import NextImage from "next/image";
import { useEffect, useState, type ReactNode } from "react";

interface FallbackImageProps {
  alt?: string;
  className?: string;
  fallback: ReactNode;
  height?: number;
  pending?: ReactNode;
  src?: string | null;
  timeoutMs?: number;
  width?: number;
}

const isImageLikeSource = (source: string) => {
  return (
    source.startsWith("data:image/") ||
    source.startsWith("blob:") ||
    source.startsWith("http://") ||
    source.startsWith("https://") ||
    source.startsWith("/")
  );
};

const nextImageHostnames = new Set([
  "apodidae2035.com",
  "resources.apodidae2035.com",
  "avatars.githubusercontent.com",
  "github.com",
  "raw.githubusercontent.com",
  "repository-images.githubusercontent.com",
  "user-images.githubusercontent.com",
]);

const canUseNextImage = (source: string) => {
  if (source.startsWith("/") || source.startsWith("data:image/")) {
    return true;
  }

  try {
    return nextImageHostnames.has(new URL(source).hostname);
  } catch {
    return false;
  }
};

export function FallbackImage({
  alt = "",
  className,
  fallback,
  height = 24,
  pending,
  src,
  timeoutMs = 8000,
  width = 24,
}: FallbackImageProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const source = src?.trim();
  const validSource = source && isImageLikeSource(source) ? source : "";

  useEffect(() => {
    setFailed(false);
    setLoaded(false);
  }, [validSource]);

  useEffect(() => {
    if (!validSource || failed || loaded) {
      return;
    }

    const image = new window.Image();
    const timer = window.setTimeout(() => {
      setFailed(true);
    }, timeoutMs);

    image.onload = () => {
      window.clearTimeout(timer);
      setLoaded(true);
    };
    image.onerror = () => {
      window.clearTimeout(timer);
      setFailed(true);
    };
    image.src = validSource;

    return () => {
      window.clearTimeout(timer);
      image.onload = null;
      image.onerror = null;
    };
  }, [failed, loaded, timeoutMs, validSource]);

  if (!validSource || failed) {
    return <>{fallback}</>;
  }

  return (
    <>
      {!loaded && (pending ?? <Loading variant="spinner" size="xs" />)}
      {loaded && !canUseNextImage(validSource) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={validSource} alt={alt} className={className} />
      ) : null}
      {loaded && canUseNextImage(validSource) ? (
        <NextImage
          src={validSource}
          alt={alt}
          width={width}
          height={height}
          unoptimized={validSource.startsWith("data:image/")}
          className={className}
        />
      ) : null}
    </>
  );
}
