import { useRemake, useGoAchv } from '@remake/hooks'
import { TextSvg } from '@/components/TextSvg'
import { ThemeToggle } from '@/components/ThemeToggle'
import './Home.css'

export default function Home() {
    const remake = useRemake()
    const goAchv = useGoAchv()
    return (
        <div className="screen home">
            <div className="title">
                <TextSvg text="人生重开模拟器" className="main" />
                <TextSvg text="这垃圾人生一秒也不想待了" className="sub" />
            </div>
            <div className="controls">
                <div>
                    <button className="primary focus" onClick={remake}>
                        立即重开
                    </button>
                </div>
                <div>
                    <button className="info" onClick={goAchv}>
                        成就
                    </button>
                    <button className="info" onClick={goAchv}>
                        感谢
                    </button>
                </div>
            </div>
            <ThemeToggle />
        </div>
    )
}
