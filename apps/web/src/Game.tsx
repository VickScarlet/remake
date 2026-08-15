import { useEffect } from 'react'
import { useInit, useWatcher } from '@/hooks/storage'
import { useStep, Step } from '@remake/hooks'
import Home from '@/containers/Home'
import Mode from '@/containers/Mode'
import Chara from '@/containers/Chara'
import Pick from '@/containers/TalentPick'
import Alloc from '@/containers/Alloc'
import Play from '@/containers/Play'
import Summary from '@/containers/Summary'
import Achv from '@/containers/Achv'
import './Game.css'

export function Container() {
    /* prettier-ignore */
    switch (useStep()) {
        case Step.Idle: return <Home />
        case Step.Mode: return <Mode />
        case Step.Chara: return <Chara />
        case Step.Pick: return <Pick />
        case Step.Alloc: return <Alloc />
        case Step.Play: return <Play />
        case Step.Summary: return <Summary />
        case Step.Achv: return <Achv />
        default: return null
    }
}

/* prettier-ignore */
const Loading = () => <div className="screen loading"><h2>载入中...</h2></div>
const Saving = ({ active }: { active: boolean }) => (
    <div className={`saving ${active ? 'active' : ''}`}>保存中...</div>
)

/* prettier-ignore */
export function Game() {
    const [inited, init] = useInit()
    const saving = useWatcher()
    useEffect(() => { if (!inited) init() }, [inited, init])
    if (!inited) return <Loading />
    return <><Container /><Saving active={saving} /></>
}
export default Game
