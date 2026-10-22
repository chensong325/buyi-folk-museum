import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { site } from '../data'

interface AudioContextValue {
  audioRef: React.RefObject<HTMLAudioElement | null>
  hasStarted: boolean
  isPlaying: boolean
  volume: number
  error: string | null
  play: () => Promise<void>
  pause: () => void
  toggle: () => Promise<void>
  setVolume: (value: number) => void
}

const AudioCtx = createContext<AudioContextValue | null>(null)
const DEFAULT_VOLUME = 0.3

export function AudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const wasPlayingOnHide = useRef(false)
  const fadeTimer = useRef<number | null>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolumeState] = useState(DEFAULT_VOLUME)
  const [error, setError] = useState<string | null>(null)

  const clearFade = useCallback(() => {
    if (fadeTimer.current !== null) {
      window.clearInterval(fadeTimer.current)
      fadeTimer.current = null
    }
  }, [])

  const fadeIn = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    clearFade()
    audio.volume = 0
    const startedAt = performance.now()
    const target = Math.max(0.01, volume)
    fadeTimer.current = window.setInterval(() => {
      const elapsed = performance.now() - startedAt
      const progress = Math.min(elapsed / 900, 1)
      audio.volume = target * progress
      if (progress >= 1) clearFade()
    }, 30)
  }, [clearFade, volume])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    try {
      clearFade()
      audio.volume = 0
      await audio.play()
      setHasStarted(true)
      setIsPlaying(true)
      setError(null)
      fadeIn()
    } catch {
      setIsPlaying(false)
      setError('浏览器未能启动音频，请点击右上角音乐按钮重试。')
    }
  }, [clearFade, fadeIn])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    clearFade()
    audio.pause()
    audio.volume = volume
    setIsPlaying(false)
  }, [clearFade, volume])

  const toggle = useCallback(async () => {
    if (isPlaying) pause()
    else await play()
  }, [isPlaying, pause, play])

  const setVolume = useCallback((value: number) => {
    const safeValue = Math.min(1, Math.max(0, value))
    setVolumeState(safeValue)
    if (audioRef.current) audioRef.current.volume = safeValue
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = volume
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    const onError = () => setError('背景音乐暂时无法加载，请稍后再试。')
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
    }
  }, [volume])

  useEffect(() => {
    const handleVisibility = () => {
      const audio = audioRef.current
      if (!audio) return
      if (document.hidden) {
        wasPlayingOnHide.current = !audio.paused && !audio.ended
        if (wasPlayingOnHide.current) audio.pause()
      } else if (wasPlayingOnHide.current) {
        wasPlayingOnHide.current = false
        void audio.play().catch(() => {
          setError('返回页面后音频未能恢复，请点击音乐按钮继续。')
        })
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [])

  useEffect(() => () => clearFade(), [clearFade])

  const value = useMemo(
    () => ({ audioRef, hasStarted, isPlaying, volume, error, play, pause, toggle, setVolume }),
    [error, hasStarted, isPlaying, pause, play, setVolume, toggle, volume],
  )

  return (
    <AudioCtx.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={site.audio}
        loop
        preload="none"
        aria-label="馆内背景音乐"
        data-testid="background-audio"
      />
    </AudioCtx.Provider>
  )
}

export function useMuseumAudio() {
  const value = useContext(AudioCtx)
  if (!value) throw new Error('useMuseumAudio must be used inside AudioProvider')
  return value
}



