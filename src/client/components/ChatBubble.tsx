import { FormattedMessageType } from "../../utils/types";
import { useAppContext } from "../App";

function ChatBubble({
    index,
    msg,
}: {
    index: number;
    msg: FormattedMessageType;
}) {
    const [userAndRoom] = useAppContext();
    const { username } = userAndRoom;
    const chatSide = msg.user === username ? "chat-end" : "chat-start";
    return (
        <div key={index} className={`chat ${chatSide} mb-2`}>
            {/* user avatar placeholder */}
            <div className='chat-image avatar w-10 h-10 mr-2'>
                <div className='mask mask-hexagon'>
                    <img src='https://api.dicebear.com/6.x/identicon/svg' />
                </div>
            </div>
            <div className='chat-header mb-2 font-bold'>
                {msg.user}
                <time className='opacity-70 ml-3 text-xs'>{msg.time}</time>
            </div>
            <p className='chat-bubble chat-bubble-info whitespace-pre-wrap'>
                {msg.messageBody}
            </p>
        </div>
    );
}

export function BotNotification({ msg }: { msg: FormattedMessageType }) {
    return <p className='divider'>{msg.messageBody}</p>;
}

export default ChatBubble;
