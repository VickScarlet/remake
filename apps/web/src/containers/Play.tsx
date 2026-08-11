import { useState, useRef } from 'react'
import { useLayoutEffect, useEffect } from 'react'
import { useNext, useGotoSummary } from '@remake/hooks'
import type { Log } from '@remake/hooks'
import { properties } from '@/display'
import { keys } from '@remake/vitex'
import { achievements, events, talents } from '@remake/data'
import { AutoInterval } from '@/config'
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

interface LogEventProps {
    id: number
    post: boolean
}
function LogEvent({ id, post }: LogEventProps) {
    const { event, postEvent, grade } = events.get(id)!
    return (
        <>
            <li className={`grade-${grade}`}>{event}</li>
            {post && postEvent && (
                <li className={`grade-${grade}`}>{postEvent}</li>
            )}
        </>
    )
}

function LogEvents({ items }: { items: number[] }) {
    const last = items.length - 1
    const els = items.map((id, i) => (
        <LogEvent key={id} id={id} post={i == last} />
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

interface LogProps {
    log: Log
}
function Log({ log }: LogProps) {
    return (
        <li className="log">
            <span className="age font-mono">{log.age}岁</span>
            <div className="content">
                <LogTalents items={log.talents} />
                <LogEvents items={log.events} />
                <LogAchievements items={log.achievements} />
            </div>
        </li>
    )
}

export function Play() {
    const [{ state, logs, ended }, next] = useNext()
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
            <ul className="properties">
                {keys(state.props.current, ['age']).map(key => (
                    <li className={key} key={key}>
                        <span>{properties[key]}</span>
                        <span className="font-mono">
                            {state.props.current[key]}
                        </span>
                    </li>
                ))}
            </ul>
            <ul
                className="logs hide-scrollbar"
                onClick={handleNext}
                ref={logRef}
            >
                {logs.map((log, index) => (
                    <Log key={index} log={log} />
                ))}
            </ul>
            <div className="controls">
                {!ended && (
                    <button className="primary" onClick={() => setAuto(!auto)}>
                        {auto ? '手动' : '自动'}
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
