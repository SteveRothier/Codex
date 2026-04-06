import Book from './components/Book'
import { Particles } from './components/Particles'

function App() {
  return (
    <div className="app-shell">
      <Particles
        className="app-shell__particles"
        quantity={88}
        staticity={52}
        ease={58}
        color="#b39bc9"
      />
      <div className="app-shell__main">
        <Book />
      </div>
    </div>
  )
}

export default App
