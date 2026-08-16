import { useToaster, toast } from 'react-hot-toast/headless'
import Achievement from '@/components/Achievement'
import './Achv.css'

export function ToastAchvContainer() {
    const { toasts, handlers } = useToaster({ duration: 4000 }, 'achv-toast')
    const { startPause, endPause, calculateOffset, updateHeight } = handlers
    return (
        <div
            className="achv-toast-container"
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map(toast => {
                const offset = calculateOffset(toast, {
                    reverseOrder: true,
                    gutter: 8,
                })
                return (
                    <div
                        className={`toast-item ${toast.visible ? 'visible' : 'hidden'}`}
                        key={toast.id}
                        ref={el => {
                            if (el && typeof toast.height !== 'number') {
                                const height = el.getBoundingClientRect().height
                                updateHeight(toast.id, height)
                            }
                        }}
                        style={{
                            top: `${offset}px`,
                        }}
                    >
                        {typeof toast.message == 'function'
                            ? toast.message(toast)
                            : toast.message}
                    </div>
                )
            })}
        </div>
    )
}
export default ToastAchvContainer

export function toastAchvs(achievements: number[]) {
    if (achievements.length === 0) return
    for (const id of achievements) {
        toast(<Achievement id={id} />, { id: '' + id, toasterId: 'achv-toast' })
    }
}
