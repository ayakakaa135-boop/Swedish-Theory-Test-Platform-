import React, { createContext, useContext, useState, useMemo } from "react";

const TestContext = createContext(null);

export const useTest = () => {
  const context = useContext(TestContext);
  if (!context) {
    throw new Error('useTest must be used within TestProvider');
  }
  return context;
};

export const TestProvider = ({ children }) => {
  const [currentAttempt, setCurrentAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(3000);
  const [testMode, setTestMode] = useState(null);
  const [useTimer, setUseTimer] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  const startTest = (mode, section = null, withTimer = false, questionsData = []) => {
    setTestMode(mode);
    setSelectedSection(section);
    setUseTimer(withTimer);
    setQuestions(questionsData);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(3000);
  };

  const answerQuestion = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1);
  };

  const resetTest = () => {
    setCurrentAttempt(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setAnswers({});
    setTimeLeft(3000);
    setTestMode(null);
    setUseTimer(false);
    setSelectedSection(null);
  };

  // 2. استخدام useMemo لتحسين الأداء ومنع إعادة الرندر غير الضرورية
  const value = useMemo(() => ({
    currentAttempt, setCurrentAttempt,
    questions, setQuestions,
    currentQuestion, setCurrentQuestion,
    answers, setAnswers,
    timeLeft, setTimeLeft,
    testMode, useTimer, selectedSection,
    startTest, answerQuestion, nextQuestion, previousQuestion, resetTest
  }), [currentAttempt, questions, currentQuestion, answers, timeLeft, testMode, useTimer, selectedSection]);

  // 3. استخدام الـ JSX Syntax بدلاً من createElement (أفضل لـ Vite)
  return (
    <TestContext.Provider value={value}>
      {children}
    </TestContext.Provider>
  );
};