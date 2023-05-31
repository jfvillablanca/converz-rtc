import { useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { themeChange } from "theme-change";
import { ContextType, UserAndRoomFormType } from "../utils/types";
import "./App.css";

function App() {
    const roomNames = ["Balloon", "Pineapple", "Telescope", "Ball games", "Concept of Being", "Jazz"];
    const [userAndRoom, setUserAndRoom] = useState<UserAndRoomFormType>({
        username: "",
        room: roomNames[0],
    });

    const lightTheme = "acid";
    const darkTheme = "coffee";
    const [theme, setTheme] = useState(darkTheme);
    const [isThemeToggleChecked, setIsThemeToggleChecked] = useState(true);

    const handleThemeToggle = () => {
        setIsThemeToggleChecked((prevState) => !prevState);
        setTheme((prevState) =>
            prevState === lightTheme ? darkTheme : lightTheme
        );
    };

    useEffect(() => {
        themeChange(false);
    }, []);

    return (
        <div className='h-screen font-["JetBrains_Mono"]' data-theme={theme}>
            <Outlet
                context={[
                    userAndRoom,
                    setUserAndRoom,
                    roomNames,
                    isThemeToggleChecked,
                    handleThemeToggle,
                ]}
            />
        </div>
    );
}

export function useAppContext() {
    return useOutletContext<ContextType>();
}

export default App;
