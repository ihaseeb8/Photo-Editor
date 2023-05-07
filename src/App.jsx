import { useState } from 'react'
import { ImageEditor } from './ImageEditor'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App bg-sky-500">
      <header className="App-header">
        <ImageEditor />
      </header>
    </div>
  )
}

export default App
