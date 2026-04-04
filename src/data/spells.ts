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
  {
    id: 4,
    name: 'Shadow Step',
    description: 'Se fond dans les ténèbres et réapparaît derrière la cible',
    level: 'Avancé',
  },
  {
    id: 5,
    name: 'Healing Light',
    description: 'Rayon sacré qui referme les blessures superficielles',
    level: 'Intermédiaire',
  },
  {
    id: 6,
    name: 'Chain Lightning',
    description: 'L’éclair bondit d’un ennemi à l’autre',
    level: 'Avancé',
  },
  {
    id: 7,
    name: 'Stone Skin',
    description: 'La peau devient dure comme le granit',
    level: 'Intermédiaire',
  },
  {
    id: 8,
    name: 'Void Grasp',
    description: 'Immobilise la cible dans une brume du néant',
    level: 'Avancé',
  },
  {
    id: 9,
    name: 'Wind Rush',
    description: 'Une bourrasque propulse le lanceur en avant',
    level: 'Débutant',
  },
  {
    id: 10,
    name: 'Meteor Strike',
    description: 'Fait choir un fragment de roche en fusion du ciel',
    level: 'Avancé',
  },
]
