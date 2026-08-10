import type { Talent } from '@remake/data/talent'
import TalentComponent from './Talent'
import talents from '@remake/data/talent'
import './Replaced.css'

export interface TalentProps {
    id: Talent['id']
    chains?: Talent['id'][]
}
export function Replaced({ id, chains }: TalentProps) {
    return (
        <ul className="replaced">
            <li>
                <TalentComponent id={id} selected={true} />
            </li>
            {chains?.map(id => {
                const talent = talents.get(id)
                if (!talent) return null
                return (
                    <li key={id}>
                        <TalentComponent id={id} selected={false} />
                    </li>
                )
            })}
        </ul>
    )
}

export default Replaced
