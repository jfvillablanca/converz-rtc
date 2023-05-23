import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { themeChange } from "theme-change";
import { ContextType, UserAndRoomFormType } from "../utils/types";
import "./App.css";

function App() {
    const roomNames = ["JavaScript", "Python", "PHP", "C#", "Ruby", "Java"];
    const [userAndRoom, setUserAndRoom] = useState<UserAndRoomFormType>({
        username: "",
        room: roomNames[0],
    });

    const lightTheme = "acid";
    const darkTheme = "coffee";
    const [theme, setTheme] = useState(darkTheme);
    const [isChecked, setIsChecked] = useState(true);

    const handleThemeToggle = () => {
        setIsChecked((prevState) => !prevState);
        setTheme((prevState) =>
            prevState === lightTheme ? darkTheme : lightTheme
        );
    };

    useEffect(() => {
        themeChange(false);
    }, []);

    return (
        <div className='h-screen font-["JetBrains_Mono"]' data-theme={theme}>
            <input
                type='checkbox'
                className='toggle'
                checked={isChecked}
                onChange={handleThemeToggle}
            />
            <Outlet context={[userAndRoom, setUserAndRoom, roomNames]} />
        </div>
    );
}

export function useAppContext() {
    return useOutletContext<ContextType>();
}

export default App;
