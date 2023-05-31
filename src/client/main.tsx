import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignIn from "./components/SignIn";
import Chat from "./components/Chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "/",
                element: <SignIn />,
            },
            {
                path: "/chat",
                element: <Chat />,
            },
        ],
    },
]);
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
