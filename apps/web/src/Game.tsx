import { useEffect } from 'react'
import { useInit, useSaver } from '@/hooks/storage'
import { useStep, Step } from '@remake/hooks'
import Home from '@/containers/Home'
import Pick from '@/containers/TalentPick'
import Alloc from '@/containers/Alloc'
import Play from '@/containers/Play'
import Summary from '@/containers/Summary'
import { Loading } from './containers/Loading'
import './Game.css'

export function Game() {
    const [inited, init] = useInit()
    const saver = useSaver()
    const step = useStep()
    useEffect(() => {
        if (!inited) init()
    }, [inited])
    useEffect(() => {
        saver()
    }, [saver])
    if (!inited) return <Loading />
    switch (step) {
        case Step.Idle:
            return <Home />
        case Step.Mode:
        case Step.Pick:
            return <Pick />
        case Step.Alloc:
            return <Alloc />
        case Step.Play:
            return <Play />
        case Step.Summary:
            return <Summary />
        default:
            return null
    }
}
export default Game
