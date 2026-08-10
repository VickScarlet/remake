import { useState } from 'react'
import { useAllocator, usePointRandomizer, useLeftPoints } from '@remake/hooks'
import { usePicked, useReplaced } from '@remake/hooks'
import type { AdditionalPoint } from '@remake/hooks'
import { properties } from '@/display'
import { keys } from '@remake/vitex'
import { BasePoints } from '@/config'
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
    source: AdditionalPoint[]
}

function PointsDetail({ source }: PointsDetailProps) {
    return (
        <ul className="points-detail">
            <li>
                <span>基础</span>
                <span className="font-mono">{BasePoints}</span>
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
    const picked = usePicked()
    const {
        talents: { chains },
        additionalPoints: { source },
    } = useReplaced()
    const left = useLeftPoints()
    const [allocation, allocator] = useAllocator()
    const random = usePointRandomizer()
    const [showDetail, setShowDetail] = useState(false)
    const handleNext = () => {
        // navigate('/life')
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
            <ul className="alloc">
                <li className="left">
                    <span>剩余点数</span>
                    <button
                        className="primary font-mono"
                        onClick={() => setShowDetail(!showDetail)}
                    >
                        {left}
                    </button>
                    {showDetail && <PointsDetail source={source} />}
                </li>
                {keys(allocation).map(key => (
                    <li key={key}>
                        <span>{properties[key]}</span>
                        <AllocInput
                            point={allocation[key]}
                            onChange={value => allocator(key, value)}
                        />
                    </li>
                ))}
            </ul>
            <div>
                <button className="info" onClick={() => random()}>
                    随机分配
                </button>
                <button className="primary" onClick={() => {}}>
                    开始新人生
                </button>
            </div>
        </div>
    )
}
export default Alloc
