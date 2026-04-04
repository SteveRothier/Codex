import { forwardRef, Fragment } from 'react'
import type { WeaponSpell } from '../data/weaponSpells'

/** Espace insécable étroit avant l’unité (usage typographique FR). */
const U_NBSP = '\u202f'

function spaceBeforeSeconds(s: string): string {
  return s.replace(/(\d+(?:\.\d+)?)s\b/gi, `$1${U_NBSP}s`)
}

function spaceBeforeMeters(s: string): string {
  return s.replace(/(\d+(?:\.\d+)?)m\b/gi, `$1${U_NBSP}m`)
}

function localizeCastParenthetical(s: string): string {
  return s.replace(/\s*\(\s*uninterruptible\s*\)/gi, ' (non interruptible)')
}

/** Valeurs FR pour le tableau (les titres <dt> sont déjà en français). */
function formatCastSegment(seg: string): string {
  let t = seg.trim()
  if (/^instant$/i.test(t)) return 'Instantané'
  if (/^channeled$/i.test(t)) return 'Canalisé'
  if (/^moving channel$/i.test(t)) return 'Canalisation mobile'
  if (/^toggle$/i.test(t)) return 'Basculer'
  if (/^0$/i.test(t)) return `0${U_NBSP}s`
  t = localizeCastParenthetical(t)
  if (/\s-\s/.test(t)) {
    return t
      .split(/\s-\s/)
      .map((part) => spaceBeforeSeconds(part.trim()))
      .join(' – ')
  }
  return spaceBeforeSeconds(t)
}

function formatCastTimeDd(spell: WeaponSpell): string {
  const raw = spell.castTimeLabel.trim()
  if (raw === '') {
    return spell.castTimeS === 0
      ? 'Instantané'
      : `${spell.castTimeS}${U_NBSP}s`
  }
  if (raw.includes('/')) {
    return raw.split(/\s*\/\s*/).map(formatCastSegment).join(' / ')
  }
  return formatCastSegment(raw)
}

function formatRangeSegment(seg: string): string {
  const t = seg.trim()
  if (/^self$/i.test(t)) return 'Soi'
  return spaceBeforeMeters(t)
}

function formatRangeDd(spell: WeaponSpell): string {
  const rl = spell.rangeLabel.trim()
  if (/^self$/i.test(rl)) return 'Soi'
  if (rl.includes('/')) {
    return rl.split(/\s*\/\s*/).map(formatRangeSegment).join(' / ')
  }
  if (/^\d+(?:\.\d+)?m$/i.test(rl)) {
    return spaceBeforeMeters(rl)
  }
  return `${spell.rangeM}${U_NBSP}m`
}

function formatCooldownDd(spell: WeaponSpell): string {
  if (typeof spell.cooldownS === 'number') {
    return `${spell.cooldownS}${U_NBSP}s`
  }
  return String(spell.cooldownS)
    .split(/\s*\/\s*/)
    .map((p) => spaceBeforeSeconds(p.trim()))
    .join(' / ')
}

/** Ligne « Libellé: a | b | c » (stats à paliers type tooltip Albion). */
function parsePipeStatLine(line: string): { label: string; valuePart: string } | null {
  const colon = line.indexOf(':')
  if (colon === -1) return null
  const label = line.slice(0, colon).trim()
  const valuePart = line.slice(colon + 1).trim()
  if (!valuePart.includes('|')) return null
  const segments = valuePart.split('|').map((s) => s.trim()).filter(Boolean)
  if (segments.length < 2) return null
  return { label, valuePart }
}

type DescBlock =
  | { type: 'text'; lines: string[] }
  | { type: 'stat'; label: string; valuePart: string }

function splitDescriptionBlocks(description: string): DescBlock[] {
  const lines = description.split('\n')
  const blocks: DescBlock[] = []
  let textBuffer: string[] = []

  const flushText = () => {
    if (textBuffer.length === 0) return
    blocks.push({ type: 'text', lines: [...textBuffer] })
    textBuffer = []
  }

  for (const line of lines) {
    const stat = parsePipeStatLine(line)
    if (stat) {
      flushText()
      blocks.push({ type: 'stat', label: stat.label, valuePart: stat.valuePart })
    } else {
      textBuffer.push(line)
    }
  }
  flushText()
  return blocks
}

function isDamageStatLabel(label: string): boolean {
  const l = label.trim().toLowerCase()
  return (
    l === 'damage' ||
    l === 'physical damage' ||
    l === 'magical damage' ||
    l.endsWith(' damage')
  )
}

/** Soins / vol de vie (valeurs + | en vert). */
function isHealStatLabel(label: string): boolean {
  if (isDamageStatLabel(label)) return false
  const l = label.trim().toLowerCase()
  if (l === 'lifesteal') return true
  if (l === 'healing') return true
  if (
    l.startsWith('healing') &&
    !l.includes('reduction') &&
    !l.includes('negat') &&
    !l.includes('received')
  ) {
    return true
  }
  return false
}

/** Libellés de stats « débuff » (valeurs + | en violet, style tooltip Albion). */
function isDebuffStatLabel(label: string): boolean {
  if (isDamageStatLabel(label)) return false
  if (isHealStatLabel(label)) return false
  const l = label.trim().toLowerCase()
  if (l === 'slow' || l.startsWith('slow ')) return true
  if (l.includes('resistance reduction')) return true
  if (l.includes('fear duration')) return true
  if (l.includes('silence duration')) return true
  if (l.includes('stun duration')) return true
  if (l.includes('root duration')) return true
  if (l.includes('snare') && l.includes('duration')) return true
  if (l.includes('healing reduction')) return true
  if (l.includes('healing received') && l.includes('reduc')) return true
  if (l.includes('debuff duration')) return true
  return false
}

function DescriptionContent({ description }: { description: string }) {
  const blocks = splitDescriptionBlocks(description)
  return (
    <>
      {blocks.map((block, i) =>
        block.type === 'text' ? (
          <p key={i} className="page__desc-para">
            {block.lines.join('\n')}
          </p>
        ) : (
          <p key={i} className="page__desc-stat">
            <span className="page__desc-stat-bullet" aria-hidden="true">
              ■
            </span>
            <span className="page__desc-stat-inner">
              <span className="page__desc-stat-label">{block.label}:</span>{' '}
              <span className="page__desc-stat-values">
                {block.valuePart
                  .split('|')
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((part, j) => {
                    const damage = isDamageStatLabel(block.label)
                    const heal = isHealStatLabel(block.label)
                    const debuff = isDebuffStatLabel(block.label)
                    const sepClass = debuff
                      ? 'page__desc-stat-sep page__desc-stat-sep--debuff'
                      : heal
                        ? 'page__desc-stat-sep page__desc-stat-sep--heal'
                        : 'page__desc-stat-sep'
                    const valueClass = damage
                      ? 'page__desc-stat-value page__desc-stat-value--damage'
                      : heal
                        ? 'page__desc-stat-value page__desc-stat-value--heal'
                        : debuff
                          ? 'page__desc-stat-value page__desc-stat-value--debuff'
                          : 'page__desc-stat-value'
                    return (
                      <Fragment key={j}>
                        {j > 0 && (
                          <span className={sepClass}>
                            {' '}
                            |{' '}
                          </span>
                        )}
                        <span className={valueClass}>{part}</span>
                      </Fragment>
                    )
                  })}
              </span>
            </span>
          </p>
        ),
      )}
    </>
  )
}

export type PageProps = {
  side: 'left' | 'right'
  spell: WeaponSpell | null
}

function SpellIcon({ icon, label }: { icon: string; label: string }) {
  const isUrl = /^https?:\/\//i.test(icon)
  if (isUrl) {
    return (
      <span className="page__icon page__icon--img" aria-hidden="true">
        <img
          src={icon}
          alt=""
          className="page__icon-img"
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
        />
      </span>
    )
  }
  return (
    <span className="page__icon" aria-hidden="true" title={label}>
      {icon}
    </span>
  )
}

const Page = forwardRef<HTMLDivElement, PageProps>(function Page(
  { side, spell },
  ref,
) {
  return (
    <div
      ref={ref}
      className={`page page--${side} flip-book-page`}
      aria-label={side === 'left' ? 'Page gauche' : 'Page droite'}
    >
      <span className="page__fore-edge" aria-hidden="true" />
      <span className="page__gutter-shadow" aria-hidden="true" />
      <div className="page__texture" aria-hidden="true" />
      <div className="page__inner">
        {spell ? (
          <>
            <header className="page__header">
              <SpellIcon icon={spell.icon} label={spell.spellName} />
              <div className="page__headlines">
                <p className="page__meta-row">
                  <span className="page__type">{spell.weaponType}</span>
                  <span className="page__meta-sep" aria-hidden="true">
                    ·
                  </span>
                  <span className="page__weapon">{spell.weaponName}</span>
                </p>
                <h2 className="page__title">{spell.spellName}</h2>
              </div>
            </header>
            <div className="page__desc">
              <DescriptionContent description={spell.description} />
            </div>
            <dl className="page__stats">
              <div className="page__stat">
                <dt>Énergie</dt>
                <dd>{spell.energyCost}</dd>
              </div>
              <div className="page__stat">
                <dt>Incantation</dt>
                <dd>{formatCastTimeDd(spell)}</dd>
              </div>
              <div className="page__stat">
                <dt>Portée</dt>
                <dd>{formatRangeDd(spell)}</dd>
              </div>
              <div className="page__stat">
                <dt>Recharge</dt>
                <dd>{formatCooldownDd(spell)}</dd>
              </div>
            </dl>
          </>
        ) : (
          <div className="page__empty" aria-hidden="true">
            <span className="page__empty-line" />
          </div>
        )}
      </div>
    </div>
  )
})

Page.displayName = 'Page'

export default Page
