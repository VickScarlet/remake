import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { Game } from './Game'
import './styles/colors.css'
import './styles/common.css'

const container = document.getElementById('remake')!
const root = createRoot(container)
root.render(
    <StrictMode>
        <Game />
    </StrictMode>,
)
