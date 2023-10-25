import { decode } from "html-entities";
import { nanoid } from "nanoid";
import React from "react";
import { objFactory } from "../utils";

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
                    console.log("Before Sort = " + options[0])
                    options.sort(() => {
                        console.log(Math.random() > 0.5)
                        return Math.random() > 0.5
                    })
                    console.log("After Sort = " + options[0])

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
            })
            .catch(error => {
                console.log(error)
                setStatus(RequestStatus.Rejected)
            })
    }, [])

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

    function getCounter() {
        if(!quizData)
            return 0
        const ans = quizData.reduce((accumulator, item, index, arrayRef) => {
            if (item.selectedAnswerId !== item.correctAnswerId) return accumulator;
            return accumulator + 1;
        }, 0)
        return ans
    }

    const counter = getCounter()

    return {quizData, updateAnswer, counter, status}
}