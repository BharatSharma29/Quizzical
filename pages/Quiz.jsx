import React from "react";
import { Link } from "react-router-dom";
import { decode } from "html-entities";

export default function Quiz() {
    //state variables
    const [data, setData] = React.useState([])
    const [checkAns, setCheckAns] = React.useState(false)
    const [loading, setLoading] = React.useState(true)

    //counter for number of correct answers
    let counter = React.useRef(0)


    React.useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then(res => res.json())
            .then(resData => {
                let increment  = 1
                let tempArr = resData.results.map(obj => {
                    let arr = obj.incorrect_answers
                    arr.push(obj.correct_answer)
                    //Shuffling options
                    arr = shuffle(arr)
                    return {
                        id: increment++,
                        question: decode(obj.question),
                        options: [
                                {
                                    option: arr[0],
                                    selected: false,
                                    id: "a"
                                },
                                {
                                    option: arr[1],
                                    selected: false,
                                    id: "b"
                                },
                                {
                                    option: arr[2],
                                    selected: false,
                                    id: "c"
                                },
                                {
                                    option: arr[3],
                                    selected: false,
                                    id: "d"
                                }
                            ],
                        isSelected: false,
                        correctAns: obj.correct_answer
                    }
                })
                setData(tempArr)
                setLoading(false)
            })
    }, [])

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    function optionClick(optionId, elementId) {
        setData(prev => {
            prev = prev.map((element) => {
                if(element.id === elementId){
                    element.isSelected = true
                    element.options = element.options.map(choice => {
                        return choice.id === optionId ? {...choice, selected: true}
                        : {...choice, selected: false}
                    })
                }
                return element
            })
            return prev
        })
    }

    function getClassName(obj, index) {
        let className = "options"
        if(obj.options[index].selected && !checkAns){
            className += " " + "selected"
        }
        else if(obj.options[index].selected && obj.options[index].option === obj.correctAns){
            className += " " + "right"
            counter.current++
        }
        else if(obj.options[index].selected && obj.options[index].option !== obj.correctAns){
            className += " " + "wrong"
        }
        else if(obj.options[index].option === obj.correctAns && checkAns){
            className += " " + "right"
        }
        return className
    }

    
    const questionsElements = data.map( obj =>
        <>
            <h3 className="question">{obj.question}</h3>
            <div className="answers">
                
                <span 
                    className={getClassName(obj, 0)}
                    onClick={() => optionClick(obj.options[0].id, obj.id)} 
                >
                    {obj.options[0].option}
                </span>
                
                <span 
                    className={getClassName(obj, 1)}
                    onClick={() => optionClick(obj.options[1].id, obj.id)}
                >
                    {obj.options[1].option}
                </span>

                <span 
                    className={getClassName(obj, 2)}
                    onClick={() => optionClick(obj.options[2].id, obj.id)}
                >
                    {obj.options[2].option}
                </span>

                <span
                    className={getClassName(obj, 3)}
                    onClick={() => optionClick(obj.options[3].id, obj.id)}
                >
                    {obj.options[3].option}
                </span>
            </div>
            <hr />
        </>
    )

    function handleClick() {
        const isReady = data.every((element) => element.isSelected)
        if(!isReady)
            document.getElementById('ans-ques').style.display = "block" 
        setCheckAns(isReady)
    }

    return(
        loading ? (<h1>Loading....</h1>) 
        :(
            <>
                {questionsElements}
                {checkAns ?
                    <div className="score">
                        <p>You scored {counter.current}/5 correct answers</p>
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