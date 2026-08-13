import { useState, useRef } from 'react'
import { useLayoutEffect, useEffect } from 'react'
import { useNext, useGotoSummary, type Log } from '@remake/hooks'
import { useJudge } from '@/hooks/judge'
import { achievements, events, talents } from '@remake/data'
import { properties } from '@/display'
import { AutoInterval } from '@/config'
import { format } from '@remake/vitex'
import './Play.css'

function LogTalent({ id }: { id: number }) {
    const { name, description, grade } = talents.get(id)!
    return (
        <li className={`grade-${grade}`}>
            <span className="tag font-mono">[天赋]</span>
            <span className="name">{name}</span>
            <span className="description">{description}</span>
        </li>
    )
}

function LogTalents({ items }: { items: number[] }) {
    if (items.length === 0) return null
    const els = items.map(id => <LogTalent key={id} id={id} />)
    return <ul className="log-inner log-talents">{els}</ul>
}

const year = new Date().getFullYear()
interface LogEventProps {
    id: number
    post: boolean
    index: number
}
function LogEvent({ id, post, index }: LogEventProps) {
    let { event, postEvent, grade, format: f } = events.get(id)!
    if (f) {
        const g = (key: string) => ({ CurrentYear: year + index })[key]
        event = format(event, g)
        if (post && postEvent) postEvent = format(postEvent, g)
    }
    return (
        <>
            <li className={`grade-${grade}`}>{event}</li>
            {post && postEvent && (
                <li className={`grade-${grade}`}>{postEvent}</li>
            )}
        </>
    )
}

function LogEvents({ items, index }: { items: number[]; index: number }) {
    const last = items.length - 1
    const els = items.map((id, i) => (
        <LogEvent key={id} id={id} post={i == last} index={index} />
    ))
    return <ul className="log-inner log-events">{els}</ul>
}

function LogAchievement({ id }: { id: number }) {
    const { name, description, grade } = achievements.get(id)!
    return (
        <li className={`grade-${grade}`}>
            <span className="tag font-mono">[成就]</span>
            <span className="name">{name}</span>
            <span className="description">{description}</span>
        </li>
    )
}

function LogAchievements({ items }: { items: number[] }) {
    if (items.length === 0) return null
    const els = items.map(id => <LogAchievement key={id} id={id} />)
    return <ul className="log-inner log-achievements">{els}</ul>
}

function Log({ log, index }: { log: Log; index: number }) {
    return (
        <li className="log">
            <span className="age font-mono">{log.age}岁</span>
            <div className="content">
                <LogTalents items={log.talents} />
                <LogEvents items={log.events} index={index} />
                <LogAchievements items={log.achievements} />
            </div>
        </li>
    )
}

interface PropProps {
    prop: keyof typeof properties
    value: number
    grade: number
}

function Prop({ prop, value, grade }: PropProps) {
    const prevRef = useRef<number>(value)
    const [trend, setTrend] = useState<'up' | 'down' | 'normal'>('normal')
    const [flip, setFlip] = useState(0)
    const [displayValue, setDisplayValue] = useState<number>(value)
    useEffect(() => {
        const prev = prevRef.current
        if (value === prev) return
        prevRef.current = value
        setTrend(value > prev ? 'up' : 'down')
        setFlip(f => (f + 1) % 2)
        let startTimestamp: number | null = null
        const duration = 400
        const startValue = displayValue
        let end = false
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp
            const progress = timestamp - startTimestamp
            const progressRatio = Math.min(progress / duration, 1)
            const easeOutQuad = progressRatio * (2 - progressRatio)
            const currentDec = startValue + (value - startValue) * easeOutQuad
            setDisplayValue(Math.round(currentDec))
            if (!end && progress < duration) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
        const timer = setTimeout(() => setTrend('normal'), 2000)
        return () => {
            clearTimeout(timer)
            setDisplayValue(value)
            end = true
        }
    }, [value])

    return (
        <li className={`${prop} grade-${grade} trend-${trend}-${flip}`}>
            <span className="name">{properties[prop]}</span>
            <span className="value font-mono">{displayValue}</span>
        </li>
    )
}

function Properties() {
    const judges = useJudge()
    return (
        <ul className="properties">
            {judges.map(([key, { value, grade }]) => (
                <Prop key={key} prop={key} value={value} grade={grade} />
            ))}
        </ul>
    )
}

export function Play() {
    const [{ logs, ended }, next] = useNext()
    const [auto, setAuto] = useState(false)
    const logRef = useRef<HTMLUListElement>(null)
    const autoRef = useRef(0)
    const gotoSummary = useGotoSummary()
    const handleNext = () => {
        if (ended) return
        const achievements = next()
        // TODO: Show achievements
        console.debug('Achievements:', achievements)
    }
    const handleGotoSummary = () => {
        if (!ended) return
        const achievements = gotoSummary()
        // TODO: Show achievements
        console.debug('Achievements:', achievements)
    }
    useLayoutEffect(() => {
        requestAnimationFrame(() => {
            if (!logRef.current) return
            logRef.current.scrollTop = logRef.current.scrollHeight
        })
    }, [logs])
    useEffect(() => {
        if (!auto) window.clearInterval(autoRef.current)
        else autoRef.current = window.setInterval(handleNext, AutoInterval)
        return () => window.clearInterval(autoRef.current)
    }, [auto, handleNext])
    return (
        <div className="screen play">
            <Properties />
            <ul
                className="logs hide-scrollbar"
                onClick={handleNext}
                ref={logRef}
            >
                {logs.map((log, index) => (
                    <Log key={index} log={log} index={index} />
                ))}
            </ul>
            <div className="controls">
                {!ended && (
                    <button className="primary" onClick={() => setAuto(!auto)}>
                        {auto ? '关闭自动' : '开启自动'}
                    </button>
                )}
                {ended && (
                    <button className="primary" onClick={handleGotoSummary}>
                        人生总结
                    </button>
                )}
            </div>
        </div>
    )
}

export default Play
