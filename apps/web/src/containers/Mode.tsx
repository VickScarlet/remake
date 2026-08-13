import { PullCount } from '@/config'
import { useModeChoose } from '@remake/hooks'
import './Mode.css'

export function Mode() {
    const [Mode, choose] = useModeChoose()
    return (
        <div className="screen mode">
            <button onClick={() => choose(Mode.Classic)}>
                <div className="name">经典模式</div>
                <div className="description">
                    <span>{PullCount} 连抽天赋</span>
                    <span>自由分配属性</span>
                </div>
            </button>
            <button onClick={() => choose(Mode.Celebrity)}>
                <div className="name">名人模式</div>
                <div className="description">
                    <span>前世古代名人，重开到了现代</span>
                </div>
            </button>
        </div>
    )
}

export default Mode
