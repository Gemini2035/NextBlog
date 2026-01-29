'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle, useState, useCallback, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { useLayoutHeights } from '@/hooks'
import { cn } from '@/utils'
import { VolumeIcon, MuteIcon } from '@/assets/icons'

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

const DEFAULT_POSTER = 'https://jp.enldm.cyou/chou-kaguya/video/poster.avif'
const DEFAULT_VIDEO_SRC = 'https://jp.enldm.cyou/chou-kaguya/video/master.m3u8'

const HeroMediaBackground = forwardRef<HeroMediaBackgroundRef, HeroMediaBackgroundProps>(
  (
    {
      poster = DEFAULT_POSTER,
      videoSrc = DEFAULT_VIDEO_SRC,
      videoType = 'application/x-mpegURL',
      unmuteOnInteraction = true,
      portalTargetRef,
      className
    },
    ref
  ) => {
    const { headerHeight } = useLayoutHeights()
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

    // 避免浏览器显示原生媒体控制层（如 Chrome 的媒体通知/控制弹窗）
    useEffect(() => {
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        navigator.mediaSession.playbackState = 'none'
        navigator.mediaSession.metadata = null
      }
    }, [])

    useEffect(() => {
      return () => {
        if (volumeFadeTimerRef.current) {
          clearInterval(volumeFadeTimerRef.current)
          volumeFadeTimerRef.current = null
        }
      }
    }, [])

    // 欢迎 section 移出视口时淡出音量后暂停，移入时继续播放（若曾取消静音则淡入音量）
    useEffect(() => {
      const target = portalTargetRef?.current
      if (!target) return

      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries
          const video = videoRef.current
          if (!video) return
          if (entry.isIntersecting) {
            video.play().catch(() => {})
            if (!isMutedRef.current) {
              fadeInVolume(video)
            }
          } else {
            fadeOutVolume(video)
          }
        },
        { threshold: 0, rootMargin: `${-headerHeight}px 0px 0px 0px` }
      )
      observer.observe(target)
      return () => observer.disconnect()
    }, [portalTargetRef, headerHeight, fadeInVolume, fadeOutVolume])

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
          'transition-opacity hover:opacity-90'
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
            poster={poster}
            disablePictureInPicture
            disableRemotePlayback
            onLoadedData={() => setVideoError(false)}
            onError={() => setVideoError(true)}
          >
            <source src={videoSrc} type={videoType} />
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
            poster={poster}
            disablePictureInPicture
            disableRemotePlayback
            onError={() => setVideoError(true)}
          >
            <source src={videoSrc} type={videoType} />
          </video>
        </div>
        {!videoError && muteButton}
      </div>
    )
  }
)

HeroMediaBackground.displayName = 'HeroMediaBackground'

export default HeroMediaBackground
