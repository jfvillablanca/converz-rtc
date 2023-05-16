import { useEffect, useRef, useState } from "react";

import { io } from "socket.io-client";
import { FormattedMessage } from "../server/utils/messages";
import { useCurrentUser } from "./App";

function Chat() {
    const [messageThread, setMessageThread] = useState<string[]>([]);
    const [currentUser, _] = useCurrentUser();
    const [chatMessage, setChatMessage] = useState<string>("");
    const chatInputRef = useRef<HTMLInputElement>(null);
    const socket = io();

    const handleChatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(event.target.value);
    };

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit("clientEmitChatMessage", chatMessage.trim());
        setChatMessage("");
        if (chatInputRef.current) {
            chatInputRef.current.focus();
        }
    };

    const handleIncomingMessage = (incomingMessage: FormattedMessage) => {
        setMessageThread((prevChatMessages) => [
            ...prevChatMessages,
            incomingMessage.messageText,
        ]);
    };

    useEffect(() => {
        socket.emit("login", currentUser);
        socket.on("serverEmitChatMessage", handleIncomingMessage);
        return () => {
            socket.off("serverEmitChatMessage", handleIncomingMessage);
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
                            {/* These are placeholder values. Use tailwind classes on <li> creation */}
                            <li className='py-3 px-0'>Bob</li>
                            <li className='py-3 px-0'>Mary</li>
                        </ul>
                    </div>
                    <div className='chat-messages h-full px-7 col-span-3 overflow-y-scroll'>
                        {messageThread.map((text, index) => {
                            return (
                                <div key={index} className='py-3'>
                                    {/* user details placeholder */}
                                    <div className='grid grid-cols-8 mb-3 h-10'>
                                        <img
                                            className='col-span-1 rounded-full flex self-center justify-self-center w-8 h-8 object-cover'
                                            src='https://api.dicebear.com/6.x/identicon/svg'
                                        />
                                        <p className='col-span-7 text-xl self-center font-bold'>
                                            {currentUser}
                                        </p>
                                    </div>
                                    <div className='message rounded-2xl grid grid-cols-8 py-4 mb-2'>
                                        {/* timestamp placeholder */}
                                        <p className='timestamp col-span-1 flex self-center justify-self-center opacity-70 text-xs'>
                                            10:23 PM
                                        </p>
                                        <p className='col-span-7'>{text}</p>
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
                            value={chatMessage}
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
