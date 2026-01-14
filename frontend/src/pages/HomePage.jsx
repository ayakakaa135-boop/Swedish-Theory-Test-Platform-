import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Clock, Play, List, TrendingUp } from 'lucide-react';
import { sectionsAPI, attemptsAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const HomePage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sectionsRes, statsRes] = await Promise.all([
        sectionsAPI.getAll(),
        attemptsAPI.getStatistics().catch(() => ({ data: null }))
      ]);

      // تأكد من أننا نصل للمصفوفة الصحيحة
      // إذا كان Django يعيد البيانات مباشرة في response.data
      const data = Array.isArray(sectionsRes.data) ? sectionsRes.data : (sectionsRes.data.results || []);

      setSections(data);
      setStatistics(statsRes.data);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('فشل تحميل البيانات. يرجى التحقق من اتصال الخادم.');
      setSections([]); // نضع مصفوفة فارغة لتجنب الانهيار
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={loadData} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              اختبار القيادة النظري السويدي
            </h1>
            <p className="text-lg text-gray-600">
              استعد للحصول على رخصة القيادة السويدية مع اختباراتنا الشاملة
            </p>
          </div>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-800">إحصائيات عامة</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{statistics.total_attempts}</p>
                <p className="text-sm text-gray-600">إجمالي المحاولات</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{statistics.passed_attempts}</p>
                <p className="text-sm text-gray-600">نجح</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{statistics.failed_attempts}</p>
                <p className="text-sm text-gray-600">رسب</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">
                  {statistics.pass_rate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">نسبة النجاح</p>
              </div>
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">65 سؤال</h3>
            <p className="text-gray-600">أسئلة شاملة تغطي جميع جوانب القيادة</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">52 للنجاح</h3>
            <p className="text-gray-600">احصل على 52 إجابة صحيحة لاجتياز الاختبار</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">50 دقيقة</h3>
            <p className="text-gray-600">الوقت المخصص للاختبار الكامل</p>
          </div>
        </div>

        {/* Test Options */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            ابدأ الاختبار
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-2 border-blue-200 rounded-xl p-6 hover:border-blue-400 transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                اختبار كامل (65 سؤال)
              </h3>
              <p className="text-gray-600 mb-4">
                اختبار شامل بـ 65 سؤال عشوائي من جميع الأقسام
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/test/full?timer=true')}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Clock className="w-5 h-5" />
                  اختبار مع مؤقت (50 دقيقة)
                </button>
                <button
                  onClick={() => navigate('/test/full')}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Play className="w-5 h-5" />
                  اختبار بدون مؤقت
                </button>
              </div>
            </div>

            <div className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                اختبار حسب القسم
              </h3>
              <p className="text-gray-600 mb-4">
                اختر قسماً محدداً لممارسة الأسئلة
              </p>
              <button
                onClick={() => navigate('/sections')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
              >
                <List className="w-5 h-5" />
                عرض الأقسام
              </button>
            </div>
          </div>
        </div>

        {/* Sections Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            أقسام الاختبار
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map(section => (
              <div
                key={section.id}
                className="border rounded-lg p-4 hover:shadow-md transition cursor-pointer"
                onClick={() => navigate(`/section/${section.section_id}`)}
              >
                <div className={`${section.color} text-white text-sm font-bold px-3 py-1 rounded-full inline-block mb-2`}>
                  {section.question_count} سؤال
                </div>
                <h3 className="font-bold text-gray-800">{section.name_ar}</h3>
                <p className="text-sm text-gray-600 mt-1">{section.description_ar}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
