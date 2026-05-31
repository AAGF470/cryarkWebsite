import { PortableText } from '@portabletext/react'
import CodeBlock from '../ui/CodeBlock'
import Spacer from '../ui/Spacer'
import './PortableTextRenderer.css'

// ---------------------------------------------------------------------------
// PortableTextRenderer
// Maps Sanity Portable Text blocks + custom object types to React components.
//
// Supported custom block types:
//   codeBlock       → <CodeBlock>
//   designDecision  → gold left-border decision item (styled as derg__decision)
//
// Consecutive designDecision blocks are grouped into a single <ul> so the
// vertical border line renders continuously without gaps.
// ---------------------------------------------------------------------------

// ── Block component definitions ───────────────────────────────────────────

const PT_COMPONENTS = {
  types: {
    // codeBlock is handled by the grouping renderer below, not here,
    // but this fallback covers stand-alone codeBlock inside PortableText
    codeBlock: ({ value }) => (
      <CodeBlock
        language={value.language ?? 'text'}
        title={value.title ?? null}
        code={value.code ?? ''}
      />
    ),
  },
  block: {
    normal: ({ children }) => <p className="cms__prose">{children}</p>,
    h2:     ({ children }) => <h2 className="cms__h2">{children}</h2>,
    h3:     ({ children }) => <h3 className="cms__h3">{children}</h3>,
    h4:     ({ children }) => <h4 className="cms__h4">{children}</h4>,
  },
  list: {
    bullet: ({ children }) => <ul className="cms__ul">{children}</ul>,
    number: ({ children }) => <ol className="cms__ol">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="cms__li">{children}</li>,
    number: ({ children }) => <li className="cms__li">{children}</li>,
  },
  marks: {
    code:   ({ children }) => <code className="cms__inline_code">{children}</code>,
    strong: ({ children }) => <strong>{children}</strong>,
    em:     ({ children }) => <em>{children}</em>,
    link:   ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noreferrer"
        className="cms__link"
      >
        {children}
      </a>
    ),
  },
}

// ── Grouping logic ────────────────────────────────────────────────────────
// Groups consecutive designDecision objects so they share one <ul> wrapper.

function group_content(content) {
  const groups = []
  let i = 0
  while (i < content.length) {
    const block = content[i]
    if (block._type === 'designDecision') {
      const batch = []
      while (i < content.length && content[i]._type === 'designDecision') {
        batch.push(content[i])
        i++
      }
      groups.push({ type: 'decisions', items: batch })
    } else if (block._type === 'codeBlock') {
      groups.push({ type: 'codeBlock', item: block })
      i++
    } else if (block._type === 'spacerBlock') {
      groups.push({ type: 'spacer', item: block })
      i++
    } else {
      // Standard portable text block — batch adjacent ones together
      const batch = []
      while (
        i < content.length &&
        content[i]._type !== 'designDecision' &&
        content[i]._type !== 'codeBlock'
      ) {
        batch.push(content[i])
        i++
      }
      groups.push({ type: 'richtext', items: batch })
    }
  }
  return groups
}

// ── Main renderer ─────────────────────────────────────────────────────────

export default function PortableTextRenderer({ content }) {
  if (!content || content.length === 0) return null

  const groups = group_content(content)

  return (
    <>
      {groups.map((group, idx) => {
        // ── Design decisions list ──────────────────────────────────────────
        if (group.type === 'decisions') {
          return (
            <ul key={idx} className="derg__decisions">
              {group.items.map(d => (
                <li key={d._key} className="derg__decision">
                  <strong className="derg__decision_key">{d.key}</strong>
                  <p className="derg__decision_desc">{d.description}</p>
                </li>
              ))}
            </ul>
          )
        }

        // ── Code block ────────────────────────────────────────────────────
        if (group.type === 'codeBlock') {
          const b = group.item
          return (
            <CodeBlock
              key={b._key ?? idx}
              language={b.language ?? 'text'}
              title={b.title ?? null}
              code={b.code ?? ''}
            />
          )
        }

        // ── Spacer ────────────────────────────────────────────────────────
        if (group.type === 'spacer') {
          return <Spacer key={group.item._key ?? idx} size={group.item.size ?? 'md'} />
        }

        // ── Rich text (standard Portable Text blocks) ─────────────────────
        return (
          <PortableText
            key={idx}
            value={group.items}
            components={PT_COMPONENTS}
          />
        )
      })}
    </>
  )
}
