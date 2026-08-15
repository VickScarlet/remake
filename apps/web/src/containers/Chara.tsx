import { useCharaPuller, useCharaPicker, useCharaSubmit } from '@remake/hooks'
import { useUnique, useUniqueGenerator, convertProps } from '@remake/hooks'
import type { BaseChara } from '@remake/hooks'
import { judgeGradeByValue } from '@/config'
import { characters } from '@remake/data'
import { properties } from '@/display'
import { keys } from '@remake/vitex'
import Talent from '@/components/Talent'
import './Chara.css'

function Details({ detail }: { detail: BaseChara }) {
    const props = convertProps(detail.property)
    return (
        <div className="chara-details">
            <ul className="properties">
                {keys(props).map(key => (
                    <li
                        key={key}
                        className={`property ${key} grade-${judgeGradeByValue(key, props[key])}`}
                    >
                        <span>{properties[key]}</span>
                        <span className="font-mono">{props[key]}</span>
                    </li>
                ))}
            </ul>
            <ul className="talent-list">
                {detail.talent.map(id => (
                    <li key={id}>
                        <Talent id={id} />
                    </li>
                ))}
            </ul>
        </div>
    )
}

interface UniqueProps {
    selected?: boolean
    picker?: () => void
}
function Unique({ selected, picker }: UniqueProps) {
    const [unique, generator] = useUniqueGenerator()
    return (
        <li
            className={`character ${selected ? 'selected' : ''}`}
            onClick={picker}
        >
            <span className="name">独一无二的我</span>
            {unique && <Details detail={unique} />}
            {!unique && (
                <div className="chara-details generator">
                    <ul>
                        <li>6000万玩家中独一无二的角色卡</li>
                        <li>所有属性 所有天赋 随机生成</li>
                        <li>每人只能生成一次</li>
                    </ul>
                    <button
                        className="primary focus"
                        onClick={() => generator()}
                    >
                        生成唯一角色
                    </button>
                </div>
            )}
        </li>
    )
}

interface CharacterProps {
    id: number
    selected?: boolean
    picker?: (id: number) => void
}
function Character({ id, selected, picker }: CharacterProps) {
    const character = characters.get(id)!
    return (
        <li
            className={`character ${selected ? 'selected' : ''}`}
            onClick={() => picker?.(id)}
        >
            <span className="name">{character.name}</span>
            <Details detail={character} />
        </li>
    )
}

export function Chara() {
    const u = useUnique()
    const [{ unique, characters }, puller] = useCharaPuller()
    const [picked, picker] = useCharaPicker()
    const submit = useCharaSubmit()
    const ready = picked && (picked.type === 'unique' ? !!u : true)
    return (
        <div className="screen chara">
            <ul className="chara-list">
                {unique && (
                    <Unique
                        selected={picked?.type === 'unique'}
                        picker={() => picker.unique()}
                    />
                )}
                {characters.map(id => (
                    <Character
                        key={id}
                        id={id}
                        selected={picked?.id === id}
                        picker={id => picker.chara(id)}
                    />
                ))}
            </ul>
            <div className="controls">
                <button className="secondary" onClick={puller}>
                    都不是
                </button>
                <button
                    className={ready ? 'primary' : 'error'}
                    onClick={ready ? () => submit(picked!) : undefined}
                >
                    开始新人生
                </button>
            </div>
        </div>
    )
}

export default Chara
