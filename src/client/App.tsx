import { Outlet, useOutletContext } from "react-router-dom";
import "./App.css";
import { Dispatch, SetStateAction, useState } from "react";

type User = string;

function App() {
    const [currentUser, setCurrentUser] = useState<User>("");

    return (
        <div className='App'>
            <Outlet context={[currentUser, setCurrentUser]} />
        </div>
    );
}

type ContextType = [
    currentUser: User,
    setCurrentUser: Dispatch<SetStateAction<User>>
];

export function useCurrentUser() {
    return useOutletContext<ContextType>();
}

export default App;
