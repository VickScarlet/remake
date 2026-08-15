import { useAchv, useGoHome } from '@remake/hooks'
import { judge, judgeGrade, judgeGradeByValue } from '@/config'
import { rates } from '@/display'
import { achievements, type Achievement } from '@remake/data'
import './Achv.css'

interface AchievementProps {
    id: Achievement['id']
    colled: boolean
}
export function AchievementItem({ id, colled }: AchievementProps) {
    const { name, grade, description, hide } = achievements.get(id)!
    return (
        <li className={`achievement grade-${grade} ${colled ? 'colled' : ''}`}>
            <span className="name">{hide && !colled ? '???' : name}</span>
            <span className="description">
                {hide && !colled ? '???' : description}
            </span>
        </li>
    )
}

export function Achv() {
    const goHome = useGoHome()
    const [stats, sorted] = useAchv()
    const jtimes = judge('times', stats.times)
    const gtimes = judgeGrade('times', jtimes)
    const jachv = judge('achievements', stats.achv)
    const gachv = judgeGrade('achievements', jachv)
    const gevent = judgeGradeByValue('event', stats.event)
    const revent = stats.event.toFixed(2) + '%'
    const gtalent = judgeGradeByValue('talent', stats.talent)
    const rtalent = stats.talent.toFixed(2) + '%'
    return (
        <div className="screen achv">
            <div className="controls">
                <button className="info">排行榜</button>
                <button className="primary" onClick={goHome}>
                    返回
                </button>
            </div>
            <div className="section stats">
                <div className="title">统计</div>
                <div className="details">
                    <div className={`grade-${gtimes}`}>
                        <span className="title">已重开{stats.times}次</span>
                        <span className="value">{rates.times[jtimes]}</span>
                    </div>
                    <div className={`grade-${gachv}`}>
                        <span className="title">已收集成就{stats.achv}个</span>
                        <span className="value">
                            {rates.achievement[jachv]}
                        </span>
                    </div>
                    <div
                        className={`prg grade-${gevent}`}
                        style={{ '--progress': revent } as React.CSSProperties}
                    >
                        <span className="title">事件收集率</span>
                        <span className="value">{revent}</span>
                    </div>
                    <div
                        className={`prg grade-${gtalent}`}
                        style={{ '--progress': rtalent } as React.CSSProperties}
                    >
                        <span className="title">天赋收集率</span>
                        <span className="value">{rtalent}</span>
                    </div>
                </div>
            </div>
            <div className="section achievement-list hide-scrollbar">
                <div className="title">成就</div>
                <ul className="details hide-scrollbar">
                    {sorted.map(({ id, colled }) => (
                        <AchievementItem key={id} id={id} colled={colled} />
                    ))}
                </ul>
            </div>
        </div>
    )
}
export default Achv
