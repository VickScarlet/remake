import { type Talent, talents } from '@remake/data'
import TalentComponent from './Talent'
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
