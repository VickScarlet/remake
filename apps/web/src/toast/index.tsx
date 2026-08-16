export * from './Msg'
export * from './Achv'
import ToastAchvContainer from './Achv'
import ToastMsgContainer from './Msg'

export const ToastContainer = () => (
    <>
        <ToastAchvContainer />
        <ToastMsgContainer />
    </>
)

export default ToastContainer
