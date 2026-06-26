'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PostContent.module.css'

interface PostContentImageProps {
  alt?: string
  className?: string
  decoding?: 'async' | 'auto' | 'sync' | string
  height?: string
  loading?: 'eager' | 'lazy' | string
  src: string
  title?: string
  width?: string
}

export function PostContentImage({
  alt = '',
  className,
  decoding = 'async',
  height,
  loading = 'lazy',
  src,
  title,
  width,
}: PostContentImageProps) {
  const imageRef = useRef<HTMLImageElement | null>(null)
  const [shouldLoad, setShouldLoad] = useState(loading === 'eager')
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setShouldLoad(loading === 'eager')
  }, [loading, src])

  useEffect(() => {
    const image = imageRef.current
    if (!image || shouldLoad) {
      return
    }

    if (!('IntersectionObserver' in window)) {
      setShouldLoad(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '320px 0px',
        threshold: 0.01,
      }
    )

    observer.observe(image)
    return () => observer.disconnect()
  }, [shouldLoad])

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imageRef}
      alt={alt}
      className={[className, styles.postContentImage, loaded ? styles.postContentImageLoaded : ''].filter(Boolean).join(' ')}
      decoding={decoding as 'async' | 'auto' | 'sync'}
      height={height}
      loading={loading as 'eager' | 'lazy'}
      onLoad={() => setLoaded(true)}
      src={shouldLoad ? src : undefined}
      title={title}
      width={width}
    />
  )
}
