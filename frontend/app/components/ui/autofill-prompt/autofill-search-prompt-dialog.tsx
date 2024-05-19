import { useEffect, useState } from "react";
import { QuestionsBankProp, psscocQuestionsBank, eirQuestionsBank } from "@/app/components/ui/autofill-prompt/autofill-prompt.interface";
import { SearchHandler } from "@/app/components/ui/search/search.interface";
import { Undo2 } from "lucide-react";

export default function AutofillSearchQuery(
  props: Pick<
    SearchHandler,
    "collSelectedId" | "collSelectedName" | "query" | "isLoading" | "onSearchSubmit" | "onInputChange" | "results" | "searchButtonPressed" | "handleCollIdSelect"
  >,
) {
  // Keep track of whether to show the overlay
  const [showOverlay, setShowOverlay] = useState(true);
  // Randomly select a subset of questions
  const [randomQuestions, setRandomQuestions] = useState<QuestionsBankProp[]>([]);
  // Keep track of the current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // Questions bank for PSSCOC or EIR
  const [questionsBank, setQuestionsBank] = useState<QuestionsBankProp[]>(psscocQuestionsBank);

  // Shuffle the array using Fisher-Yates algorithm
  function shuffleArray(array: any[]) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // TODO: To load the questionsbank from a database in the future

  // Randomly select a subset of 3-4 questions
  useEffect(() => {
    // Select the questions bank based on the document set selected
    if (props.collSelectedName === "EIR") {
      setQuestionsBank(eirQuestionsBank);
    }
    else if (props.collSelectedName === "PSSCOC") {
      setQuestionsBank(psscocQuestionsBank);
    }
    else {
      // Do nothing and return
      return;
    }
    // Shuffle the questionsBank array
    const shuffledQuestions = shuffleArray(questionsBank);
    // Get a random subset of 3-4 questions
    const subsetSize = Math.floor(Math.random() * 2) + 3; // Randomly choose between 3 and 4
    const selectedQuestions = shuffledQuestions.slice(0, subsetSize);
    // Do a short delay before setting the state to show the animation
    setTimeout(() => {
      setRandomQuestions(selectedQuestions);
    }, 300);
  }, [questionsBank, props.collSelectedName]);


  // Hide overlay when there are query
  useEffect(() => {
    if (props.query.length > 0) {
      setShowOverlay(false);
    }
    else {
      setShowOverlay(true);
    }
  }, [props.results, props.query]);

  // Handle autofill questions click
  const handleAutofillQuestionClick = (questionInput: string) => {
    if (props.onInputChange) {
      props.onInputChange({ target: { name: "message", value: questionInput } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

    // Handle back button click
    const handleBackButtonClick = () => {
      props.handleCollIdSelect("");
    };

  return (
    <>
      {showOverlay && (
        <div className="relative mx-auto">
          <div className="rounded-lg pt-5 pr-10 pl-10 flex flex-col overflow-y-auto pb-4 bg-white dark:bg-zinc-700/30 shadow-xl">
          <div className="flex items-center justify-center mb-4 gap-2">
              <h2 className="text-lg text-center font-semibold">How can I help you with {props.collSelectedName} today?</h2>
              <button
                title="Go Back"
                onClick={handleBackButtonClick}
                className="hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-500/10 focus:bg-blue-500/10"
              >
                <Undo2 className="w-6 h-6" />
              </button>
            </div>
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
