import { useEffect, useState, useRef, useMemo } from 'react'
import { usePicked, useEnd, useProfile } from '@remake/hooks'
import { useEndJudge } from '@/hooks/judge'
import { properties, judgeDisplay } from '@/display'
import { isDev } from '@/config'
import TalentComponent from '@/components/Talent'
import './Summary.css'

function Judges() {
    const judges = useEndJudge()
    return (
        <ul className="judge-list">
            {judges.map(([key, { value, grade, level }]) => (
                <li className={`${key} grade-${grade}`} key={key}>
                    <span className="property">{properties[key]}</span>
                    <span className="value font-mono">{value}</span>
                    <span className="level">{judgeDisplay(key, level)}</span>
                </li>
            ))}
        </ul>
    )
}

interface TalentListProps {
    picked: Set<number>
    picker: (id: number) => void
}
function TalentList({ picked, picker }: TalentListProps) {
    const [profile] = useProfile()
    const items = usePicked()
    const talents = useMemo(() => {
        if (!isDev || !profile.locked) return items
        return new Set([...items, ...profile.locked])
    }, [])
    const hasInitialized = useRef(false)
    useEffect(() => {
        if (!profile.locked) return
        if (!hasInitialized.current) {
            for (const id of profile.locked) {
                if (talents.has(id) && !picked.has(id)) {
                    picker(id)
                }
            }
            hasInitialized.current = true
        }
    }, [picked, picker])

    return (
        <ul className="talent-list">
            {Array.from(talents, id => (
                <li key={id} onClick={() => picker(id)}>
                    <TalentComponent id={id} selected={picked.has(id)} />
                </li>
            ))}
        </ul>
    )
}

export default function Summary() {
    const [locked, picker, end] = useEnd()
    const handleEnd = () => {
        const achievements = end()
        // TODO: Show achievements
        console.log('Achievements', achievements)
    }
    return (
        <div className="screen summary">
            <Judges />
            <div className="section">
                <div className="title">你可以锁定一个天赋，下辈子还能抽到</div>
                <TalentList picked={locked} picker={picker} />
            </div>
            <button className="primary" onClick={handleEnd}>
                再次重开
            </button>
        </div>
    )
}
