import { useState } from 'react'
import { usePicked, useEnd } from '@remake/hooks'
import { useJudge } from '@/hooks/judge'
import type { JudgeKeys, Judge } from '@/hooks/judge'
import { properties, judgeDisplay } from '@/display'
import TalentComponent from '@/components/Talent'
import './Summary.css'

interface JudgeItemProps {
    prop: JudgeKeys
    judge: Judge
}
function JudgeItem({ prop, judge }: JudgeItemProps) {
    const { value, grade, level } = judge
    return (
        <li className={`${prop} grade-${grade}`}>
            <span className="property">{properties[prop]}</span>
            <span className="value font-mono">{value}</span>
            <span className="level">{judgeDisplay(prop, level)}</span>
        </li>
    )
}

export default function Summary() {
    const picked = usePicked()
    const judges = useJudge()
    const end = useEnd()
    const [locked, setLocked] = useState<number | null>(null)
    const handleSelect = (id: number) => {
        if (locked === id) setLocked(null)
        else setLocked(id)
    }
    const handleEnd = () => {
        const achievements = end()
        // TODO: Show achievements
        console.log('Achievements', achievements)
    }
    return (
        <div className="screen summary">
            <ul className="judge-list">
                {judges.map(([key, { value, grade, level }]) => (
                    <JudgeItem
                        key={key}
                        prop={key}
                        judge={{ value, grade, level }}
                    />
                ))}
            </ul>
            <div className="section">
                <div className="title">你可以锁定一个天赋，下辈子还能抽到</div>
                <ul className="talent-list">
                    {Array.from(picked, id => (
                        <li key={id} onClick={() => handleSelect(id)}>
                            <TalentComponent id={id} selected={locked === id} />
                        </li>
                    ))}
                </ul>
            </div>
            <button className="primary" onClick={handleEnd}>
                再次重开
            </button>
        </div>
    )
}
