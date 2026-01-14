import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Home } from 'lucide-react';
import { questionsAPI, attemptsAPI } from '../services/api';
import { useTest } from '../contexts/TestContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import QuestionCard from '../components/QuestionCard';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';

const TestPage = () => {
  const navigate = useNavigate();
  const { type, sectionId } = useParams();
  const [searchParams] = useSearchParams();
  const withTimer = searchParams.get('timer') === 'true';
  
  const {
    questions,
    setQuestions,
    currentQuestion,
    nextQuestion,
    previousQuestion,
    answers,
    startTest,
    setCurrentAttempt,
  } = useTest();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTest();
  }, [type, sectionId]);

  const loadTest = async () => {
    try {
      setLoading(true);
      let questionsData;
      let testType;
      let section = null;

      if (type === 'full') {
        testType = 'full';
        const response = await questionsAPI.getRandomFullTest();
        questionsData = response.data.questions;
      } else if (type === 'section' && sectionId) {
        testType = 'section';
        const response = await questionsAPI.getBySection(sectionId);
        questionsData = response.data.questions;
        section = response.data.section;
      }

      if (!questionsData || questionsData.length === 0) {
        setError('لا توجد أسئلة متاحة');
        return;
      }

      // إنشاء محاولة في قاعدة البيانات
      const attemptResponse = await attemptsAPI.create({
        test_type: testType,
        section_id: sectionId,
        with_timer: withTimer,
        total_questions: questionsData.length,
      });

      setCurrentAttempt(attemptResponse.data);
      startTest(testType, section, withTimer, questionsData);
      setQuestions(questionsData);
      setError(null);
    } catch (err) {
      console.error('Error loading test:', err);
      setError('فشل تحميل الاختبار');
    } finally {
      setLoading(false);
    }
  };

  const handleFinish = () => {
    navigate('/results');
  };

  const handleTimeUp = () => {
    alert('انتهى الوقت! سيتم إرسال الاختبار الآن.');
    handleFinish();
  };

  if (loading) return <LoadingSpinner message="جاري تحميل الاختبار..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!questions.length) return <ErrorMessage message="لا توجد أسئلة" />;

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-4xl mx-auto">
        {/* Header with Progress */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => {
                if (window.confirm('هل أنت متأكد من الخروج من الاختبار؟')) {
                  navigate('/');
                }
              }}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Home className="w-5 h-5" />
              الرئيسية
            </button>
            <Timer onTimeUp={handleTimeUp} />
          </div>
          <ProgressBar current={currentQuestion + 1} total={questions.length} />
        </div>

        {/* Question Card */}
        <QuestionCard question={currentQ} />

        {/* Navigation */}
        <div className="bg-white rounded-xl shadow-lg p-4 mt-4">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={previousQuestion}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              السابق
            </button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                تمت الإجابة على {Object.keys(answers).length} من {questions.length}
              </span>
            </div>

            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleFinish}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition"
              >
                إنهاء الاختبار
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition"
              >
                التالي
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;