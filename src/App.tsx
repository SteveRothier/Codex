import { Book } from './components/Book'

function App() {
  return (
    <main>
      <h1>Codex</h1>
      <Book
        leftPage={<p>Contenu page gauche</p>}
        rightPage={<p>Contenu page droite</p>}
      />
    </main>
  )
}

export default App
