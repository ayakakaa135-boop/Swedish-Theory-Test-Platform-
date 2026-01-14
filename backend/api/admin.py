from django.contrib import admin
from .models import Section, Question, TestAttempt, TestAnswer


@admin.register(Section)
class SectionAdmin(admin.ModelAdmin):
    list_display = ['section_id', 'name_ar', 'question_count', 'order']
    list_editable = ['order']
    search_fields = ['section_id', 'name_ar', 'name_en']
    ordering = ['order', 'section_id']


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    list_display = ['question_id', 'section', 'text_preview', 'difficulty', 'is_active']
    list_filter = ['section', 'difficulty', 'is_active']
    search_fields = ['question_id', 'text_ar', 'text_en']
    list_editable = ['is_active']

    def text_preview(self, obj):
        return obj.text_ar[:50] + '...' if len(obj.text_ar) > 50 else obj.text_ar

    text_preview.short_description = 'نص السؤال'


class TestAnswerInline(admin.TabularInline):
    model = TestAnswer
    extra = 0
    readonly_fields = ['question', 'selected_answer', 'is_correct', 'answered_at']


@admin.register(TestAttempt)
class TestAttemptAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'test_type',
        'section',
        'correct_answers',
        'total_questions',
        'score_percentage',
        'passed',
        'started_at'
    ]
    list_filter = ['test_type', 'passed', 'with_timer', 'section']
    readonly_fields = [
        'started_at',
        'completed_at',
        'answered_questions',
        'correct_answers',
        'score_percentage',
        'passed',
        'time_taken_seconds'
    ]
    inlines = [TestAnswerInline]

    def has_add_permission(self, request):
        return False


@admin.register(TestAnswer)
class TestAnswerAdmin(admin.ModelAdmin):
    list_display = ['attempt', 'question', 'selected_answer', 'is_correct', 'answered_at']
    list_filter = ['is_correct', 'answered_at']
    readonly_fields = ['attempt', 'question', 'selected_answer', 'is_correct', 'answered_at']

    def has_add_permission(self, request):
        return False
