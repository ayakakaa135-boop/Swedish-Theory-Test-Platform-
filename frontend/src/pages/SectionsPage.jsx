import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sectionsAPI } from '../services/api';
import { LayoutGrid, ArrowRight } from 'lucide-react';

const SectionsPage = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      setLoading(true);
      const response = await sectionsAPI.getAll();
      const data = response.data.results || response.data;
      setSections(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <LayoutGrid className="text-blue-600" />
            أقسام الاختبار
          </h1>
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-blue-600 hover:underline"
          >
            <ArrowRight className="w-4 h-4" /> العودة للرئيسية
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div
              key={section.id}
              onClick={() => navigate(`/test/section/${section.section_id}`)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full">
                  {section.question_count} سؤال
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition">
                {section.name_ar}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2">
                {section.description_ar}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionsPage;