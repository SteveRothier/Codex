export type SpellType = 'feu' | 'glace' | 'ombre' | 'arcane' | 'nature'

export type Spell = {
  id: string
  name: string
  description: string
  level: number
  type: SpellType
  color: string
}

export const spells: Spell[] = []
