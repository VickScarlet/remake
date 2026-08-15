import { type Talent as T, talents } from '@remake/data'
import Talent from './Talent'
import './Replaced.css'

export interface TalentProps {
    id: T['id']
    chains?: T['id'][]
}
export function Replaced({ id, chains }: TalentProps) {
    return (
        <ul className="replaced">
            <li>
                <Talent id={id} selected={true} />
            </li>
            {chains?.map(id => {
                const talent = talents.get(id)
                if (!talent) return null
                return (
                    <li key={id}>
                        <Talent id={id} selected={false} />
                    </li>
                )
            })}
        </ul>
    )
}

export default Replaced
