import { nanoid } from "nanoid";

function getCorrectnessClass(gameIsRunning, answerIsCorrect, answerIsSelected) {
  if (gameIsRunning) return null;
  if (answerIsCorrect) return "answer--correct";
  if (answerIsSelected) return "answer--incorrect";
  return null;
}

function getClassName(
  gameIsRunning,
  correctAnswerId,
  selectedAnswerId,
  answerId
) {
  const answerIsSelected = selectedAnswerId === answerId;
  const answerIsCorrect = answerId === correctAnswerId;

  const selectedClass = answerIsSelected ? "answer--selected" : null;
  const correctnessClass = getCorrectnessClass(
    gameIsRunning,
    answerIsCorrect,
    answerIsSelected
  );

  const classes = ["answer", selectedClass, correctnessClass];

  let className = classes.filter(Boolean).join(" ");
  console.log(className);
  return className;
}

export function getQuestionElements(quizData, updateAnswer) {
  return quizData.map((obj) => (
    <div key={nanoid()}>
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
