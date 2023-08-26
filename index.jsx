import React from "react";
import { ReactDOM } from "react-dom/client";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home"

function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    )
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />)