import { useEffect, useRef, useState } from "react";

import {
    ChatMessageType,
    FormattedMessageType,
    UserType,
} from "../utils/types";
import { useCurrentUser } from "./App";
import { socket } from "./socket";
import {
    EVENT_CHAT,
    EVENT_CHAT_FROM_SERVER,
    EVENT_LOGIN,
    EVENT_LOGIN_FROM_SERVER,
} from "../utils/event-namespace";

function Chat() {
    const [userList, setUserList] = useState<UserType[]>([]);
    const [currentUser, _] = useCurrentUser();

    const [messageThread, setMessageThread] = useState<FormattedMessageType[]>(
        []
    );
    const [chatMessage, setChatMessage] = useState<ChatMessageType>({
        user: currentUser,
        messageBody: "",
    });

    const chatInputRef = useRef<HTMLInputElement>(null);

    const handleChatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage((prevChatMessage) => ({
            ...prevChatMessage,
            messageBody: event.target.value,
        }));
    };

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit(EVENT_CHAT, {
            ...chatMessage,
            messageBody: chatMessage.messageBody.trim(),
        });
        setChatMessage((prevChatMessage) => ({
            ...prevChatMessage,
            messageBody: "",
        }));

        // HACK: Place this inside a useEffect
        if (chatInputRef.current) {
            chatInputRef.current.focus();
        }
    };

    const shouldRenderUsername = (index: number) => {
        const prevUserToChat = messageThread[index - 1]?.user;
        const nextUserToChat = messageThread[index]?.user;
        return prevUserToChat !== nextUserToChat;
    };

    const handleIncomingMessage = (incomingMessage: FormattedMessageType) => {
        setMessageThread((prevMessageThread) => [
            ...prevMessageThread,
            ...[incomingMessage],
        ]);
    };

    const handleNewUserLogin = (updatedUserList: UserType[]) => {
        setUserList(updatedUserList);
    };

    useEffect(() => {
        socket.emit(EVENT_LOGIN, currentUser);
    }, []);

    useEffect(() => {
        socket.on(EVENT_CHAT_FROM_SERVER, handleIncomingMessage);
        socket.on(EVENT_LOGIN_FROM_SERVER, handleNewUserLogin);
        return () => {
            socket.off(EVENT_CHAT_FROM_SERVER, handleIncomingMessage);
            socket.off(EVENT_LOGIN_FROM_SERVER, handleNewUserLogin);
        };
    }, []);

    return (
        <>
            <div className='chat-container flex flex-col h-screen rounded-lg mx-auto max-w-6xl overflow-hidden'>
                <header className='chat-header p-4 flex items-center justify-between'>
                    <h1>Ass</h1>
                    <a
                        id='leave-btn'
                        className='btn rounded-lg py-2 px-4 text-xl'
                    >
                        Leave
                    </a>
                </header>
                <main className='chat-main h-full grid grid-cols-4 overflow-hidden'>
                    <div className='chat-sidebar pt-5 px-5 col-span-1 overflow-y-scroll'>
                        <h3 className='mb-4'>
                            <i className='fas fa-comments mr-2'></i> Room Name
                        </h3>
                        <h2 id='room-name' className='p-2 mb-5 text-xl'></h2>
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
                    <div className='chat-messages h-full p-7 pb-0 col-span-3 overflow-y-scroll'>
                        {messageThread.map((msg, index) => {
                            return (
                                <div key={index} className='mt-2'>
                                    {shouldRenderUsername(index) && (
                                        <div className='grid grid-cols-8 mb-2 h-10'>
                                            {/* user avatar placeholder */}
                                            <img
                                                className='col-span-1 rounded-full flex self-center justify-self-center w-8 h-8 object-cover'
                                                src='https://api.dicebear.com/6.x/identicon/svg'
                                            />
                                            <p className='col-span-7 text-xl self-center font-bold'>
                                                {msg.user}
                                            </p>
                                        </div>
                                    )}
                                    <div className='message rounded-2xl grid grid-cols-8 py-3 pr-3'>
                                        <p className='timestamp col-span-1 flex self-center justify-self-center opacity-70 text-xs'>
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
                <div className='chat-form-container py-5 px-8'>
                    <form
                        id='chat-form'
                        className='flex'
                        onSubmit={handleChatSubmit}
                    >
                        <input
                            type='text'
                            className='rounded-l-lg py-2 px-4 flex-1'
                            placeholder='Enter Message'
                            value={chatMessage.messageBody}
                            onChange={handleChatInput}
                            ref={chatInputRef}
                            required
                        />
                        <button className='btn rounded-r-lg py-2 px-4 text-xl'>
                            <i className='fas fa-paper-plane'></i> Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;
