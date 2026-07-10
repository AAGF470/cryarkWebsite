import { useRef, useState, useEffect } from 'react'
import './VoiceSample.css'
import { SectionIcon } from './SectionIcons'

// ---------------------------------------------------------------------------
// VoiceSample
// "Hear what the AI voice sounds like on a call" — a small phone-styled player
// with one or more sample clips (greeting, menu options). One plays at a time.
// Audio comes from the CMS (upload → src); a clip with no src shows a tasteful
// "coming soon" state so the section is safe to place before audio is added.
//
// Props:
//   eyebrow   string
//   headline  string
//   subtext   string
//   callerName string  — label on the "call" header (default: "Incoming call")
//   clips     Array<{ label, src?, sub? }>
//   layout    "phone"|"plain" — phone chrome with call header, or a plain
//             bordered card with just the clip rows (default: "phone")
//   variant   "default"|"alt"|"accent"
// ---------------------------------------------------------------------------

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z" /></svg>
)
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
)

function Clip({ clip, isPlaying, onToggle, onEnded }) {
  const ref = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (isPlaying) { el.play().catch(() => {}) } else { el.pause(); }
  }, [isPlaying])

  const disabled = !clip.src

  return (
    <div className={`voice-clip${isPlaying ? ' is-playing' : ''}${disabled ? ' is-disabled' : ''}`}>
      <button
        type="button"
        className="voice-clip__btn"
        onClick={onToggle}
        disabled={disabled}
        aria-label={`${isPlaying ? 'Pause' : 'Play'} ${clip.label}`}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>
      <div className="voice-clip__body">
        <span className="voice-clip__label">{clip.label}</span>
        {clip.sub && <span className="voice-clip__sub">{clip.sub}</span>}
        <span className="voice-clip__track" aria-hidden="true">
          <span className="voice-clip__fill" style={{ width: `${progress}%` }} />
        </span>
      </div>
      <span className="voice-clip__status">{disabled ? 'Sample coming soon' : ''}</span>
      {clip.src && (
        <audio
          ref={ref}
          src={clip.src}
          preload="none"
          onTimeUpdate={e => setProgress(e.target.duration ? (e.target.currentTime / e.target.duration) * 100 : 0)}
          onEnded={() => { setProgress(0); onEnded() }}
        />
      )}
    </div>
  )
}

export default function VoiceSample({
  eyebrow,
  headline,
  subtext,
  callerName = 'Incoming call',
  clips = [],
  layout = 'phone',
  variant = 'default',
}) {
  const [playing, setPlaying] = useState(-1) // index of the clip currently playing

  return (
    <section className={`section section--${variant}`}>
      <div className="section-container">
        {(eyebrow || headline || subtext) && (
          <div className="voice-sample__header">
            {eyebrow  && <p className="section-eyebrow">{eyebrow}</p>}
            {headline && <h2 className="section-title">{headline}</h2>}
            {subtext  && <p className="section-sub">{subtext}</p>}
          </div>
        )}

        <div className={layout === 'plain' ? 'voice-sample__plain' : 'voice-sample__phone'}>
          {layout !== 'plain' && (
            <div className="voice-sample__callbar">
              <span className="voice-sample__dot" aria-hidden="true"><SectionIcon name="phone" /></span>
              <span className="voice-sample__caller">{callerName}</span>
              <span className="voice-sample__live">DEMO</span>
            </div>
          )}
          <div className="voice-sample__clips">
            {clips.map((clip, i) => (
              <Clip
                key={i}
                clip={clip}
                isPlaying={playing === i}
                onToggle={() => setPlaying(p => (p === i ? -1 : i))}
                onEnded={() => setPlaying(-1)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
