import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles.css'
import App from './App'
import { AudioProvider } from './components/AudioProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AudioProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </AudioProvider>
  </StrictMode>,
)
