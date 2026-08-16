import { type Achievement as A, achievement } from '@remake/data'
import './Achievement.css'

export interface AchievementProps {
    id: A['id']
}
export function Achievement({ id }: AchievementProps) {
    const ach = achievement.get(id)
    if (!ach) return null
    const grade = ach?.grade ?? 0
    return (
        <div className={`achievement-item grade-${grade}`}>
            <span className="name">{ach.name}</span>
            <span className="description">{ach.description}</span>
        </div>
    )
}

export default Achievement
