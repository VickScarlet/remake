import { useRemake } from '@remake/hooks'
import { ThemeToggle } from '@/components/ThemeToggle'
import './Home.css'

export default function Home() {
    const remake = useRemake()
    return (
        <div className="screen home">
            <div className="title">
                <h1>人生重开模拟器</h1>
                <h2>这垃圾人生一秒也不想待了</h2>
            </div>
            <button className="primary" onClick={remake}>
                立即重开
            </button>
            <ThemeToggle />
        </div>
    )
}
