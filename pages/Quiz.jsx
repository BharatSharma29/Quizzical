import React from "react";
import { Link } from "react-router-dom";
import { decode } from "html-entities";
import { nanoid } from "nanoid";

// Enum container
const RequestStatus = {
    Idle: 'idle',
    Pending: 'pending',
    Resolved: 'resolved',
    Rejected: 'rejected',
}

export default function Quiz() {
    //state variables
    const [data, setData] = React.useState([])
    const [checkAns, setCheckAns] = React.useState(false)
    const [status, setStatus] = React.useState(RequestStatus.Idle)

    // TODO: Make this a function that takes in the array reference and returns the calculated data
    const counter = data.reduce((accumulator, item, index, arrayRef) => {
        if (item.selectedAnswerId !== item.correctAnswerId) return accumulator;
        return accumulator + 1;
    }, 0)

    React.useEffect(() => {
        setStatus(RequestStatus.Pending)

        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(resData => {
                let tempArr = resData.results.map(data => {
                    // TODO: Make a function that takes in a value and creates this object.
                    // (a function which generates an object for as is called a `factory`)
                    // Where else this `factory` function can be used?
                    const correctAnswer = {
                        id: nanoid(),
                        value: decode(data.correct_answer),
                    }

                    const options = data.incorrect_answers.map(value => ({
                        id: nanoid(),
                        // TODO: (This is my bad, value should also be `decoded`)
                        value,
                    }))

                    options.push(correctAnswer)
                    options.sort(() => Math.random() > 0.5)

                    return {
                        id: nanoid(),
                        question: decode(data.question),
                        options,
                        correctAnswerId: correctAnswer.id,
                        selectedAnswerId: null,
                    }
                })

                setData(tempArr)
                setStatus(RequestStatus.Resolved)
                console.log("UseEffect")
            })
            .catch(error => {
                console.log(error)
                setStatus(RequestStatus.Rejected)
            })
    }, [])

    function optionClick(questionId, answerId) {
        setData(prev => {
            return prev.map((question) => {
                if (question.id !== questionId) return question

                return {
                    ...question,
                    selectedAnswerId: answerId,
                }
            })
        })
    }

    // TODO: Extract this function outside the component or into a utils file
    function getCorrectnessClass(gameIsRunning, answerIsCorrect, answerIsSelected) {
        if (gameIsRunning) return null
        if (answerIsCorrect) return 'answer--correct'
        if(answerIsSelected) return 'answer--incorrect'
        return null
    }

    // TODO: Extract this function outside the component or into a utils file
    function getClassName(
        gameIsRunning,
        correctAnswerId,
        selectedAnswerId,
        answerId,
    ) {
        console.log(" gameIsRunning = " + gameIsRunning)

        const answerIsSelected = selectedAnswerId === answerId
        // Hmmm. I think this should stay as `answerId === correctAnswerId` :thinking-emoji
        // Would you be able to share the bug that was caused by the initial implementation?
        const answerIsCorrect = answerId === correctAnswerId || (selectedAnswerId === correctAnswerId && answerIsSelected)

        const selectedClass = answerIsSelected ? 'answer--selected' : null
        const correctnessClass = getCorrectnessClass(gameIsRunning, answerIsCorrect, answerIsSelected)

        const classes = ['answer', selectedClass, correctnessClass]

        let className = classes.filter(Boolean).join(" ")
        console.log(className)
        return className

    }

    const questionsElements = data.map( obj =>
        <>
            <h3 className="question">{obj.question}</h3>
            <div className="answers">
                
            {obj.options.map(option => (
                <span 
                className={getClassName(!checkAns, obj.correctAnswerId, obj.selectedAnswerId, option.id)}
                onClick={() => optionClick(obj.id, option.id)} 
                >
                    {option.value}
                </span>
            ))}
            </div>
            <hr />
        </>
    )

    function handleClick() {
        const isReady = data.every((answer) => answer.selectedAnswerId)
        // This is fine, but try to avoid vanilla js approach in React
        if(!isReady)
            document.getElementById('ans-ques').style.display = "block" 
        setCheckAns(isReady)
    }

    return(
        // TODO: Try to use conditional rendering instead of ternary
        // It will make your code easier to read and maintain
        (status !== 'resolved') ? (<h1>Loading....</h1>) 
        :(
            <>
                {questionsElements}
                {checkAns ?
                    <div className="score">
                        <p>You scored {counter}/5 correct answers</p>
                        <Link to="/" className="ply-agn-btn">Play again</Link>
                    </div>
                    :
                    <>
                        <p id="ans-ques" >Please answer all the questions!</p>
                        <button onClick={handleClick} className="check-ans" to="/quiz">Check Answer</button>
                    </>
                }  
            </>
        )
    )
}


/**
 * Additional task for you to tease your brain - we will build on top of this ;)
 * --------------------------------------------
 * Try to extract your state + useEffect into a custom hook
 * That hook should return the following values:
 * 1. quizData
 * 2. requestStatus
 * 3. updateAnswer - currently named as optionClick
 * 4. counter
 * --------------------------------------------
 */
