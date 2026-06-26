'use client'

import { useEffect, useRef, useState } from 'react'
import { resolveResourceUrl } from '@/apis/resources'
import type { BlogPostImage } from '@/types/blog'

interface PostImageProps {
  image: BlogPostImage
}

function useInView<T extends Element>() {
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) {
      return
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsInView(true)
        observer.disconnect()
      }
    }, { rootMargin: '200px' })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { ref, isInView }
}

export function PostImage({ image }: PostImageProps) {
  const { ref, isInView } = useInView<HTMLDivElement>()
  const src = image.placeholder && !isInView ? image.placeholder : resolveResourceUrl(image.url)

  return (
    <figure ref={ref} className="my-6 inline-block max-w-full align-top">
      <div className="inline-block max-w-full">
        <img
          alt={image.alt ?? ''}
          className="block h-auto max-w-full object-contain"
          decoding="async"
          loading="lazy"
          src={src}
          width={image.width ?? undefined}
          height={image.height ?? undefined}
        />
      </div>
      {image.caption ? <figcaption className="pt-2 text-sm text-[var(--site-text-tertiary)]">{image.caption}</figcaption> : null}
    </figure>
  )
}
