/**
 * Sorts Third Slot — data.json (`entries` API + `manualEntries`).
 */

import openAlbionData from './data.json'

export type WeaponSpell = {
  /** Catégorie d’arme (ex. Axe) — clé de fusion + libellé affiché. */
  weaponType: string
  weaponName: string
  spellName: string
  icon: string
  description: string
  energyCost: number | string
  castTimeS: number
  castTimeLabel: string
  rangeM: number
  rangeLabel: string
  cooldownS: number | string
}

/** Schéma allégé (JSON OpenAlbion) */
type OpenAlbionEntry = {
  weapon: {
    name: string
    subcategoryName: string
  }
  spell: {
    name: string
    icon: string
    description: string
    energyCost: number | string
    castTimeS: number
    castTimeLabel: string
    rangeM: number
    rangeLabel: string
    cooldownS: number | string
  }
}

type OpenAlbionFile = {
  entries: OpenAlbionEntry[]
  manualEntries?: OpenAlbionEntry[]
}

const { entries: rawEntries, manualEntries = [] } =
  openAlbionData as OpenAlbionFile

function mapEntry(entry: OpenAlbionEntry): WeaponSpell {
  const { weapon, spell } = entry

  return {
    weaponType: weapon.subcategoryName,
    weaponName: weapon.name,
    spellName: spell.name,
    icon: spell.icon,
    description: spell.description,
    energyCost: spell.energyCost,
    castTimeS: spell.castTimeS,
    castTimeLabel: spell.castTimeLabel,
    rangeM: spell.rangeM,
    rangeLabel: spell.rangeLabel,
    cooldownS: spell.cooldownS,
  }
}

/** Insère les sorts manuels après le dernier sort API de chaque catégorie. */
function mergeManualSpellsLastPerCategory(
  apiSpells: WeaponSpell[],
  manualSpells: WeaponSpell[],
): WeaponSpell[] {
  const manualByCat = new Map<string, WeaponSpell[]>()
  for (const s of manualSpells) {
    const arr = manualByCat.get(s.weaponType) ?? []
    arr.push(s)
    manualByCat.set(s.weaponType, arr)
  }

  const apiByCat = new Map<string, WeaponSpell[]>()
  const categoryOrder: string[] = []
  for (const s of apiSpells) {
    const id = s.weaponType
    if (!apiByCat.has(id)) {
      categoryOrder.push(id)
      apiByCat.set(id, [])
    }
    apiByCat.get(id)!.push(s)
  }

  const out: WeaponSpell[] = []
  for (const cat of categoryOrder) {
    out.push(...(apiByCat.get(cat) ?? []))
    out.push(...(manualByCat.get(cat) ?? []))
  }
  for (const [cat, list] of manualByCat) {
    if (!apiByCat.has(cat)) out.push(...list)
  }
  return out
}

export const weaponSpells: WeaponSpell[] = mergeManualSpellsLastPerCategory(
  rawEntries.map(mapEntry),
  manualEntries.map(mapEntry),
)
