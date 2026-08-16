import { useTalentPuller, useTalentPicker } from '@remake/hooks'
import { useTalentSubmit, useSubmitIsEnable } from '@remake/hooks'
import { PullCount, dev } from '@/config'
import { toastMsg } from '@/toast'
import Talent from '@/components/Talent'
import './Pick.css'

export function Pick() {
    const [pulled, puller] = useTalentPuller()
    const [talents, picker] = useTalentPicker()
    const { enabled, min, max } = useSubmitIsEnable()
    const submit = useTalentSubmit()
    const msg = enabled
        ? '下一步'
        : `请选取 ${min == max ? min : `${min}~${max}`} 个天赋`
    const handleSubmit = () => {
        if (enabled) return submit()
        toastMsg(msg, 'pick-toast')
    }
    if (!pulled)
        return (
            <div className="screen talent-pick">
                <button
                    className="primary font-mono focus"
                    onClick={() => puller()}
                >
                    {PullCount} 连抽!
                </button>
            </div>
        )
    const ps = dev.locked
        ? Array.from(new Set([...dev.locked, ...pulled]))
        : pulled
    return (
        <div className="screen talent-pick">
            <ul className="talent-list">
                {ps.map(id => (
                    <li key={id} onClick={() => picker(id)}>
                        <Talent id={id} selected={talents.has(id)} />
                    </li>
                ))}
            </ul>
            <button
                className={enabled ? 'primary' : 'error'}
                onClick={handleSubmit}
            >
                {msg}
            </button>
        </div>
    )
}
export default Pick
