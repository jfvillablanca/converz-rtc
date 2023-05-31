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
    const isChatFromCurrentUser = msg.user === username;
    const chatSide = isChatFromCurrentUser ? "chat-end" : "chat-start";

    const diceBearArtStyle = [
        "pixel-art",
        "lorelei",
        "adventurer",
        "big-smile",
        "identicon",
    ];
    const generateAvatarURL = `https://api.dicebear.com/6.x/${diceBearArtStyle[1]}/svg?seed=${msg.user}&flip=${isChatFromCurrentUser}`;

    return (
        <div key={index} className={`chat ${chatSide} mb-2`}>
            <div className='chat-image row-start-1 avatar w-20 h-20 mr-2'>
                <div className='mask mask-hexagon'>
                    <img src={generateAvatarURL} />
                </div>
            </div>
            <p className='chat-bubble chat-bubble-info whitespace-pre-wrap text-xl'>
                {msg.messageBody}
            </p>
            <div className='chat-footer row-start-2 mb-2 font-bold text-md'>
                {msg.user}
                <time className='opacity-70 ml-3 text-xs'>{msg.time}</time>
            </div>
        </div>
    );
}

export function BotNotification({ msg }: { msg: FormattedMessageType }) {
    return <p className='divider'>{msg.messageBody}</p>;
}

export default ChatBubble;
