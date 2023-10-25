import { nanoid } from "nanoid";

function getCorrectnessClass(gameIsRunning, answerIsCorrect, answerIsSelected) {
  if (gameIsRunning) return null;
  if (answerIsCorrect) return "answer--correct";
  if (answerIsSelected) return "answer--incorrect";
  return null;
}

export function getClassName(
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
  // console.log(className);
  return className;
}

export function objFactory(value) {
  return {
    id: nanoid(),
    value,
  };
}
