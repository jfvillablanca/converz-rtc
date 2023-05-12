function SignIn() {
    const roomNames = ["JavaScript", "Python", "PHP", "C#", "Ruby", "Java"];
    return (
        <>
            <div className='join-container'>
                <header className='join-header'>
                    <h1>Ass</h1>
                </header>
                <main className='join-main'>
                    <form>
                        <div className='form-control'>
                            <label htmlFor='username'>Username</label>
                            <input
                                type='text'
                                name='username'
                                id='username'
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
