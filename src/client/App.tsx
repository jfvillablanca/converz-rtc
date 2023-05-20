import { Outlet, useOutletContext } from "react-router-dom";
import "./App.css";
import { Dispatch, SetStateAction, useState } from "react";
import { UserAndRoomFormType } from "../utils/types";

function App() {
    const roomNames = ["JavaScript", "Python", "PHP", "C#", "Ruby", "Java"];
    const [userAndRoom, setUserAndRoom] = useState<UserAndRoomFormType>({
        username: "",
        room: roomNames[0],
    });

    return (
        <div className='App'>
            <Outlet context={[userAndRoom, setUserAndRoom, roomNames]} />
        </div>
    );
}

type ContextType = [
    userAndRoom: UserAndRoomFormType,
    setUserAndRoom: Dispatch<SetStateAction<UserAndRoomFormType>>,
    roomNames: string[]
];

export function useAppContext() {
    return useOutletContext<ContextType>();
}

export default App;
