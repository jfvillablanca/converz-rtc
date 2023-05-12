import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Chat from "./Chat";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
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
