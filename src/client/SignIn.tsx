import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

function SignIn() {
    const roomNames = ["JavaScript", "Python", "PHP", "C#", "Ruby", "Java"];
    const [username, setUsername] = useState<string>("");
    const navigate = useNavigate();

    const socket = io();

    const handleUsernameInput = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setUsername(event.target.value);
    };

    const handleSubmit = () => {
        socket.emit("login", username);
        navigate("/chat");
    };

    return (
        <>
            <div className='join-container'>
                <header className='join-header'>
                    <h1>Ass</h1>
                </header>
                <main className='join-main'>
                    <form onSubmit={handleSubmit}>
                        <div className='form-control'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                name='username'
                                id='username'
                                value={username}
                                onChange={handleUsernameInput}
                                placeholder='Enter username...'
                                required
                            />
                        </div>
                        <div className='form-control'>
                            <label htmlFor='room'>Room</label>
                            <select name='room' id='room'>
                                {roomNames.map((room, index) => (
                                    <option key={index} value={room}>
                                        {room}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type='submit' className='btn'>
                            Join Chat
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}

export default SignIn;
