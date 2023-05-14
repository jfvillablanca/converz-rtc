import { useEffect, useState } from "react";

import { io } from "socket.io-client";
import { FormattedMessage } from "../server/utils/messages";

function Chat() {
    const [messageThread, setMessageThread] = useState<string[]>([]);
    const [chatMessage, setChatMessage] = useState<string>("");
    const socket = io();

    const handleChatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(event.target.value);
    };

    const handleChatSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        socket.emit("clientEmitChatMessage", chatMessage.trim());
        setChatMessage("");
    };

    const handleIncomingMessage = (incomingMessage: FormattedMessage) => {
        setMessageThread((prevChatMessages) => [
            ...prevChatMessages,
            incomingMessage.messageText,
        ]);
    };

    useEffect(() => {
        socket.on("serverEmitChatMessage", handleIncomingMessage);
        return () => {
            socket.off("serverEmitChatMessage", handleIncomingMessage);
        };
    }, []);

    return (
        <>
            <div className='chat-container rounded-lg'>
                <header className='chat-header'>
                    <h1>Ass</h1>
                    <a
                        id='leave-btn'
                        className='btn rounded-lg py-2 px-4 text-xl'
                    >
                        Leave
                    </a>
                </header>
                <main className='chat-main'>
                    <div className='chat-sidebar'>
                        <h3>
                            <i className='fas fa-comments'></i> Room Name:
                        </h3>
                        <h2 id='room-name'></h2>
                        <h3>
                            <i className='fas fa-users'></i> Users
                        </h3>
                        <ul id='users'></ul>
                    </div>
                    <div className='chat-messages'>
                        {messageThread.map((text, index) => {
                            return (
                                <div key={index} className='message'>
                                    <p className='text'>{text}</p>
                                </div>
                            );
                        })}
                    </div>
                </main>
                <div className='chat-form-container'>
                    <form id='chat-form' onSubmit={handleChatSubmit}>
                        <input
                            type='text'
                            placeholder='Enter Message'
                            value={chatMessage}
                            onChange={handleChatInput}
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
