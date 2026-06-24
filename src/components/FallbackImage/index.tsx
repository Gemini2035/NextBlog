"use client";

import { Loading } from "@/ui";
import { useEffect, useState, type ReactNode } from "react";

interface FallbackImageProps {
  alt?: string;
  className?: string;
  fallback: ReactNode;
  pending?: ReactNode;
  src?: string | null;
  timeoutMs?: number;
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

export function FallbackImage({
  alt = "",
  className,
  fallback,
  pending,
  src,
  timeoutMs = 8000,
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

    const timer = window.setTimeout(() => {
      setFailed(true);
    }, timeoutMs);

    return () => window.clearTimeout(timer);
  }, [failed, loaded, timeoutMs, validSource]);

  if (!validSource || failed) {
    return <>{fallback}</>;
  }

  return (
    <>
      {!loaded && (pending ?? <Loading variant="spinner" size="xs" />)}
      <img
        hidden={!loaded}
        src={validSource}
        alt={alt}
        className={className}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
      />
    </>
  );
}
