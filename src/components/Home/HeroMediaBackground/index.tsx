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

const clampVolume = (volume: number) => Math.min(1, Math.max(0, volume))

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
    const isMutedRef = useRef(true)
    const [isMuted, setIsMuted] = useState(true)
    const [videoError, setVideoError] = useState(false)

    useEffect(() => {
      isMutedRef.current = isMuted
    }, [isMuted])

    const getScrollVolume = useCallback(() => {
      const target = portalTargetRef?.current
      if (!target) return 1

      const rect = target.getBoundingClientRect()
      const header = document.querySelector('header')
      const headerBottom = header?.getBoundingClientRect().bottom ?? headerHeight

      if (rect.height <= 0 || rect.top >= headerBottom) {
        return 1
      }

      return clampVolume((rect.bottom - headerBottom) / rect.height)
    }, [portalTargetRef, headerHeight])

    const syncVideoPlayback = useCallback(() => {
      const video = videoRef.current
      if (!video) return

      const nextVolume = getScrollVolume()
      if (nextVolume <= 0) {
        video.volume = 0
        video.pause()
        return
      }

      if (isMutedRef.current) {
        video.muted = true
        video.volume = 0
      } else {
        video.muted = false
        video.volume = nextVolume
      }
      video.play().catch(() => {})
    }, [getScrollVolume])

    const playAudio = useCallback(() => {
      hasRequestedUnmuteRef.current = true
      isMutedRef.current = false
      setIsMuted(false)
      syncVideoPlayback()
    }, [syncVideoPlayback])

    useImperativeHandle(ref, () => ({ playAudio }), [playAudio])

    const toggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation()
      const nextMuted = !isMutedRef.current
      hasRequestedUnmuteRef.current = hasRequestedUnmuteRef.current || !nextMuted
      isMutedRef.current = nextMuted
      setIsMuted(nextMuted)
      syncVideoPlayback()
    }, [syncVideoPlayback])

    useEffect(() => {
      let animationFrameId = 0

      const scheduleSync = () => {
        if (animationFrameId) return
        animationFrameId = window.requestAnimationFrame(() => {
          animationFrameId = 0
          syncVideoPlayback()
        })
      }

      scheduleSync()
      window.addEventListener('scroll', scheduleSync, { passive: true })
      window.addEventListener('resize', scheduleSync)

      return () => {
        window.removeEventListener('scroll', scheduleSync)
        window.removeEventListener('resize', scheduleSync)
        if (animationFrameId) {
          window.cancelAnimationFrame(animationFrameId)
        }
      }
    }, [syncVideoPlayback])

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
