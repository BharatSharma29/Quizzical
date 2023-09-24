import { decode } from "html-entities";
import { nanoid } from "nanoid";
import React from "react";

const RequestStatus = {
    Idle: 'idle',
    Pending: 'pending',
    Resolved: 'resolved',
    Rejected: 'rejected',
}

export default function useFetchData() {
    const [quizData, setQuizData] = React.useState(null)
    const [status, setStatus] = React.useState(RequestStatus.Idle)

    React.useEffect(() => {
        setStatus(RequestStatus.Pending)

        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(resData => {
                let tempArr = resData.results.map(data => {
                    const correctAnswer = objFactory(decode(data.correct_answer))

                    const options = data.incorrect_answers.map(value => objFactory(decode(value)))

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

                setQuizData(tempArr)
                setStatus(RequestStatus.Resolved)
                console.log("UseEffect")
            })
            .catch(error => {
                console.log(error)
                setStatus(RequestStatus.Rejected)
            })
    }, [])

    function objFactory(value) {
        return {
            id: nanoid(),
            value
        }
    }

    function updateAnswer(questionId, answerId) {
        setQuizData(prev => {
            return prev.map((question) => {
                if (question.id !== questionId) return question

                return {
                    ...question,
                    selectedAnswerId: answerId,
                }
            })
        })
    }

    const counter = quizData.reduce((accumulator, item, index, arrayRef) => {
        if (item.selectedAnswerId !== item.correctAnswerId) return accumulator;
        return accumulator + 1;
    }, 0)

    return [quizData, updateAnswer, counter, status]
}