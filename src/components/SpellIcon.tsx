export type SpellIconProps = {
  icon: string
  label: string
  /** `page` : en-tête sort ; `compact` : ligne résultat recherche */
  variant?: 'page' | 'compact'
}

export function SpellIcon({
  icon,
  label,
  variant = 'page',
}: SpellIconProps) {
  const isUrl = /^https?:\/\//i.test(icon)

  if (variant === 'compact') {
    if (isUrl) {
      return (
        <span className="index-page__spell-icon" aria-hidden="true">
          <img
            src={icon}
            alt=""
            className="index-page__spell-icon-img"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
        </span>
      )
    }
    return (
      <span
        className="index-page__spell-icon"
        aria-hidden="true"
        title={label}
      >
        {icon}
      </span>
    )
  }

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
