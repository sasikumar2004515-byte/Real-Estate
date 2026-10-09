import { useEffect, useRef, useState } from 'react'
import {
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'

function formatTime(value) {
  if (!Number.isFinite(value)) {
    return '00:00'
  }

  const totalSeconds =
    Math.max(0, Math.floor(value))

  const minutes =
    Math.floor(
      totalSeconds / 60
    )

  const seconds =
    totalSeconds % 60

  return `${String(minutes).padStart(
    2,
    '0'
  )}:${String(seconds).padStart(
    2,
    '0'
  )}`
}

function VideoPlayer({
  item,
  autoPlayOnMount = false
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)

  const [started, setStarted] =
    useState(autoPlayOnMount)

  const [playing, setPlaying] =
    useState(false)

  const [muted, setMuted] =
    useState(false)

  const [currentTime, setCurrentTime] =
    useState(0)

  const [duration, setDuration] =
    useState(0)

  const [reduceMotion, setReduceMotion] =
    useState(false)

  useEffect(() => {
    const motionQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)'
      )

    const updateMotion = () => {
      setReduceMotion(
        motionQuery.matches
      )
    }

    updateMotion()

    motionQuery.addEventListener(
      'change',
      updateMotion
    )

    return () => {
      motionQuery.removeEventListener(
        'change',
        updateMotion
      )
    }
  }, [])

  useEffect(() => {
    setStarted(
      Boolean(autoPlayOnMount)
    )

    setPlaying(false)
    setMuted(false)
    setCurrentTime(0)
    setDuration(0)
  }, [
    item?.id,
    autoPlayOnMount
  ])

  useEffect(() => {
    if (
      item?.type !== 'mp4' ||
      !started
    ) {
      return undefined
    }

    const video =
      videoRef.current

    if (!video) {
      return undefined
    }

    const handleLoadedMetadata =
      () => {
        setDuration(
          Number.isFinite(
            video.duration
          )
            ? video.duration
            : 0
        )
      }

    const handleTimeUpdate =
      () => {
        setCurrentTime(
          video.currentTime || 0
        )
      }

    const handlePlay = () => {
      setPlaying(true)
    }

    const handlePause = () => {
      setPlaying(false)
    }

    const handleEnded = () => {
      setPlaying(false)
    }

    video.addEventListener(
      'loadedmetadata',
      handleLoadedMetadata
    )

    video.addEventListener(
      'timeupdate',
      handleTimeUpdate
    )

    video.addEventListener(
      'play',
      handlePlay
    )

    video.addEventListener(
      'pause',
      handlePause
    )

    video.addEventListener(
      'ended',
      handleEnded
    )

    if (
      video.readyState >= 1
    ) {
      handleLoadedMetadata()
    }

    return () => {
      video.removeEventListener(
        'loadedmetadata',
        handleLoadedMetadata
      )

      video.removeEventListener(
        'timeupdate',
        handleTimeUpdate
      )

      video.removeEventListener(
        'play',
        handlePlay
      )

      video.removeEventListener(
        'pause',
        handlePause
      )

      video.removeEventListener(
        'ended',
        handleEnded
      )
    }
  }, [
    item?.type,
    started
  ])

  useEffect(() => {
    if (
      !started ||
      item?.type !== 'mp4' ||
      !autoPlayOnMount
    ) {
      return undefined
    }

    const video =
      videoRef.current

    if (!video) {
      return undefined
    }

    const play = async () => {
      try {
        await video.play()
      } catch {
        setPlaying(false)
      }
    }

    play()

    return undefined
  }, [
    started,
    item?.type,
    item?.id,
    autoPlayOnMount
  ])

  useEffect(() => {
    const onChange = () => {
      if (!document.fullscreenElement) {
        try { window.screen.orientation.unlock() } catch { /* ignore */ }
      }
    }
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  useEffect(() => {
    return () => {
      const video =
        videoRef.current

      if (video) {
        video.pause()
        video.removeAttribute('src')
        video.load()
      }
    }
  }, [item?.id])

  const startPlayer = async () => {
    setStarted(true)

    // open full screen straight from the click, otherwise the browser blocks it
    const box = containerRef.current
    if (box && !document.fullscreenElement && box.requestFullscreen) {
      try { await box.requestFullscreen() } catch { /* stays inline if the browser refuses */ }
      // phones: turn the screen sideways so the film fills it
      try { await window.screen.orientation.lock('landscape') } catch { /* not supported, fine */ }
    }

    if (item?.type !== 'mp4') {
      return
    }

    window.setTimeout(
      async () => {
        const video =
          videoRef.current

        if (!video) {
          return
        }

        try {
          await video.play()
        } catch {
          setPlaying(false)
        }
      },
      50
    )
  }

  const togglePlay = async () => {
    const video =
      videoRef.current

    if (!video) {
      return
    }

    if (video.paused) {
      try {
        await video.play()
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video =
      videoRef.current

    if (!video) {
      return
    }

    video.muted = !video.muted

    setMuted(video.muted)
  }

  const handleProgress = (
    event
  ) => {
    const video =
      videoRef.current

    if (
      !video ||
      !duration
    ) {
      return
    }

    const percentage =
      Number(event.target.value)

    video.currentTime =
      (percentage / 100) *
      duration
  }

  const enterFullscreen =
    async () => {
      const container =
        containerRef.current

      if (!container) {
        return
      }

      try {
        if (
          document.fullscreenElement
        ) {
          await document.exitFullscreen()
          return
        }

        await container.requestFullscreen()
      } catch {
        return
      }
    }

  const handleKeyDown = (
    event
  ) => {
    if (
      event.target instanceof
        HTMLButtonElement ||
      event.target instanceof
        HTMLInputElement
    ) {
      return
    }

    if (event.key === ' ') {
      event.preventDefault()

      if (!started) {
        startPlayer()
        return
      }

      if (
        item?.type === 'mp4'
      ) {
        togglePlay()
      }

      return
    }

    if (
      event.key.toLowerCase() ===
      'm'
    ) {
      event.preventDefault()

      if (
        started &&
        item?.type === 'mp4'
      ) {
        toggleMute()
      }

      return
    }

    if (
      event.key.toLowerCase() ===
      'f'
    ) {
      event.preventDefault()
      enterFullscreen()
    }
  }

  if (!item) {
    return null
  }

  const progress =
    duration > 0
      ? Math.min(
          100,
          Math.max(
            0,
            (currentTime /
              duration) *
              100
          )
        )
      : 0

  const youtubeSrc =
    item.type === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`
      : ''

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-[#0B1A2E] shadow-[0_18px_50px_rgba(11,26,46,0.16)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E] focus-visible:ring-offset-4"
    >
      {!started && (
        <button
          type="button"
          onClick={startPlayer}
          aria-label={`Play video: ${item.title}`}
          className="absolute inset-0 z-30 overflow-hidden text-left focus:outline-none"
        >
          <img
            src={item.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/95 via-[#0B1A2E]/30 to-[#0B1A2E]/10" />

          <div className="absolute inset-0 flex items-center justify-center">

            <span
              aria-hidden="true"
              className="absolute h-[92px] w-[92px] rounded-full border border-[#C9A96E]/70 animate-[filmPulse_3s_ease-in-out_infinite] group-hover:[animation-play-state:paused]"
            />

            <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#C9A96E] bg-[#0B1A2E]/35 text-white backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">

              <Play
                size={25}
                strokeWidth={1.5}
                fill="currentColor"
                aria-hidden="true"
              />

            </span>
          </div>

          <div className="absolute bottom-5 left-5 right-5">

            <p className="font-['Inter'] text-[12px] font-medium uppercase tracking-[0.08em] text-white/70">
              Watch the film ·{' '}
              {item.duration}
            </p>

            <h3 className="mt-2 font-['Manrope'] text-lg font-semibold text-white sm:text-xl">
              {item.title}
            </h3>

          </div>
        </button>
      )}

      {started && (
        <div
          key={item.id}
          className={[
            'absolute inset-0',
            reduceMotion
              ? 'opacity-100'
              : 'animate-[videoPlayerIn_500ms_cubic-bezier(0.22,1,0.36,1)_both]'
          ].join(' ')}
        >
          {item.type === 'mp4' && (
            <>
              <video
                ref={videoRef}
                src={item.src}
                poster={item.poster}
                playsInline
                preload="metadata"
                className="h-full w-full bg-[#0B1A2E] object-contain"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0B1A2E] via-[#0B1A2E]/85 to-transparent px-4 pb-4 pt-14">

                <div className="pointer-events-auto flex items-center gap-2 sm:gap-3">

                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={
                      playing
                        ? 'Pause video'
                        : 'Play video'
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    {playing ? (
                      <Pause
                        size={15}
                        strokeWidth={1.5}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    ) : (
                      <Play
                        size={15}
                        strokeWidth={1.5}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <div className="relative flex min-w-0 flex-1 items-center">

                    <div
                      aria-hidden="true"
                      className="absolute left-0 right-0 h-px bg-white/20"
                    />

                    <div
                      aria-hidden="true"
                      className="absolute left-0 h-px bg-[#C9A96E]"
                      style={{
                        width: `${progress}%`
                      }}
                    />

                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="0.1"
                      value={progress}
                      onChange={
                        handleProgress
                      }
                      aria-label="Video progress"
                      className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent accent-[#C9A96E]"
                    />

                  </div>

                  <span className="hidden min-w-[82px] text-right font-['Inter'] text-[11px] font-medium tabular-nums text-white/70 sm:block">
                    {formatTime(
                      currentTime
                    )}{' '}
                    /{' '}
                    {formatTime(
                      duration
                    )}
                  </span>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={
                      muted
                        ? 'Unmute video'
                        : 'Mute video'
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    {muted ? (
                      <VolumeX
                        size={16}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    ) : (
                      <Volume2
                        size={16}
                        strokeWidth={1.4}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={
                      enterFullscreen
                    }
                    aria-label="Enter fullscreen"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 hover:border-white/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    <Maximize
                      size={16}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </button>

                </div>

              </div>
            </>
          )}

          {item.type === 'youtube' && (
            <iframe
              key={item.id}
              src={youtubeSrc}
              title={item.title}
              className="h-full w-full border-0"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
            />
          )}

          {item.type === 'tour' && (
            <iframe
              key={item.id}
              src={item.src}
              title={item.title}
              className="h-full w-full border-0"
              allow="fullscreen; xr-spatial-tracking"
              allowFullScreen
            />
          )}
        </div>
      )}

      <style>
        {`
          @keyframes filmPulse {
            0% {
              opacity: 0.65;
              transform: scale(1);
            }

            50% {
              opacity: 0;
              transform: scale(1.25);
            }

            100% {
              opacity: 0;
              transform: scale(1.25);
            }
          }

          @keyframes videoPlayerIn {
            from {
              opacity: 0;
            }

            to {
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            *,
            *::before,
            *::after {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}
      </style>
    </div>
  )
}

export default VideoPlayer