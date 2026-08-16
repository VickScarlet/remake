import { useToaster, toast } from 'react-hot-toast/headless'
import Message from '@/components/Message'
import './Msg.css'

export function ToastMsgContainer() {
    const { toasts, handlers } = useToaster({ duration: 1500 }, 'msg-toast')
    const { startPause, endPause, calculateOffset, updateHeight } = handlers
    return (
        <div
            className="msg-toast-container"
            onMouseEnter={startPause}
            onMouseLeave={endPause}
        >
            {toasts.map(toast => {
                const offset = calculateOffset(toast, {
                    reverseOrder: true,
                    gutter: 8,
                })
                console.log('toast offset', toast.id, offset)
                return (
                    <div
                        className={`toast-item ${toast.visible ? 'visible' : 'hidden'}`}
                        key={toast.id}
                        ref={el => {
                            if (el && typeof toast.height !== 'number') {
                                const height = el.getBoundingClientRect().height
                                console.log('toast height', toast.id, height)
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
export default ToastMsgContainer

export function toastMsg(message: string, key: string) {
    toast(<Message message={message} />, { id: key, toasterId: 'msg-toast' })
}
