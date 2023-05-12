import {
    useState,
} from "react";

function Chat() {
    const [chatMessage, setChatMessage] = useState<string>("");
    const handleChatInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setChatMessage(event.target.value);
    };

    return (
        <>
            <div className='chat-container'>
                <header className='chat-header'>
                    <h1>Ass</h1>
                    <a id='leave-btn' className='btn'>
                        Leave Room
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
                    <div className='chat-messages'></div>
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
                        <button className='btn'>
                            <i className='fas fa-paper-plane'></i> Send
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Chat;
