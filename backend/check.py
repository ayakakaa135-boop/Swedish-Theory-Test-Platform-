import json


def verify_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    unique_texts = set()
    total = 0
    sections = data['swedish_driving_theory_test']['sections']

    for sec_id, sec_data in sections.items():
        for q in sec_data['questions']:
            total += 1
            unique_texts.add(q['question_text'].strip())

    print(f"إجمالي الأسئلة في الملف: {total}")
    print(f"الأسئلة الفريدة (بدون تكرار): {len(unique_texts)}")


verify_file('data/1.json')  # تأكد من وضع اسم ملفك هنا