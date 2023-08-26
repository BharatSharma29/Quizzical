import React from "react";
import {Link} from "react-router-dom"

export default function Home() {
    return(
        <div>
            <h1 className="header">Quizzical</h1>
            <h3 className="description">Some description if needed</h3>
            <Link className="start-btn" to="/">Start quiz</Link>
        </div>
    )
}