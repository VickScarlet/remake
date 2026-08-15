import { useState } from 'react'
import { useAllocator, usePointRandomizer, useLeftPoints } from '@remake/hooks'
import { usePicked, useReplaced, useStart, useIsClassic } from '@remake/hooks'
import type { AdditionalPoint } from '@remake/hooks'
import { properties } from '@/display'
import { keys } from '@remake/vitex'
import { judgeGradeByValue } from '@/config'
import { talents } from '@remake/data'
import Replaced from '@/components/Replaced'
import './Alloc.css'

interface AllocInputProps {
    point: number
    onChange: (point: number) => void
}

function AllocInput(props: AllocInputProps) {
    return (
        <div className="allocation-input">
            <button onClick={() => props.onChange(props.point - 1)}>−</button>
            <input
                className="font-mono"
                type="number"
                value={props.point}
                onChange={e => props.onChange(Number(e.target.value))}
            />
            <button onClick={() => props.onChange(props.point + 1)}>+</button>
        </div>
    )
}

interface PointsDetailProps {
    base: number
    source: AdditionalPoint[]
    fixed?: boolean
}

function PointsDetail({ base, source, fixed }: PointsDetailProps) {
    return (
        <ul className="points-detail">
            <li>
                <span>{fixed ? '固定' : '基础'}</span>
                <span className="font-mono">{base}</span>
            </li>
            {source.map(({ talent, points }) => (
                <li key={talent}>
                    <span>{talents.get(talent)?.name ?? talent}</span>
                    <span className="font-mono">{points}</span>
                </li>
            ))}
        </ul>
    )
}

export function Alloc() {
    const isClassic = useIsClassic()
    const picked = usePicked()
    const {
        talents: { chains },
        additionalPoints: { source },
    } = useReplaced()
    const { base, left } = useLeftPoints()
    const [{ alloc, final, base: ba }, allocator] = useAllocator()
    const random = usePointRandomizer()
    const start = useStart()
    const [showDetail, setShowDetail] = useState(false)
    const handleNext = () => {
        if (left != 0) {
            // TODO: Show a warning that there are still points left
            return
        }
        const achievements = start()
        // TODO: Show achievements
        console.log('Achievements', achievements)
    }
    return (
        <div className="screen point-allocation">
            <ul className="talent-list">
                {Array.from(picked, id => (
                    <li key={id}>
                        <Replaced id={id} chains={chains.get(id)} />
                    </li>
                ))}
            </ul>
            <ul className={`alloc ${isClassic ? 'classic' : 'modify'}`}>
                <li className={`left left-${left}`}>
                    <span className="name">剩余点数</span>
                    <button
                        className="font-mono"
                        onClick={() => setShowDetail(!showDetail)}
                    >
                        {left}
                    </button>
                    {showDetail && (
                        <PointsDetail
                            base={base}
                            source={source}
                            fixed={!isClassic}
                        />
                    )}
                </li>
                {keys(alloc).map(key => (
                    <li
                        key={key}
                        className={`property grade-${judgeGradeByValue(key, final[key])}`}
                    >
                        <span className="name">
                            {properties[key]}
                            {!isClassic && (
                                <span className="font-mono">[{ba[key]}]</span>
                            )}
                        </span>
                        {!isClassic && (
                            <span className="font-mono">{final[key]}</span>
                        )}
                        <AllocInput
                            point={alloc[key]}
                            onChange={value => allocator(key, value)}
                        />
                    </li>
                ))}
            </ul>
            <div className="controls">
                <button className="info" onClick={() => random()}>
                    随机分配
                </button>
                <button
                    className={left ? 'error' : 'primary'}
                    onClick={handleNext}
                >
                    开始新人生
                </button>
            </div>
        </div>
    )
}
export default Alloc
