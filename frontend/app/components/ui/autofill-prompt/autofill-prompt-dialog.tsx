import { useEffect, useState } from "react";
import { questionsBank } from "@/app/components/ui/autofill-prompt/autofill-prompt.interface";
import { ChatHandler } from "@/app/components/ui/chat/chat.interface";

export default function AutofillQuestion(
  props: Pick<
    ChatHandler,
    "messages" | "isLoading" | "handleSubmit" | "handleInputChange" | "input"
  >,
) {
  const [showOverlay, setShowOverlay] = useState(true);

  // Randomly select a subset of questions
  const [randomQuestions, setRandomQuestions] = useState(questionsBank.questionsBank);

  // Shuffle the array using Fisher-Yates algorithm
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Randomly select a subset of 3-4 questions
  useEffect(() => {
    // Shuffle the questionsBank array
    const shuffledQuestions = shuffleArray(questionsBank.questionsBank);
    // Get a random subset of 3-4 questions
    const subsetSize = Math.floor(Math.random() * 2) + 3; // Randomly choose between 3 and 4
    const selectedQuestions = shuffledQuestions.slice(0, subsetSize);
    setRandomQuestions(selectedQuestions);
  }, []);


  // Hide overlay when there are messages
  useEffect(() => {
    if (props.messages.length > 0) {
      setShowOverlay(false);
    }
    else {
      setShowOverlay(true);
    }
  }, [props.messages, props.input]);

  // Handle autofill questions click
  const handleAutofillQuestionClick = (questionInput: string) => {
    props.handleInputChange({ target: { name: "message", value: questionInput } } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <>
      {showOverlay && (
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col divide-y overflow-y-auto pb-4">
            <h2 className="text-lg text-center font-semibold mb-4">How can I help you today?</h2>
            <ul>
              {randomQuestions.map((question, index) => (
                <li key={index} className="p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg hover:bg-zinc-500/30 transition duration-300 ease-in-out transform cursor-pointer">
                  <button
                    className="text-blue-500 w-full text-left"
                    onClick={() => handleAutofillQuestionClick(question.title)}
                  >
                    {question.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
