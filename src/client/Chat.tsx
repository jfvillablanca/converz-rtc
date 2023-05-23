import { KeyboardEvent, useEffect, useRef, useState } from "react";

import {
    ChatMessageType,
    FormattedMessageType,
    UserAndRoomFormType,
} from "../utils/types";
import { useAppContext } from "./App";
import { socket } from "./socket";
import {
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_UPDATE_USER_LIST,
    EVENT_UPDATE_USER_LIST_FROM_SERVER,
} from "../utils/namespace";
import { useNavigate } from "react-router-dom";

function Chat() {
    const navigate = useNavigate();

    const [userList, setUserList] = useState<UserAndRoomFormType["username"][]>(
        []
    );
    const [userAndRoom, setUserAndRoom, roomNames] = useAppContext();

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

    const shouldRenderUsername = (index: number) => {
        const prevUserToChat = messageThread[index - 1]?.user;
        const nextUserToChat = messageThread[index]?.user;
        return prevUserToChat !== nextUserToChat;
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
            incomingMessage: FormattedMessageType
        ) => {
            setMessageThread((prevMessageThread) => [
                ...prevMessageThread,
                incomingMessage,
            ]);
        };

        const handleUserListUpdate = (
            updatedUserList: UserAndRoomFormType["username"][]
        ) => {
            setUserList(updatedUserList);
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
                <header className='bg-base-200 px-4 py-2 flex items-center justify-between text-5xl font-["Unica_One"]'>
                    <h1>Converz</h1>
                    <a
                        id='leave-btn'
                        className='btn rounded-lg py-2 px-4 text-xl cursor-pointer select-none'
                        onClick={handleLeaveRoom}
                    >
                        Leave
                    </a>
                </header>
                <main className='chat-main h-full grid grid-cols-4 overflow-hidden'>
                    <div className='bg-base-200 pt-5 px-5 col-span-1 overflow-y-scroll'>
                        <h3 className='mb-4'>
                            <i className='fas fa-comments mr-2'></i> Rooms
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
                        <h3 className='mb-4'>
                            <i className='fas fa-users mr-2'></i> Users
                        </h3>
                        <ul id='users'>
                            {userList.length === 0 ? (
                                <li>No one is here</li>
                            ) : (
                                userList.map((connectedUser, index) => {
                                    return (
                                        <li key={index} className='py-3 px-0'>
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
                            return (
                                <div key={index} className='mt-2'>
                                    {shouldRenderUsername(index) && (
                                        <div className='grid grid-cols-8 mb-2 h-10'>
                                            {/* user avatar placeholder */}
                                            <div className='avatar col-span-1 flex self-center justify-self-center w-8 h-8 object-cover'>
                                                <div className='mask mask-hexagon'>
                                                    <img src='https://api.dicebear.com/6.x/identicon/svg' />
                                                </div>
                                            </div>
                                            <p className='col-span-7 text-xl self-center font-bold'>
                                                {msg.user}
                                            </p>
                                        </div>
                                    )}
                                    <div className='rounded-2xl grid grid-cols-8 py-3 pr-3 break-words group hover:bg-base-300 text-base-content'>
                                        <p className='col-span-1 flex self-center justify-self-center opacity-70 text-xs invisible group-hover:visible'>
                                            {msg.time}
                                        </p>
                                        <p className='col-span-7 whitespace-pre-wrap'>
                                            {msg.messageBody}
                                        </p>
                                    </div>
                                </div>
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
                            <i className='fas fa-paper-plane'></i> Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;
