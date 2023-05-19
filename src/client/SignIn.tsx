import { useNavigate } from "react-router-dom";
import { useUserAndRoom } from "./App";

function SignIn() {
    const roomNames = ["JavaScript", "Python", "PHP", "C#", "Ruby", "Java"];
    const [userAndRoom, setUserAndRoom] = useUserAndRoom();
    const navigate = useNavigate();

    const handleInput = (
        event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
    ) => {
        setUserAndRoom((prevState) => ({
            ...prevState,
            [event.target.name]: event.target.value,
        }));
    };

    const handleSubmit = () => {
        navigate("/chat");
    };

    return (
        <>
            <div className='join-container my-20 mx-auto max-w-lg'>
                <header className='join-header rounded-t-lg p-2 text-center'>
                    <h1>Converz</h1>
                </header>
                <main className='join-main rounded-b-lg py-7 px-10'>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-5'>
                            <label htmlFor='username' className='block mb-1'>
                                Username
                            </label>
                            <input
                                type='text'
                                name='username'
                                id='username'
                                value={userAndRoom.username}
                                onChange={handleInput}
                                placeholder='Enter username...'
                                className='p-3 rounded-lg w-full'
                                required
                            />
                        </div>
                        <div className='form-control mb-5'>
                            <label htmlFor='room' className='block mb-1'>Room</label>
                            <select
                                name='room'
                                id='room'
                                className='p-3 rounded-lg w-full'
                                value={userAndRoom.room}
                                onChange={handleInput}
                            >
                                {roomNames.map((room, index) => (
                                    <option key={index} value={room}>
                                        {room}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type='submit'
                            className='btn rounded-lg p-2 text-2xl mt-5 w-full'
                        >
                            Join
                        </button>
                    </form>
                </main>
            </div>
        </>
    );
}

export default SignIn;
