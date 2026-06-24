'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useLayoutHeights } from '@/hooks'
import { cn } from '@/utils'
import { VolumeIcon, MuteIcon } from '@/assets/icons'
import { useSiteConfig } from '@/components/SiteDataProvider'

export interface HeroMediaBackgroundProps {
  /** 视频封面图 URL */
  poster?: string
  /** 视频源 URL（如 m3u8） */
  videoSrc?: string
  /** 视频 MIME 类型 */
  videoType?: string
  /** 是否在用户首次交互后取消静音（浏览器通常禁止自动播放有声） */
  unmuteOnInteraction?: boolean
  /** 音量键挂载的 DOM 节点（用于 Portal，使音量键浮在遮盖层之上） */
  portalTargetRef?: RefObject<HTMLElement | null>
  className?: string
}

export interface HeroMediaBackgroundRef {
  playAudio: () => void
}

const HeroMediaBackground = forwardRef<HeroMediaBackgroundRef, HeroMediaBackgroundProps>(
  (
    {
      poster,
      videoSrc,
      videoType = 'application/x-mpegURL',
      unmuteOnInteraction = false,
      portalTargetRef,
      className
    },
    ref
  ) => {
    const siteConfig = useSiteConfig()
    const { headerHeight } = useLayoutHeights()
    const cdnUrl = siteConfig.cdnUrl ?? ''
    const resolvedPoster = poster ?? `${cdnUrl}/chou-kaguya/video/poster.avif`
    const resolvedVideoSrc = videoSrc ?? `${cdnUrl}/chou-kaguya/video/master.m3u8`
    const videoRef = useRef<HTMLVideoElement>(null)
    const hasRequestedUnmuteRef = useRef(false)
    const volumeFadeTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const isMutedRef = useRef(true)
    const [isMuted, setIsMuted] = useState(true)
    const [videoError, setVideoError] = useState(false)

    useEffect(() => {
      isMutedRef.current = isMuted
    }, [isMuted])

    const clearVolumeTimer = useCallback(() => {
      if (volumeFadeTimerRef.current) {
        clearInterval(volumeFadeTimerRef.current)
        volumeFadeTimerRef.current = null
      }
    }, [])

    const fadeInVolume = useCallback((video: HTMLVideoElement) => {
      clearVolumeTimer()
      video.volume = 0
      video.muted = false
      video.play().catch(() => {})
      let v = 0
      volumeFadeTimerRef.current = setInterval(() => {
        v += 0.02
        video.volume = Math.min(v, 0.1)
        if (v >= 0.1) {
          clearVolumeTimer()
        }
      }, 200)
    }, [clearVolumeTimer])

    const fadeOutVolume = useCallback((video: HTMLVideoElement) => {
      clearVolumeTimer()
      let v = video.volume
      volumeFadeTimerRef.current = setInterval(() => {
        v = Math.max(0, v - 0.02)
        video.volume = v
        if (v <= 0) {
          clearVolumeTimer()
          video.pause()
        }
      }, 100)
    }, [clearVolumeTimer])

    const playAudio = useCallback(() => {
      hasRequestedUnmuteRef.current = true
      const video = videoRef.current
      if (video) {
        fadeInVolume(video)
        setIsMuted(false)
      }
    }, [fadeInVolume])

    useImperativeHandle(ref, () => ({ playAudio }), [playAudio])

    const toggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation()
      const video = videoRef.current
      if (!video) return
      const nextMuted = !video.muted
      video.muted = nextMuted
      if (!nextMuted) {
        fadeInVolume(video)
      }
      setIsMuted(nextMuted)
    }, [fadeInVolume])

    useEffect(() => {
      return () => {
        if (volumeFadeTimerRef.current) {
          clearInterval(volumeFadeTimerRef.current)
          volumeFadeTimerRef.current = null
        }
      }
    }, [])

    // 欢迎 section 移出视口时：有声音则渐出后暂停，静音则直接暂停；移入时静音播放
    useEffect(() => {
      const target = portalTargetRef?.current
      if (!target) return

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          const video = videoRef.current
          if (!video) return
          if (entry.isIntersecting) {
            clearVolumeTimer()
            video.muted = true
            video.volume = 0
            isMutedRef.current = true
            setIsMuted(true)
            video.play().catch(() => {})
          } else {
            if (isMutedRef.current) {
              video.pause()
            } else {
              fadeOutVolume(video)
            }
          }
        },
        { threshold: 0, rootMargin: `${-headerHeight}px 0px 0px 0px` }
      )
      observer.observe(target)
      return () => observer.disconnect()
    }, [portalTargetRef, headerHeight, fadeOutVolume, clearVolumeTimer])

    useEffect(() => {
      if (!unmuteOnInteraction) return

      const handleInteraction = () => {
        if (hasRequestedUnmuteRef.current) return
        playAudio()
      }

      const target = document
      target.addEventListener('click', handleInteraction, { once: true })
      target.addEventListener('keydown', handleInteraction, { once: true })
      target.addEventListener('touchstart', handleInteraction, { once: true })

      return () => {
        target.removeEventListener('click', handleInteraction)
        target.removeEventListener('keydown', handleInteraction)
        target.removeEventListener('touchstart', handleInteraction)
      }
    }, [unmuteOnInteraction, playAudio])

    const muteButton = (
      <button
        type="button"
        className={cn(
          'absolute top-4 right-4 z-[20] p-2 rounded-full backdrop-blur-sm border border-white/20',
          'pointer-events-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50',
          'transition-opacity hover:opacity-90',
          'cursor-pointer'
        )}
        onClick={toggleMute}
        aria-label={isMuted ? '取消静音' : '静音'}
      >
        {isMuted ? (
          <MuteIcon className="w-5 h-5" />
        ) : (
          <VolumeIcon className="w-5 h-5" />
        )}
      </button>
    )

    const portalTarget = portalTargetRef?.current
    const videoLayer = (
      <div
        className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}
        aria-hidden
      >
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            ref={videoRef}
            id="hero-video"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={resolvedPoster}
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setVideoError(false)}
            onError={() => setVideoError(true)}
          >
            <source src={resolvedVideoSrc} type={videoType} />
          </video>
        </div>
      </div>
    )

    if (portalTarget) {
      return (
        <>
          {videoLayer}
          {!videoError && createPortal(muteButton, portalTarget)}
        </>
      )
    }

    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)} aria-hidden>
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <video
            ref={videoRef}
            id="hero-video"
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={resolvedPoster}
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setVideoError(true)}
          >
            <source src={resolvedVideoSrc} type={videoType} />
          </video>
        </div>
        {!videoError && muteButton}
      </div>
    )
  }
)

HeroMediaBackground.displayName = 'HeroMediaBackground'

export default HeroMediaBackground
