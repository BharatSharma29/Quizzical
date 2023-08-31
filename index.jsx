import React from "react";
import {createRoot} from "react-dom/client";
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
import Home from "./pages/Home"
import Quiz from "./pages/Quiz";

const router = createBrowserRouter(createRoutesFromElements(
    <Route>    
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<Quiz />} />
    </Route>
))

function App() {
    return(
        <RouterProvider router={router} />
    )
}

createRoot(document.getElementById('root')).render(<App />)