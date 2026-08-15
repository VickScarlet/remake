import { useGoHome } from '@remake/hooks'
import { specialThanks, SpecialThanksGroup as Group } from '@remake/data'
import type { SpecialThanks } from '@remake/data'
import { shuffle } from '@remake/vitex'
import './Thanks.css'

const groups = Map.groupBy(specialThanks, item => item.group)

export function Person({ item }: { item: SpecialThanks }) {
    return (
        <li
            className="person"
            style={
                {
                    '--custom-color': item.color,
                } as React.CSSProperties
            }
        >
            <span className="name">{item.name}</span>
            {item.comment && <span className="comment">{item.comment}</span>}
        </li>
    )
}

export function Thanks() {
    const goHome = useGoHome()
    const group1 = shuffle(groups.get(Group.G1) ?? [])
    const group2 = shuffle(groups.get(Group.G2) ?? [])
    return (
        <div className="screen thanks">
            <button className="primary" onClick={goHome}>
                返回
            </button>
            <ul className="group group-1 hide-scrollbar">
                {group1.map((item, index) => (
                    <Person key={index} item={item} />
                ))}
            </ul>
            <ul className="group group-2 hide-scrollbar">
                {group2.map((item, index) => (
                    <Person key={index} item={item} />
                ))}
            </ul>
        </div>
    )
}
export default Thanks
