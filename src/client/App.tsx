import { Outlet, useOutletContext } from "react-router-dom";
import "./App.css";
import { Dispatch, SetStateAction, useState } from "react";
import { UserAndRoomFormType } from "../utils/types";

function App() {
    const [userAndRoom, setUserAndRoom] = useState<UserAndRoomFormType>({
        username: "",
        room: "",
    });

    return (
        <div className='App'>
            <Outlet context={[userAndRoom, setUserAndRoom]} />
        </div>
    );
}

type ContextType = [
    userAndRoom: UserAndRoomFormType,
    setUserAndRoom: Dispatch<SetStateAction<UserAndRoomFormType>>
];

export function useUserAndRoom() {
    return useOutletContext<ContextType>();
}

export default App;
