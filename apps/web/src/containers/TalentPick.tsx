// import { useEffect } from 'react'
import { useTalentPuller, useTalentPicker } from '@remake/hooks'
import { useTalentSubmit, useSubmitIsEnable } from '@remake/hooks'
import TalentComponent from '@/components/Talent'
import './TalentPick.css'

export default function TalentPick() {
    const [pulled, puller] = useTalentPuller()
    const [talents, picker] = useTalentPicker()
    const [enabled, limit] = useSubmitIsEnable()
    const submit = useTalentSubmit()
    // useEffect(puller, [])
    if (!pulled)
        return (
            <div className="screen talent-pick">
                <button className="primary" onClick={() => puller()}>
                    十连抽！
                </button>
            </div>
        )
    return (
        <div className="screen talent-pick">
            <ul className="talent-list">
                {pulled.map(id => (
                    <li key={id} onClick={() => picker(id)}>
                        <TalentComponent id={id} selected={talents.has(id)} />
                    </li>
                ))}
            </ul>
            {enabled ? (
                <button className="primary" onClick={() => submit()}>
                    下一步
                </button>
            ) : (
                <button className="error">请选取 {limit} 个天赋</button>
            )}
        </div>
    )
}
