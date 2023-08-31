import React from "react";
import {Link} from "react-router-dom"

export default function Home() {
    return(
        <>
            <h1 className="header">Quizzical</h1>
            <h3 className="description">Let the Quizz began!!!</h3>
            <Link className="start-btn" to="/quiz">Start quiz</Link>
        </>
    )
}