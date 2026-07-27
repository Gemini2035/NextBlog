'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useLayoutHeights } from '@/hooks'
import { cn } from '@/utils'
import { VolumeIcon, MuteIcon } from '@/assets/icons'
import { useSiteConfig } from '@/components/SiteDataProvider'
import { getHeroPosterUrl, getHeroVideoUrl } from './media'

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
const VOLUME_FADE_DURATION_MS = 1200
const LONG_PRESS_DELAY_MS = 500

const easeInOutCubic = (progress: number) => {
  if (progress < 0.5) {
    return 4 * progress * progress * progress
  }

  return 1 - Math.pow(-2 * progress + 2, 3) / 2
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
    const resolvedPoster = poster ?? getHeroPosterUrl(cdnUrl)
    const resolvedVideoSrc = videoSrc ?? getHeroVideoUrl(cdnUrl)
    const videoRef = useRef<HTMLVideoElement>(null)
    const muteControlRef = useRef<HTMLDivElement>(null)
    const volumeFadeFrameRef = useRef<number | null>(null)
    const longPressTimeoutRef = useRef<number | null>(null)
    const didLongPressRef = useRef(false)
    const userVolumeRef = useRef(1)
    const hasRequestedUnmuteRef = useRef(false)
    const isMutedRef = useRef(true)
    const [isMuted, setIsMuted] = useState(true)
    const [isVolumeSliderOpen, setIsVolumeSliderOpen] = useState(false)
    const [userVolume, setUserVolume] = useState(1)
    const [videoError, setVideoError] = useState(false)

    useEffect(() => {
      isMutedRef.current = isMuted
    }, [isMuted])

    const cancelVolumeFade = useCallback(() => {
      if (volumeFadeFrameRef.current === null) return

      window.cancelAnimationFrame(volumeFadeFrameRef.current)
      volumeFadeFrameRef.current = null
    }, [])

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

    const getEffectiveVolume = useCallback(() => {
      return clampVolume(getScrollVolume() * userVolumeRef.current)
    }, [getScrollVolume])

    const fadeVideoVolume = useCallback((targetVolume: number, onComplete?: () => void) => {
      const video = videoRef.current
      if (!video) return

      cancelVolumeFade()
      const startVolume = video.volume
      const nextVolume = clampVolume(targetVolume)
      const startedAt = performance.now()

      if (nextVolume > 0) {
        video.muted = false
        video.play().catch(() => {})
      }

      const tick = (currentTime: number) => {
        const progress = Math.min((currentTime - startedAt) / VOLUME_FADE_DURATION_MS, 1)
        const easedProgress = easeInOutCubic(progress)

        video.volume = clampVolume(startVolume + (nextVolume - startVolume) * easedProgress)

        if (progress < 1) {
          volumeFadeFrameRef.current = window.requestAnimationFrame(tick)
          return
        }

        video.volume = nextVolume
        volumeFadeFrameRef.current = null
        onComplete?.()
      }

      volumeFadeFrameRef.current = window.requestAnimationFrame(tick)
    }, [cancelVolumeFade])

    const syncVideoPlayback = useCallback(() => {
      const video = videoRef.current
      if (!video) return

      cancelVolumeFade()
      const nextVolume = getEffectiveVolume()
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
    }, [cancelVolumeFade, getEffectiveVolume])

    const playAudio = useCallback(() => {
      const video = videoRef.current
      if (!video) return

      hasRequestedUnmuteRef.current = true
      isMutedRef.current = false
      setIsMuted(false)
      fadeVideoVolume(getEffectiveVolume())
    }, [fadeVideoVolume, getEffectiveVolume])

    useImperativeHandle(ref, () => ({ playAudio }), [playAudio])

    const toggleMute = useCallback((e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation()
      if (didLongPressRef.current) {
        didLongPressRef.current = false
        return
      }

      const nextMuted = !isMutedRef.current
      hasRequestedUnmuteRef.current = hasRequestedUnmuteRef.current || !nextMuted
      isMutedRef.current = nextMuted
      setIsMuted(nextMuted)
      if (nextMuted) {
        fadeVideoVolume(0, () => {
          const video = videoRef.current
          if (!video || !isMutedRef.current) return

          video.muted = true
        })
        return
      }

      fadeVideoVolume(getEffectiveVolume())
    }, [fadeVideoVolume, getEffectiveVolume])

    const clearLongPressTimeout = useCallback(() => {
      if (longPressTimeoutRef.current === null) return

      window.clearTimeout(longPressTimeoutRef.current)
      longPressTimeoutRef.current = null
    }, [])

    const openVolumeSlider = useCallback(() => {
      setIsVolumeSliderOpen(true)
    }, [])

    const handleContextMenu = useCallback((e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      openVolumeSlider()
    }, [openVolumeSlider])

    const handlePointerDown = useCallback((e: React.PointerEvent) => {
      e.stopPropagation()
      if (e.pointerType === 'mouse') return

      clearLongPressTimeout()
      didLongPressRef.current = false
      longPressTimeoutRef.current = window.setTimeout(() => {
        didLongPressRef.current = true
        openVolumeSlider()
      }, LONG_PRESS_DELAY_MS)
    }, [clearLongPressTimeout, openVolumeSlider])

    const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const nextUserVolume = clampVolume(Number(e.target.value) / 100)
      const video = videoRef.current

      userVolumeRef.current = nextUserVolume
      setUserVolume(nextUserVolume)

      if (!video) return

      cancelVolumeFade()

      if (isMutedRef.current) {
        video.volume = 0
        video.muted = true
        return
      }

      video.muted = false
      video.volume = clampVolume(getScrollVolume() * nextUserVolume)
      if (video.volume <= 0) {
        video.pause()
        return
      }

      video.play().catch(() => {})
    }, [cancelVolumeFade, getScrollVolume])

    useEffect(() => {
      return () => {
        cancelVolumeFade()
        clearLongPressTimeout()
      }
    }, [cancelVolumeFade, clearLongPressTimeout])

    useEffect(() => {
      if (!isVolumeSliderOpen) return

      const handlePointerDownOutside = (e: PointerEvent) => {
        const target = e.target
        if (!(target instanceof Node)) return
        if (muteControlRef.current?.contains(target)) return

        setIsVolumeSliderOpen(false)
      }

      document.addEventListener('pointerdown', handlePointerDownOutside)

      return () => {
        document.removeEventListener('pointerdown', handlePointerDownOutside)
      }
    }, [isVolumeSliderOpen])

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
      <div
        ref={muteControlRef}
        className={cn(
          'absolute top-4 right-4 z-[20]',
          'pointer-events-auto'
        )}
      >
        <button
          type="button"
          className={cn(
            'p-2 rounded-full backdrop-blur-sm border border-white/20',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white/50',
            'transition-opacity hover:opacity-90',
            'cursor-pointer'
          )}
          onClick={toggleMute}
          onContextMenu={handleContextMenu}
          onPointerDown={handlePointerDown}
          onPointerUp={clearLongPressTimeout}
          onPointerLeave={clearLongPressTimeout}
          onPointerCancel={clearLongPressTimeout}
          aria-label={isMuted ? '取消静音' : '静音'}
          aria-haspopup="true"
          aria-expanded={isVolumeSliderOpen}
        >
          {isMuted ? (
            <MuteIcon className="w-5 h-5" />
          ) : (
            <VolumeIcon className="w-5 h-5" />
          )}
        </button>
        {isVolumeSliderOpen && (
          <div
            className={cn(
              'absolute left-1/2 top-full mt-2 -translate-x-1/2',
              'flex h-32 w-10 items-center justify-center rounded-full border border-white/20 bg-black/35 backdrop-blur-md'
            )}
            onClick={(e) => e.stopPropagation()}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
            }}
          >
            <input
              type="range"
              min="0"
              max="100"
              step="1"
              value={Math.round(userVolume * 100)}
              className="h-24 w-2 cursor-pointer accent-white [writing-mode:vertical-lr] [direction:rtl]"
              onChange={handleVolumeChange}
              aria-label="音量"
            />
          </div>
        )}
      </div>
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
