import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    BOT_NAME,
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_UPDATE_USER_LIST,
    EVENT_UPDATE_USER_LIST_FROM_SERVER,
} from "../utils/namespace";
import {
    ChatMessageType,
    FormattedMessageType,
    UserAndRoomFormType,
} from "../utils/types";
import { useAppContext } from "./App";
import { socket } from "./socket";

function Chat() {
    const navigate = useNavigate();

    const [userList, setUserList] = useState<UserAndRoomFormType["username"][]>(
        []
    );
    const [
        userAndRoom,
        setUserAndRoom,
        roomNames,
        isThemeToggleChecked,
        handleThemeToggle,
    ] = useAppContext();

    const [messageThread, setMessageThread] = useState<FormattedMessageType[]>(
        []
    );
    const [chatMessage, setChatMessage] = useState<ChatMessageType>({
        user: userAndRoom.username,
        room: userAndRoom.room,
        messageBody: "",
    });

    const chatInputRef = useRef<HTMLTextAreaElement>(null);
    const chatThreadDivRef = useRef<HTMLDivElement>(null);

    const handleChatSubmit = () => {
        socket.emit(EVENT_CHAT, {
            ...chatMessage,
            messageBody: chatMessage.messageBody.trim(),
        });
        setChatMessage((prevChatMessage) => ({
            ...prevChatMessage,
            messageBody: "",
        }));

        if (chatInputRef.current) {
            chatInputRef.current.focus();
        }
    };

    const handleChatInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChatMessage((prevChatMessage) => ({
            ...prevChatMessage,
            messageBody: event.target.value,
        }));
    };

    const onShiftEnterKeydown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleChatSubmit();
        } else if (event.key === "Enter" && event.shiftKey) {
            event.preventDefault();
            setChatMessage((prevChatMessage) => ({
                ...prevChatMessage,
                messageBody: `${prevChatMessage.messageBody}\n`,
            }));
        }
    };

    const handleLeaveRoom = () => {
        socket.disconnect();
        navigate("/");
    };

    const handleConnectToRoom = (room: UserAndRoomFormType["room"]) => {
        setUserAndRoom((prevUserAndRoom) => ({
            ...prevUserAndRoom,
            room: room,
        }));
    };

    useEffect(() => {
        if (chatInputRef.current) {
            // HACK:
            // Currently hardcoded min and max height values.
            // Min height could be inferred based on target style from first render
            const minChatInputHeight = 45;
            const maxChatInputHeight = minChatInputHeight * 2;

            const target = chatInputRef.current;

            if (target.style.height !== minChatInputHeight + "px") {
                target.style.height = minChatInputHeight + "px";
            }

            const height =
                target.scrollHeight <= maxChatInputHeight
                    ? target.scrollHeight + "px"
                    : maxChatInputHeight + "px";

            if (target.style.height !== height) {
                target.style.height = height;
            }

            setTimeout(() => {
                if (chatInputRef.current) {
                    chatInputRef.current.scrollTop =
                        chatInputRef.current.scrollHeight;
                }
            }, 0);
        }
    }, [chatMessage]);

    useEffect(() => {
        if (chatThreadDivRef.current) {
            setTimeout(() => {
                if (chatThreadDivRef.current) {
                    chatThreadDivRef.current.scrollTop =
                        chatThreadDivRef.current.scrollHeight;
                }
            }, 0);
        }
    }, [messageThread]);

    useEffect(() => {
        socket.emit(EVENT_UPDATE_USER_LIST, userAndRoom);
    }, [userAndRoom]);

    useEffect(() => {
        const handleIncomingMessage = (
            updatedMessageThread: FormattedMessageType[]
        ) => {
            setMessageThread(() => updatedMessageThread);
        };

        const handleUserListUpdate = (
            updatedUserList: UserAndRoomFormType["username"][]
        ) => {
            setUserList(() => updatedUserList);
        };

        socket.on(EVENT_CHAT_FROM_SERVER, handleIncomingMessage);
        socket.on(EVENT_UPDATE_USER_LIST_FROM_SERVER, handleUserListUpdate);
        return () => {
            socket.off(EVENT_CHAT_FROM_SERVER, handleIncomingMessage);
            socket.off(
                EVENT_UPDATE_USER_LIST_FROM_SERVER,
                handleUserListUpdate
            );
        };
    }, []);

    return (
        <>
            <div className='text-base-content flex flex-col h-screen mx-auto max-w-6xl overflow-hidden'>
                <header className='bg-base-200 px-4 py-2 flex items-center justify-between'>
                    <a
                        className='btn btn-ghost rounded-lg'
                        onClick={handleLeaveRoom}
                    >
                        <i className='fas fa-sign-out-alt -rotate-180 text-xl'></i>
                    </a>
                    <h1 className='flex items-center justify-between text-5xl font-["Unica_One"]'>
                        Converz
                    </h1>
                    <input
                        type='checkbox'
                        className='toggle'
                        checked={isThemeToggleChecked}
                        onChange={handleThemeToggle}
                    />
                </header>
                <main className='chat-main h-full grid grid-cols-4 overflow-hidden'>
                    <div className='bg-base-200 pt-5 px-5 col-span-1 overflow-y-scroll'>
                        <h3 className='text-secondary-content mb-4 font-extrabold underline underline-offset-4'>
                            Rooms
                        </h3>
                        <ul className='mb-4 border-b-2'>
                            {roomNames.map((room, index) => {
                                const highlight =
                                    userAndRoom.room === room
                                        ? "bg-neutral-focus text-neutral-content"
                                        : "";
                                return (
                                    <li key={index}>
                                        <h2
                                            className={`rounded-lg p-3 mb-1 cursor-pointer ${highlight}`}
                                            onClick={() =>
                                                handleConnectToRoom(room)
                                            }
                                        >
                                            {room}
                                        </h2>
                                    </li>
                                );
                            })}
                        </ul>
                        <h3 className='text-secondary-content mb-4 font-extrabold underline underline-offset-4'>
                            Users
                        </h3>
                        <ul id='users'>
                            {userList.length === 0 ? (
                                <li>No one is here</li>
                            ) : (
                                userList.map((connectedUser, index) => {
                                    return (
                                        <li key={index} className='p-3'>
                                            {connectedUser}
                                        </li>
                                    );
                                })
                            )}
                        </ul>
                    </div>
                    <div
                        className='bg-base-100 h-full p-7 pb-0 col-span-3 overflow-y-scroll'
                        ref={chatThreadDivRef}
                    >
                        {messageThread.map((msg, index) => {
                            return msg.user !== BOT_NAME ? (
                                <ChatBubble index={index} msg={msg} />
                            ) : (
                                <BotNotification msg={msg} />
                            );
                        })}
                    </div>
                </main>
                <div className='bg-base-200 py-5 px-8'>
                    <form
                        id='chat-form'
                        className='flex'
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleChatSubmit();
                        }}
                    >
                        <textarea
                            className='textarea rounded-r-none rounded-l-lg py-2 px-4 flex-1 resize-none focus:outline-none focus:shadow-[inset_0_0_0_3px_hsl(var(--pf))]'
                            placeholder='Enter Message'
                            value={chatMessage.messageBody}
                            onChange={handleChatInput}
                            onKeyDown={onShiftEnterKeydown}
                            ref={chatInputRef}
                            rows={1}
                            required
                        ></textarea>
                        <button className='btn h-auto pointer-events-auto rounded-l-none rounded-r-lg py-2 px-4 text-xl font-["Unica_One"]'>
                            <i className='fas fa-paper-plane mr-3'></i> Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

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

function BotNotification({ msg }: { msg: FormattedMessageType }) {
    return <p className='divider'>{msg.messageBody}</p>;
}

export default Chat;
