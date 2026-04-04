interface PageProps {
  spell: { name: string; description: string; level: string }
}

export default function Page({ spell }: PageProps) {
  return (
    <div className="page">
      <h2>{spell.name}</h2>
      <p>{spell.description}</p>
      <small>{spell.level}</small>
    </div>
  )
}
