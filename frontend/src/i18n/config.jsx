import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ar: {
    translation: {
      // Navigation
      home: 'الرئيسية',
      sections: 'الأقسام',
      statistics: 'الإحصائيات',
      
      // Test Types
      fullTest: 'اختبار كامل (65 سؤال)',
      sectionTest: 'اختبار حسب القسم',
      withTimer: 'مع مؤقت (50 دقيقة)',
      withoutTimer: 'بدون مؤقت',
      
      // Actions
      start: 'ابدأ',
      next: 'التالي',
      previous: 'السابق',
      submit: 'إرسال',
      finish: 'إنهاء الاختبار',
      retry: 'إعادة الاختبار',
      backToHome: 'العودة للرئيسية',
      viewSections: 'عرض الأقسام',
      
      // Results
      passed: 'مبروك! لقد نجحت',
      failed: 'للأسف، لم تنجح',
      score: 'النتيجة',
      correct: 'صحيحة',
      incorrect: 'خاطئة',
      unanswered: 'بدون إجابة',
      answered: 'تمت الإجابة',
      
      // Messages
      loading: 'جاري التحميل...',
      error: 'حدث خطأ',
      noQuestions: 'لا توجد أسئلة متاحة',
      testCompleted: 'تم إكمال الاختبار',
      
      // Info
      totalQuestions: 'إجمالي الأسئلة',
      passingScore: 'علامة النجاح',
      duration: 'المدة',
      minutes: 'دقيقة',
      questions: 'أسئلة',
      question: 'السؤال',
      of: 'من',
      
      // Sections
      traffic_safety: 'السلامة المرورية',
      traffic_rules: 'قواعد المرور',
      environment: 'البيئة',
      vehicle_knowledge_and_manoeuvring: 'معرفة المركبة والمناورة',
      personal_conditions: 'الشروط الشخصية',
    }
  },
  sv: {
    translation: {
      // Swedish translations
      home: 'Hem',
      sections: 'Avsnitt',
      statistics: 'Statistik',
      fullTest: 'Fullständigt test (65 frågor)',
      sectionTest: 'Avsnitt test',
      withTimer: 'Med timer (50 minuter)',
      withoutTimer: 'Utan timer',
      start: 'Start',
      next: 'Nästa',
      previous: 'Föregående',
      submit: 'Skicka',
      finish: 'Avsluta test',
      retry: 'Försök igen',
      backToHome: 'Tillbaka till hem',
      viewSections: 'Visa avsnitt',
      passed: 'Grattis! Du har klarat det',
      failed: 'Tyvärr, du klarade inte',
      score: 'Resultat',
      correct: 'Rätt',
      incorrect: 'Fel',
      unanswered: 'Obesvarade',
      answered: 'Besvarade',
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ar',
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
