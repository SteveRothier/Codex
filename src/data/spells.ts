export type SpellEntry = {
  id: number
  name: string
  description: string
  level: string
}

export const spells: SpellEntry[] = [
  {
    id: 1,
    name: 'Fireball',
    description: 'Lance une boule de feu',
    level: 'Avancé',
  },
  {
    id: 2,
    name: 'Ice Shield',
    description: 'Crée un bouclier de glace',
    level: 'Intermédiaire',
  },
  {
    id: 3,
    name: 'Arcane Bolt',
    description: 'Projectile d’énergie pure',
    level: 'Débutant',
  },
]
