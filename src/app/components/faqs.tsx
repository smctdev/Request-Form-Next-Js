import faqs from "@/data/faqs.json";
import { useState } from "react";

export default function Faqs() {
  const [openAnswer, setOpenAnswer] = useState<{ [key: number]: boolean }>({});
  const handleOpenAnswer = (index: number) => () => {
    setOpenAnswer((openAnswer: any) => ({
      ...openAnswer,
      [index]: !openAnswer[index],
    }));
  };

  return (
    <div className="p-8 overflow-hidden bg-white shadow-md rounded-xl">
      <h2 className="mb-4 !text-2xl font-bold text-primary">FAQs?</h2>
      <ul className="space-y-4">
        {faqs?.map((faq, index) => (
          <li className="flex items-start" key={index}>
            <div
              className={`p-2 mr-4 rounded-full transition-all duration-300 ease-in-out ${
                openAnswer[index] ? "bg-green-500" : "bg-secondary"
              }`}
            >
              <svg
                className={`w-5 h-5 ${
                  openAnswer[index] ? "text-green-100" : "text-primary"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <div className="flex flex-col">
              <p className="cursor-pointer" onClick={handleOpenAnswer(index)}>
                <span
                  className={`!text-lg ${
                    openAnswer[index]
                      ? "text-gray-700 font-bold"
                      : "text-gray-500 font-semibold"
                  }`}
                >
                  {faq.question}
                </span>
              </p>
              {openAnswer && openAnswer[index] && (
                <p>
                  <span className="text-gray-700 whitespace-pre-line">
                    -{faq.answer}
                  </span>
                </p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
