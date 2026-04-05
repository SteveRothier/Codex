import { weaponSpells } from './weaponSpells'

/** Nombre de spreads « sorts » (2 pages par spread, dernière page vide si impair). */
export function getSpellSpreadCount(): number {
  return Math.max(1, Math.ceil(weaponSpells.length / 2))
}

/**
 * Nombre total de pages du flipbook :
 * couverture + 2 (index) + 2×spreads sorts + quatrième de couverture.
 */
export function getBookPageCount(): number {
  return 4 + 2 * getSpellSpreadCount()
}

/** Première page du double index (catégories + recherche : pages 1 et 2). */
export const INDEX_BOOK_PAGE = 1

/** Index de la première page de sort (après couverture + index). */
export const FIRST_SPELL_BOOK_PAGE = 3

/** Quatrième de couverture (dernière page du livre). */
export function getBackCoverBookPage(bookPageCount: number): number {
  return bookPageCount - 1
}

/** Page du livre (0-based) affichant le sort d’index `spellIndex`. */
export function spellIndexToBookPage(spellIndex: number): number {
  return FIRST_SPELL_BOOK_PAGE + spellIndex
}

/** Une arme dans une catégorie (1 sort third slot par arme dans les données). */
export type WeaponIndexEntry = {
  weaponName: string
  spellIndex: number
}

export type WeaponCategory = {
  weaponType: string
  /** Nombre total de sorts dans la catégorie */
  spellsCount: number
  /** Armes uniques, ordre = première apparition dans les données */
  weapons: WeaponIndexEntry[]
}

/** Catégories dans l’ordre de première apparition dans les données. */
export function getWeaponCategories(): WeaponCategory[] {
  const spellsCountByType = new Map<string, number>()
  weaponSpells.forEach((s) => {
    const t = s.weaponType
    spellsCountByType.set(t, (spellsCountByType.get(t) ?? 0) + 1)
  })

  const seenTypes = new Set<string>()
  const out: WeaponCategory[] = []

  for (const s of weaponSpells) {
    if (seenTypes.has(s.weaponType)) continue
    seenTypes.add(s.weaponType)

    const weapons: WeaponIndexEntry[] = []
    const seenWeapons = new Set<string>()
    for (let i = 0; i < weaponSpells.length; i++) {
      const row = weaponSpells[i]!
      if (row.weaponType !== s.weaponType) continue
      if (seenWeapons.has(row.weaponName)) continue
      seenWeapons.add(row.weaponName)
      weapons.push({ weaponName: row.weaponName, spellIndex: i })
    }

    out.push({
      weaponType: s.weaponType,
      spellsCount: spellsCountByType.get(s.weaponType) ?? weapons.length,
      weapons,
    })
  }

  return out
}
