import { type Talent as T, talents } from '@remake/data'
import './Talent.css'

export interface TalentProps {
    id: T['id']
    selected?: boolean
}
export function Talent({ id, selected }: TalentProps) {
    const talent = talents.get(id)
    if (!talent) return null
    const grade = talent?.grade ?? 0
    return (
        <div className={`talent grade-${grade} ${selected ? 'selected' : ''}`}>
            <span className="talent-name">{talent.name}</span>
            <span className="talent-description">{talent.description}</span>
        </div>
    )
}

export default Talent
