import React from 'react';
import { useTest } from '../contexts/TestContext';

const QuestionCard = ({ question }) => {
  const { answers, answerQuestion } = useTest();
  const selectedAnswer = answers[question.id];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {question.text_ar}
      </h2>

      {question.image_url && (
        <div className="mb-6">
          <img
            src={question.image_url}
            alt="Question illustration"
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
        </div>
      )}

      <div className="space-y-3">
        {question.options_ar.map((option, index) => (
          <button
            key={index}
            onClick={() => answerQuestion(question.id, index)}
            className={`w-full text-right p-4 rounded-lg border-2 transition ${
              selectedAnswer === index
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === index 
                  ? 'border-blue-500 bg-blue-500' 
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === index && (
                  <div className="w-3 h-3 bg-white rounded-full" />
                )}
              </div>
              <span className="text-lg flex-1">{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;