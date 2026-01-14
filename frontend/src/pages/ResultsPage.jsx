import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Award, Home, RotateCcw } from 'lucide-react';
import { attemptsAPI } from '../services/api';
import { useTest } from '../contexts/TestContext';
import LoadingSpinner from '../components/LoadingSpinner';

const ResultsPage = () => {
  const navigate = useNavigate();
  const { currentAttempt, answers, questions, testMode, resetTest } = useTest();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState(null);

  useEffect(() => {
    submitTest();
  }, []);

  const submitTest = async () => {
    try {
      if (!currentAttempt) {
        navigate('/');
        return;
      }

      // إرسال الإجابات إلى الخادم
      const response = await attemptsAPI.submit(currentAttempt.id, answers);
      setResults(response.data);
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    resetTest();
    navigate('/');
  };

  if (loading) {
    return <LoadingSpinner message="جاري حساب النتائج..." />;
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-700 mb-4">حدث خطأ في حساب النتائج</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold"
          >
            العودة للرئيسية
          </button>
        </div>
      </div>
    );
  }

  const {
    passed,
    correct_answers,
    total_questions,
    score_percentage,
    answered_questions,
  } = results;

  const incorrectAnswers = answered_questions - correct_answers;
  const unansweredQuestions = total_questions - answered_questions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Result Header */}
          <div className="text-center mb-8">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${
              passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {passed ? (
                <CheckCircle className="w-16 h-16 text-green-600" />
              ) : (
                <XCircle className="w-16 h-16 text-red-600" />
              )}
            </div>
            <h1 className={`text-4xl font-bold mb-2 ${
              passed ? 'text-green-600' : 'text-red-600'
            }`}>
              {passed ? 'مبروك! لقد نجحت' : 'للأسف، لم تنجح'}
            </h1>
            <p className="text-xl text-gray-600">
              حصلت على {correct_answers} إجابة صحيحة من {total_questions}
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">
              {score_percentage.toFixed(1)}%
            </p>
          </div>

          {/* Statistics Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{correct_answers}</p>
              <p className="text-sm text-gray-600">صحيحة</p>
            </div>

            <div className="bg-red-50 rounded-lg p-4 text-center">
              <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
              <p className="text-sm text-gray-600">خاطئة</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="w-8 h-8 bg-gray-300 rounded-full mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-600">{unansweredQuestions}</p>
              <p className="text-sm text-gray-600">بدون إجابة</p>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Award className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{answered_questions}</p>
              <p className="text-sm text-gray-600">تمت الإجابة</p>
            </div>
          </div>

          {/* Message */}
          {testMode === 'full' && (
            <div className={`${passed ? 'bg-green-50' : 'bg-blue-50'} rounded-lg p-4 mb-8 text-center`}>
              <p className="text-gray-700">
                {passed
                  ? 'أنت مستعد للاختبار الرسمي! 🎉'
                  : `تحتاج إلى ${52 - correct_answers} إجابة صحيحة إضافية للنجاح`}
              </p>
            </div>
          )}

          {/* Review Answers */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">مراجعة الإجابات</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {questions.map((question, index) => {
                const userAnswer = answers[question.id];
                const isCorrect = userAnswer === question.correct_answer;
                const wasAnswered = userAnswer !== undefined;

                return (
                  <div
                    key={question.id}
                    className={`border-2 rounded-lg p-4 ${
                      !wasAnswered
                        ? 'border-gray-300 bg-gray-50'
                        : isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        {!wasAnswered ? (
                          <div className="w-6 h-6 bg-gray-400 rounded-full" />
                        ) : isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 mb-2">
                          {index + 1}. {question.text_ar}
                        </p>
                        {wasAnswered && (
                          <>
                            <p className="text-sm text-gray-600 mb-1">
                              <span className="font-bold">إجابتك:</span>{' '}
                              {question.options_ar[userAnswer]}
                            </p>
                            {!isCorrect && (
                              <p className="text-sm text-green-700 mb-2">
                                <span className="font-bold">الإجابة الصحيحة:</span>{' '}
                                {question.options_ar[question.correct_answer]}
                              </p>
                            )}
                          </>
                        )}
                        {!wasAnswered && (
                          <p className="text-sm text-gray-600 mb-2">
                            <span className="font-bold">لم تتم الإجابة - الإجابة الصحيحة:</span>{' '}
                            {question.options_ar[question.correct_answer]}
                          </p>
                        )}
                        <p className="text-sm text-gray-700 bg-white p-2 rounded">
                          <span className="font-bold">الشرح:</span> {question.explanation_ar}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </button>
            <button
              onClick={() => {
                resetTest();
                navigate(testMode === 'full' ? '/test/full' : '/sections');
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <RotateCcw className="w-5 h-5" />
              إعادة الاختبار
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
