import './Message.css'

export interface MsgToastProps {
    message: React.ReactNode
}
export function MsgToast({ message }: MsgToastProps) {
    return <div className="message-item">{message}</div>
}

export default MsgToast
