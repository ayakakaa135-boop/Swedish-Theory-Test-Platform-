import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Home, Play, ChevronRight, Lightbulb, AlertTriangle, CheckCircle, Clock, Leaf, Car, Heart, Shield } from 'lucide-react';

// بيانات المحتوى التعليمي
const sectionContent = {
  environment: {
    icon: <Leaf className="w-12 h-12" />,
    color: 'bg-green-500',
    title: 'البيئة والقيادة المستدامة',
    subtitle: 'كيف تقود بطريقة صديقة للبيئة وتوفر الوقود',
    introduction: 'تعتبر السويد من الدول الرائدة في الحفاظ على البيئة، وتلعب القيادة الصديقة للبيئة دوراً مهماً في تقليل التلوث والحفاظ على الطبيعة للأجيال القادمة.',
    topics: [
      {
        title: '🚗 القيادة الموفرة للوقود',
        content: 'القيادة الموفرة للوقود ليست فقط جيدة للبيئة، بل توفر المال أيضاً!',
        points: [
          { title: 'القيادة بسرعة ثابتة', description: 'حافظ على سرعة ثابتة. التسارع والكبح المتكرر يستهلك وقوداً أكثر بنسبة 20-30%.' },
          { title: 'السرعة المثلى', description: 'السرعة المثلى على الطريق السريع هي 90 كم/ساعة. كل 10 كم/ساعة زيادة تزيد استهلاك الوقود بنسبة 10%.' },
          { title: 'إيقاف المحرك', description: 'أطفئ المحرك إذا توقفت أكثر من 30 ثانية. المحركات الحديثة لا تحتاج إلى تسخين.' },
        ]
      },
      {
        title: '🌡️ ضغط الإطارات وأثره على البيئة',
        content: 'ضغط الإطارات الصحيح مهم جداً!',
        points: [
          { title: 'التحقق المنتظم', description: 'تحقق من ضغط الإطارات مرة كل أسبوعين. الضغط المنخفض يزيد استهلاك الوقود بنسبة 3-5%.' },
        ]
      }
    ],
    tips: [
      { title: 'نصيحة ذهبية', description: 'القيادة الموفرة للوقود يمكن أن توفر لك 10-20% من تكاليف الوقود سنوياً!' }
    ]
  },
  traffic_safety: {
    icon: <Shield className="w-12 h-12" />,
    color: 'bg-blue-500',
    title: 'السلامة المرورية',
    subtitle: 'قواعد وإرشادات السلامة على الطرق السويدية',
    introduction: 'السلامة المرورية هي أولوية قصوى في السويد.',
    topics: [
      {
        title: '🚗 المسافات الآمنة',
        content: 'الحفاظ على مسافة آمنة هو أساس القيادة الآمنة',
        points: [
          { title: 'قاعدة الثانيتين', description: 'في الظروف العادية، احتفظ بمسافة ثانيتين على الأقل.' },
        ]
      }
    ],
    tips: [
      { title: 'حزام الأمان', description: 'حزام الأمان يقلل خطر الوفاة بنسبة 50%!' }
    ]
  },
  traffic_rules: {
    icon: <BookOpen className="w-12 h-12" />,
    color: 'bg-purple-500',
    title: 'قواعد المرور',
    subtitle: 'القوانين واللوائح المرورية في السويد',
    introduction: 'قوانين المرور في السويد واضحة ومباشرة، ولكنها صارمة جداً.',
    topics: [
      {
        title: '⚡ السرعات القصوى',
        content: 'حدود السرعة في السويد',
        points: [
          { title: 'داخل المدن', description: '30-50 كم/ساعة' },
          { title: 'الطرق السريعة', description: '110-120 كم/ساعة' },
        ]
      }
    ],
    tips: []
  },
  vehicle_knowledge_and_manoeuvring: {
    icon: <Car className="w-12 h-12" />,
    color: 'bg-orange-500',
    title: 'معرفة المركبة والمناورة',
    subtitle: 'فهم أجزاء السيارة والتحكم بها',
    introduction: 'معرفة كيفية عمل سيارتك أساسي للقيادة الآمنة.',
    topics: [
      {
        title: '🔧 أنظمة السلامة',
        content: 'أنظمة السلامة الحديثة',
        points: [
          { title: 'نظام ABS', description: 'يمنع انغلاق العجلات عند الكبح الشديد.' },
        ]
      }
    ],
    tips: []
  },
  personal_conditions: {
    icon: <Heart className="w-12 h-12" />,
    color: 'bg-red-500',
    title: 'الحالة الشخصية للسائق',
    subtitle: 'كيف تؤثر حالتك على القيادة',
    introduction: 'حالتك الشخصية لها تأثير مباشر على قدرتك على القيادة بأمان.',
    topics: [
      {
        title: '😴 التعب والنعاس',
        content: 'التعب أحد أخطر أسباب الحوادث',
        points: [
          { title: 'علامات التعب', description: 'التثاؤب، صعوبة التركيز - توقف فوراً!' },
        ]
      }
    ],
    tips: []
  }
};

const SectionDetailsPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  const [section, setSection] = useState(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    const content = sectionContent[sectionId];
    if (content) {
      setSection(content);
    }
  }, [sectionId]);

  if (!section) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800 mb-4">القسم غير موجود</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4" dir="rtl">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className={`${section.color} text-white p-8`}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition"
              >
                <Home className="w-5 h-5" />
                الرئيسية
              </button>
              <div className="bg-white/20 p-3 rounded-full">
                {section.icon}
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2">{section.title}</h1>
            <p className="text-xl opacity-90">{section.subtitle}</p>
          </div>

          {/* Tabs */}
          <div className="bg-gray-50 px-8 py-4 flex gap-4 border-b">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                activeTab === 'content'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📚 المحتوى التعليمي
            </button>
            <button
              onClick={() => setActiveTab('practice')}
              className={`px-6 py-2 rounded-lg font-bold transition ${
                activeTab === 'practice'
                  ? 'bg-white text-blue-600 shadow'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ✍️ ابدأ الاختبار
            </button>
          </div>
        </div>

        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-start gap-4">
                <div className={`${section.color} text-white p-3 rounded-lg flex-shrink-0`}>
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">مقدمة</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    {section.introduction}
                  </p>
                </div>
              </div>
            </div>

            {/* Topics */}
            {section.topics.map((topic, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-3">
                  <span className={`${section.color} text-white w-10 h-10 rounded-full flex items-center justify-center text-lg`}>
                    {index + 1}
                  </span>
                  {topic.title}
                </h3>
                <p className="text-gray-600 mb-6 text-lg">{topic.content}</p>

                <div className="space-y-4">
                  {topic.points.map((point, pIndex) => (
                    <div key={pIndex} className="bg-gray-50 rounded-lg p-6 border-r-4 border-blue-500">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">
                        {point.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {/* Tips */}
            {section.tips && section.tips.length > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl shadow-lg p-8 border-2 border-yellow-200">
                <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Lightbulb className="w-8 h-8 text-yellow-600" />
                  نصائح ذهبية
                </h3>
                <div className="space-y-4">
                  {section.tips.map((tip, index) => (
                    <div key={index} className="bg-white rounded-lg p-6 shadow">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">
                        {tip.title}
                      </h4>
                      <p className="text-gray-700 leading-relaxed">
                        {tip.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Practice Tab */}
        {activeTab === 'practice' && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className={`${section.color} text-white w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6`}>
                <Play className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                هل أنت جاهز للاختبار؟
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                الآن بعد أن قرأت المحتوى التعليمي، حان الوقت لاختبار معلوماتك!
              </p>

              <div className="space-y-4 max-w-md mx-auto">
                <button
                  onClick={() => navigate(`/test/section/${sectionId}`)}
                  className={`w-full ${section.color} text-white font-bold py-4 px-6 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-3`}
                >
                  <Play className="w-6 h-6" />
                  ابدأ اختبار {section.title}
                </button>

                <button
                  onClick={() => navigate('/test/full')}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-6 rounded-lg transition"
                >
                  اختبار كامل (65 سؤال)
                </button>

                <button
                  onClick={() => setActiveTab('content')}
                  className="w-full border-2 border-gray-300 text-gray-700 font-bold py-4 px-6 rounded-lg hover:border-gray-400 transition"
                >
                  العودة للمحتوى التعليمي
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SectionDetailsPage;
