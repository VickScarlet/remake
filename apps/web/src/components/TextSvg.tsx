import { useState, useEffect, useRef } from 'react'
export interface Props {
    text: string
    className: string
}

export function TextSvg({ text, className }: Readonly<Props>) {
    const [height, setHeight] = useState(0)
    const [width, setWidth] = useState(0)
    const textRef = useRef<SVGTextElement>(null)
    useEffect(() => {
        if (!textRef.current) return
        const { width, height } = textRef.current.getBBox()
        setWidth(width)
        setHeight(height)
    }, [text, className, textRef])
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox={`0 0 ${width} ${height}`}
        >
            <text
                ref={textRef}
                fontSize={10}
                style={{
                    transform: 'translate(50%,50%)',
                    textAnchor: 'middle',
                    dominantBaseline: 'central',
                }}
            >
                {text}
            </text>
        </svg>
    )
}
export default TextSvg
