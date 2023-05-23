import { useNavigate } from "react-router-dom";
import { useAppContext } from "./App";
import { socket } from "./socket";

function SignIn() {
    const [userAndRoom, setUserAndRoom, roomNames] = useAppContext();
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
        socket.connect();
        navigate("/chat");
    };

    return (
        <>
            <div className='text-base-content my-20 mx-auto max-w-lg'>
                <header className='font-["Unica_One"] bg-neutral-focus text-neutral-content rounded-t-lg p-2 text-center text-4xl'>
                    <h1>Converz</h1>
                </header>
                <main className='bg-neutral rounded-b-lg py-7 px-10'>
                    <form onSubmit={handleSubmit}>
                        <div className='mb-5'>
                            <label htmlFor='username' className='text-neutral-content block mb-1'>
                                Username
                            </label>
                            <input
                                type='text'
                                name='username'
                                id='username'
                                value={userAndRoom.username}
                                onChange={handleInput}
                                placeholder='Enter username...'
                                className='input input-bordered focus:outline-none focus:shadow-[inset_0_0_0_3px_hsl(var(--pf))] p-3 rounded-lg w-full'
                                required
                            />
                        </div>
                        <div className='mb-5'>
                            <label htmlFor='room' className='text-neutral-content block mb-1'>
                                Room
                            </label>
                            <select
                                name='room'
                                id='room'
                                className='select select-bordered focus:outline-none focus:shadow-[inset_0_0_0_3px_hsl(var(--pf))] p-3 rounded-lg w-full'
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
                            className='btn btn-info rounded-full p-2 text-2xl mt-5 w-full'
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
