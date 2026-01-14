import os
import sys
import django
import json

# إعداد Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from api.models import Section, Question


def import_questions_from_json(json_file_path):
    """استيراد الأسئلة من ملف JSON"""

    print(f"📂 قراءة الملف: {json_file_path}")

    with open(json_file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    test_data = data['swedish_driving_theory_test']
    sections_data = test_data['sections']

    print(f"✅ تم قراءة {len(sections_data)} قسم")

    # ترتيب الأقسام
    section_order = {
        'vehicle_knowledge_and_manoeuvring': 1,
        'environment': 2,
        'traffic_safety': 3,
        'traffic_rules': 4,
        'personal_conditions': 5
    }

    # الألوان للأقسام
    section_colors = {
        'vehicle_knowledge_and_manoeuvring': 'bg-purple-500',
        'environment': 'bg-yellow-500',
        'traffic_safety': 'bg-blue-500',
        'traffic_rules': 'bg-green-500',
        'personal_conditions': 'bg-red-500'
    }

    total_questions = 0

    for section_key, section_data in sections_data.items():
        print(f"\n📦 معالجة القسم: {section_data['section_name']}")

        # إنشاء أو تحديث القسم
        section, created = Section.objects.update_or_create(
            section_id=section_key,
            defaults={
                'name_ar': section_data['section_name'],
                'description_ar': section_data['section_description'],
                'question_count': section_data['number_of_questions'],
                'color': section_colors.get(section_key, 'bg-blue-500'),
                'order': section_order.get(section_key, 99)
            }
        )

        action = "تم الإنشاء" if created else "تم التحديث"
        print(f"   {action}: {section.name_ar}")

        # إضافة الأسئلة
        questions_added = 0
        for q_data in section_data['questions']:
            question, created = Question.objects.update_or_create(
                question_id=q_data['question_id'],
                defaults={
                    'section': section,
                    'text_ar': q_data['question_text'],
                    'options_ar': q_data['options'],
                    'correct_answer': q_data['correct_answer'],
                    'explanation_ar': q_data['explanation'],
                    'image_url': q_data.get('image_url', ''),
                    'difficulty': 'medium',
                    'is_active': True
                }
            )

            if created:
                questions_added += 1

        print(f"   ✅ تم إضافة {questions_added} سؤال جديد")
        total_questions += questions_added

    print(f"\n🎉 اكتمل الاستيراد!")
    print(f"📊 إجمالي الأقسام: {Section.objects.count()}")
    print(f"📊 إجمالي الأسئلة: {Question.objects.count()}")


if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("الاستخدام: python import_questions.py <path_to_json_file>")
        print("مثال: python import_questions.py data/1.json")
        sys.exit(1)

    json_file = sys.argv[1]

    if not os.path.exists(json_file):
        print(f"❌ الملف غير موجود: {json_file}")
        sys.exit(1)

    import_questions_from_json(json_file)
