import { useState, useEffect } from 'react'
import './ThemeToggle.css'

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(
        () => matchMedia('(prefers-color-scheme: dark)').matches,
    )

    useEffect(() => {
        document.documentElement.dataset.theme = isDark ? 'dark' : 'light'
    }, [isDark])

    return (
        <button
            className="theme-toggle-btn"
            onClick={() => setIsDark(!isDark)}
            aria-label="Toggle theme"
        >
            <svg
                className="theme-svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <defs>
                    <mask id="ios-fail-proof-mask">
                        <rect
                            x="0"
                            y="0"
                            width="24"
                            height="24"
                            fill="#ffffff"
                        />
                        <g className="mask-cutter-group">
                            <circle cx="18" cy="5" r="7" fill="#000000" />
                        </g>
                    </mask>
                </defs>

                <circle
                    className="sun-center"
                    cx="12"
                    cy="12"
                    r="5"
                    mask="url(#ios-fail-proof-mask)"
                />
                <g className="sun-beams">
                    <line x1="12" y1="1" x2="12" y2="3" />
                    <line x1="12" y1="21" x2="12" y2="23" />
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                    <line x1="1" y1="12" x2="3" y2="12" />
                    <line x1="21" y1="12" x2="23" y2="12" />
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
            </svg>
        </button>
    )
}

export default ThemeToggle
