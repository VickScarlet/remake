import type { Talent } from '@remake/data/talent'
import talents from '@remake/data/talent'
import cx from 'classnames'
import './Talent.css'

export interface TalentProps {
    id: Talent['id']
    selected: boolean
}
export function TalentComponent({ id, selected }: TalentProps) {
    const talent = talents.get(id)
    if (!talent) return null
    const grade = talent?.grade ?? 0
    return (
        <div className={cx('talent', `talent-grade-${grade}`, { selected })}>
            <span className="talent-name">{talent.name}</span>
            <span className="talent-description">{talent.description}</span>
        </div>
    )
}

export default TalentComponent
