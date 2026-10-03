import { useEffect, useRef, useState } from 'react'
import {
  Maximize,
  Pause,
  Play,
  Volume2,
  VolumeX
} from 'lucide-react'

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return '00:00'
  }

  const minutes = Math.floor(
    seconds / 60
  )

  const remaining = Math.floor(
    seconds % 60
  )

  return `${String(minutes).padStart(
    2,
    '0'
  )}:${String(remaining).padStart(
    2,
    '0'
  )}`
}

function FilmPlayer({
  item,
  autoPlayOnMount = false
}) {
  const containerRef = useRef(null)
  const videoRef = useRef(null)
  const progressRef = useRef(null)

  const [playing, setPlaying] =
    useState(false)

  const [started, setStarted] =
    useState(Boolean(autoPlayOnMount && item?.src))

  const [muted, setMuted] =
    useState(false)

  const [duration, setDuration] =
    useState(0)

  const [currentTime, setCurrentTime] =
    useState(0)

  const [reduceMotion, setReduceMotion] =
    useState(false)

  useEffect(() => {
    const query = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    )

    const update = () => {
      setReduceMotion(query.matches)
    }

    update()

    query.addEventListener(
      'change',
      update
    )

    return () => {
      query.removeEventListener(
        'change',
        update
      )
    }
  }, [])

  useEffect(() => {
    setStarted(Boolean(autoPlayOnMount))
    setPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    setMuted(false)
  }, [item?.id, autoPlayOnMount])

  useEffect(() => {
    if (
      !autoPlayOnMount ||
      item?.type !== 'mp4'
    ) {
      return undefined
    }

    const video =
      videoRef.current

    if (!video) {
      return undefined
    }

    const playVideo = async () => {
      try {
        await video.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    }

    playVideo()

    return undefined
  }, [
    autoPlayOnMount,
    item?.id,
    item?.type
  ])

  useEffect(() => {
    if (
      !started ||
      item?.type !== 'mp4'
    ) {
      return undefined
    }

    const video =
      videoRef.current

    if (!video) {
      return undefined
    }

    const handleLoadedMetadata = () => {
      setDuration(
        video.duration || 0
      )
    }

    const handleTimeUpdate = () => {
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
  }, [started, item?.type])

  const hasSource = Boolean(item?.src)

  const startPlayer = async () => {
    if (!hasSource) return
    setStarted(true)

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
          setPlaying(true)
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
        setPlaying(true)
      } catch {
        setPlaying(false)
      }
    } else {
      video.pause()
      setPlaying(false)
    }
  }

  const toggleMute = () => {
    const video =
      videoRef.current

    if (!video) {
      return
    }

    const nextMuted = !video.muted

    video.muted = nextMuted
    setMuted(nextMuted)
  }

  const handleProgressChange = (
    event
  ) => {
    const video =
      videoRef.current

    if (!video || !duration) {
      return
    }

    const value =
      Number(event.target.value)

    video.currentTime =
      (value / 100) * duration
  }

  const toggleFullscreen =
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
        } else {
          await container.requestFullscreen()
        }
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
      } else if (
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
        !started ||
        item?.type !== 'mp4'
      ) {
        return
      }

      toggleMute()
      return
    }

    if (
      event.key.toLowerCase() ===
      'f'
    ) {
      event.preventDefault()
      toggleFullscreen()
    }
  }

  const progress =
    duration > 0
      ? (currentTime / duration) *
        100
      : 0

  const iframeSource =
    item?.type === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${item.src}?autoplay=1&rel=0&modestbranding=1&playsinline=1&color=white`
      : item?.src

  if (!item) {
    return null
  }

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
          aria-label={`Play ${item.title}`}
          className="absolute inset-0 z-20 overflow-hidden text-left focus:outline-none"
        >
          <img
            src={item.poster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-[3000ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1A2E]/95 via-[#0B1A2E]/25 to-[#0B1A2E]/10" />

          <div className="absolute inset-0 flex items-center justify-center">

            <span
              aria-hidden="true"
              className={[
                'absolute h-[92px] w-[92px] rounded-full border border-[#C9A96E]/70',
                'animate-[filmPulse_3s_ease-in-out_infinite]'
              ].join(' ')}
            />

            <span className="relative flex h-[72px] w-[72px] items-center justify-center rounded-full border border-[#C9A96E] bg-[#0B1A2E]/35 text-white backdrop-blur-sm transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105">

              <Play
                size={25}
                fill="currentColor"
                aria-hidden="true"
              />

            </span>

          </div>

          <div className="absolute bottom-5 left-5 right-5">

            <p className="font-['Inter'] text-[12px] font-medium uppercase tracking-[0.08em] text-white/75">
              {hasSource
                ? `Watch the film · ${item.duration}`
                : `Film coming soon · ${item.duration}`}
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
              ? ''
              : 'animate-[filmPlayerIn_500ms_cubic-bezier(0.22,1,0.36,1)_both]'
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
                className="h-full w-full object-contain bg-[#0B1A2E]"
              />

              <div className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[#0B1A2E] via-[#0B1A2E]/80 to-transparent px-4 pb-4 pt-12">

                <div className="flex items-center gap-3">

                  <button
                    type="button"
                    onClick={togglePlay}
                    aria-label={
                      playing
                        ? 'Pause video'
                        : 'Play video'
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    {playing ? (
                      <Pause
                        size={15}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    ) : (
                      <Play
                        size={15}
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <input
                    ref={progressRef}
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={
                      handleProgressChange
                    }
                    aria-label="Video progress"
                    className="h-1 min-w-0 flex-1 cursor-pointer appearance-none rounded-full bg-white/20 accent-[#C9A96E]"
                  />

                  <span className="min-w-[86px] text-right font-['Inter'] text-[11px] font-medium tabular-nums text-white/75">
                    {formatTime(
                      currentTime
                    )}{' '}
                    /{' '}
                    {formatTime(duration)}
                  </span>

                  <button
                    type="button"
                    onClick={toggleMute}
                    aria-label={
                      muted
                        ? 'Unmute video'
                        : 'Mute video'
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    {muted ? (
                      <VolumeX
                        size={16}
                        aria-hidden="true"
                      />
                    ) : (
                      <Volume2
                        size={16}
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={
                      toggleFullscreen
                    }
                    aria-label="Enter fullscreen"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-[transform,opacity] duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A96E]"
                  >
                    <Maximize
                      size={16}
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
              src={iframeSource}
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

          @keyframes filmPlayerIn {
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

export default FilmPlayer