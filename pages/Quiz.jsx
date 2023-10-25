import React from "react";
import { Link } from "react-router-dom";
import { getClassName } from "../utils"
import useFetchData from "../hooks/useFetchData"

export default function Quiz() {
    const [checkAns, setCheckAns] = React.useState(false)

    const {quizData, updateAnswer, counter, status} = useFetchData()

    function getQuestionElements(quizData, updateAnswer) {
        if(!quizData)
            return []
        return quizData.map((obj) => (
            <div>
            <h3 className="question">{obj.question}</h3>
            <div className="answers">
                {obj.options.map((option) => (
                <span
                    className={getClassName(
                    !checkAns,
                    obj.correctAnswerId,
                    obj.selectedAnswerId,
                    option.id
                    )}
                    onClick={() => updateAnswer(obj.id, option.id)}
                >
                    {option.value}
                </span>
                ))}
            </div>
            <hr />
            </div>
        ));
    }

    const questionsElements = getQuestionElements(quizData, updateAnswer)

    function handleClick() {
        const isReady = quizData.every((answer) => answer.selectedAnswerId)
        if(!isReady)
            document.getElementById('ans-ques').style.display = "block" 
        setCheckAns(isReady)
    }

    return(
        (status !== 'resolved') ? (<h1>Loading....</h1>) 
        :(
            <div>
                {questionsElements}
                {checkAns ?
                    <div className="score">
                        <p>You scored {counter}/5 correct answers</p>
                        <Link to="/" className="ply-agn-btn">Play again</Link>
                    </div>
                    :
                    <div>
                        <p id="ans-ques" >Please answer all the questions!</p>
                        <button onClick={handleClick} className="check-ans" to="/quiz">Check Answer</button>
                    </div>
                }  
            </div>
        )
    )
}