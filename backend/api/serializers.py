from rest_framework import serializers
from .models import Section, Question, TestAttempt, TestAnswer


class SectionSerializer(serializers.ModelSerializer):
    """محول بيانات الأقسام"""

    class Meta:
        model = Section
        fields = [
            'id',
            'section_id',
            'name_ar',
            'name_en',
            'description_ar',
            'description_en',
            'question_count',
            'color',
            'order'
        ]


class QuestionSerializer(serializers.ModelSerializer):
    """محول بيانات الأسئلة"""

    section_name = serializers.CharField(source='section.name_ar', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'question_id',
            'section',
            'section_name',
            'text_ar',
            'text_en',
            'text_sv',
            'options_ar',
            'options_en',
            'options_sv',
            'correct_answer',
            'explanation_ar',
            'explanation_en',
            'explanation_sv',
            'image_url',
            'image',
            'difficulty',
            'is_active'
        ]


class QuestionWithoutAnswerSerializer(serializers.ModelSerializer):
    """محول بيانات الأسئلة بدون الإجابة الصحيحة (للاختبارات)"""

    section_name = serializers.CharField(source='section.name_ar', read_only=True)

    class Meta:
        model = Question
        fields = [
            'id',
            'question_id',
            'section',
            'section_name',
            'text_ar',
            'options_ar',
            'image_url',
            'image',
        ]


class TestAnswerSerializer(serializers.ModelSerializer):
    """محول بيانات الإجابات"""

    question_text = serializers.CharField(source='question.text_ar', read_only=True)

    class Meta:
        model = TestAnswer
        fields = [
            'id',
            'question',
            'question_text',
            'selected_answer',
            'is_correct',
            'answered_at',
            'time_spent_seconds'
        ]


class TestAttemptSerializer(serializers.ModelSerializer):
    """محول بيانات محاولات الاختبار"""

    answers = TestAnswerSerializer(many=True, read_only=True)
    section_name = serializers.CharField(source='section.name_ar', read_only=True)

    class Meta:
        model = TestAttempt
        fields = [
            'id',
            'test_type',
            'section',
            'section_name',
            'with_timer',
            'started_at',
            'completed_at',
            'total_questions',
            'answered_questions',
            'correct_answers',
            'score_percentage',
            'passed',
            'time_taken_seconds',
            'answers'
        ]
        read_only_fields = [
            'started_at',
            'answered_questions',
            'correct_answers',
            'score_percentage',
            'passed',
            'time_taken_seconds'
        ]


class TestSubmissionSerializer(serializers.Serializer):
    """محول بيانات إرسال نتائج الاختبار"""

    answers = serializers.DictField(
        child=serializers.IntegerField(),
        help_text="قاموس من {question_id: selected_answer}"
    )