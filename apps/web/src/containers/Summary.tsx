import { useEffect, useRef } from 'react'
import { usePicked, useEnd, useProfile, useIsClassic } from '@remake/hooks'
import { useEndJudge } from '@/hooks/judge'
import { properties, judgeDisplay } from '@/display'
import { toastAchvs, toastMsg } from '@/toast'
import Talent from '@/components/Talent'
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
    const talents = usePicked()
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
    }, [profile.locked, talents, picked, picker])

    return (
        <ul className="talent-list">
            {Array.from(talents, id => (
                <li key={id} onClick={() => picker(id)}>
                    <Talent id={id} selected={picked.has(id)} />
                </li>
            ))}
        </ul>
    )
}

export default function Summary() {
    const isClassic = useIsClassic()
    const [locked, picker, end] = useEnd()
    const handlePicker = (id: number) => {
        if (isClassic) picker(id)
        else toastMsg('名人天赋不可锁定', 'summary-toast')
    }
    const handleEnd = () => {
        const achievements = end()
        toastAchvs(achievements)
    }
    return (
        <div className="screen summary">
            <Judges />
            <div className="section">
                <div className="title">
                    {isClassic
                        ? '你可以锁定一个天赋，下辈子还能抽到'
                        : '名人天赋不可锁定'}
                </div>
                <TalentList picked={locked} picker={handlePicker} />
            </div>
            <button className="primary" onClick={handleEnd}>
                再次重开
            </button>
        </div>
    )
}
