from django.db import models
from django.utils import timezone


class Section(models.Model):
    """نموذج الأقسام (السلامة المرورية، قواعد المرور، إلخ)"""

    section_id = models.CharField(
        max_length=100,
        unique=True,
        verbose_name="معرف القسم"
    )
    name_ar = models.CharField(
        max_length=200,
        verbose_name="الاسم بالعربية"
    )
    name_en = models.CharField(
        max_length=200,
        blank=True,
        verbose_name="الاسم بالإنجليزية"
    )
    description_ar = models.TextField(
        verbose_name="الوصف بالعربية"
    )
    description_en = models.TextField(
        blank=True,
        verbose_name="الوصف بالإنجليزية"
    )
    question_count = models.IntegerField(
        default=0,
        verbose_name="عدد الأسئلة"
    )
    color = models.CharField(
        max_length=50,
        default='bg-blue-500',
        verbose_name="اللون"
    )
    order = models.IntegerField(
        default=0,
        verbose_name="الترتيب"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "قسم"
        verbose_name_plural = "الأقسام"
        ordering = ['order', 'section_id']

    def __str__(self):
        return self.name_ar


class Question(models.Model):
    """نموذج الأسئلة"""

    section = models.ForeignKey(
        Section,
        on_delete=models.CASCADE,
        related_name='questions',
        verbose_name="القسم"
    )
    question_id = models.CharField(
        max_length=50,
        unique=True,
        verbose_name="معرف السؤال"
    )
    text_ar = models.TextField(
        verbose_name="نص السؤال بالعربية"
    )
    text_en = models.TextField(
        blank=True,
        verbose_name="نص السؤال بالإنجليزية"
    )
    text_sv = models.TextField(
        blank=True,
        verbose_name="نص السؤال بالسويدية"
    )

    # الخيارات كـ JSON
    options_ar = models.JSONField(
        verbose_name="الخيارات بالعربية"
    )
    options_en = models.JSONField(
        blank=True,
        null=True,
        verbose_name="الخيارات بالإنجليزية"
    )
    options_sv = models.JSONField(
        blank=True,
        null=True,
        verbose_name="الخيارات بالسويدية"
    )

    correct_answer = models.IntegerField(
        verbose_name="رقم الإجابة الصحيحة (0-3)"
    )

    explanation_ar = models.TextField(
        verbose_name="الشرح بالعربية"
    )
    explanation_en = models.TextField(
        blank=True,
        verbose_name="الشرح بالإنجليزية"
    )
    explanation_sv = models.TextField(
        blank=True,
        verbose_name="الشرح بالسويدية"
    )

    image_url = models.URLField(
        blank=True,
        verbose_name="رابط الصورة"
    )
    image = models.ImageField(
        upload_to='questions/',
        blank=True,
        null=True,
        verbose_name="صورة السؤال"
    )

    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('easy', 'سهل'),
            ('medium', 'متوسط'),
            ('hard', 'صعب'),
        ],
        default='medium',
        verbose_name="مستوى الصعوبة"
    )

    is_active = models.BooleanField(
        default=True,
        verbose_name="نشط"
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "سؤال"
        verbose_name_plural = "الأسئلة"
        ordering = ['section', 'question_id']

    def __str__(self):
        return f"{self.question_id} - {self.text_ar[:50]}"


class TestAttempt(models.Model):
    """محاولات الاختبار"""

    TEST_TYPES = [
        ('full', 'اختبار كامل (65 سؤال)'),
        ('section', 'اختبار قسم محدد'),
    ]

    test_type = models.CharField(
        max_length=20,
        choices=TEST_TYPES,
        verbose_name="نوع الاختبار"
    )
    section = models.ForeignKey(
        Section,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="القسم (إن وجد)"
    )
    with_timer = models.BooleanField(
        default=False,
        verbose_name="مع مؤقت"
    )

    started_at = models.DateTimeField(
        default=timezone.now,
        verbose_name="وقت البدء"
    )
    completed_at = models.DateTimeField(
        null=True,
        blank=True,
        verbose_name="وقت الإنهاء"
    )

    total_questions = models.IntegerField(
        verbose_name="إجمالي الأسئلة"
    )
    answered_questions = models.IntegerField(
        default=0,
        verbose_name="الأسئلة المجابة"
    )
    correct_answers = models.IntegerField(
        default=0,
        verbose_name="الإجابات الصحيحة"
    )

    score_percentage = models.FloatField(
        default=0.0,
        verbose_name="النسبة المئوية"
    )
    passed = models.BooleanField(
        default=False,
        verbose_name="ناجح"
    )

    time_taken_seconds = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="الوقت المستغرق (بالثواني)"
    )

    # معلومات إضافية
    user_ip = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name="IP المستخدم"
    )
    user_agent = models.TextField(
        blank=True,
        verbose_name="معلومات المتصفح"
    )

    class Meta:
        verbose_name = "محاولة اختبار"
        verbose_name_plural = "محاولات الاختبار"
        ordering = ['-started_at']

    def __str__(self):
        return f"محاولة #{self.id} - {self.get_test_type_display()}"

    def calculate_results(self):
        """حساب النتائج"""
        self.answered_questions = self.answers.count()
        self.correct_answers = self.answers.filter(is_correct=True).count()
        self.score_percentage = (self.correct_answers / self.total_questions) * 100

        # تحديد النجاح
        if self.test_type == 'full':
            self.passed = self.correct_answers >= 52
        else:
            self.passed = self.correct_answers >= (self.total_questions * 0.8)

        # حساب الوقت المستغرق
        if self.completed_at and self.started_at:
            time_delta = self.completed_at - self.started_at
            self.time_taken_seconds = int(time_delta.total_seconds())

        self.save()


class TestAnswer(models.Model):
    """إجابات الأسئلة"""

    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name='answers',
        verbose_name="المحاولة"
    )
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        verbose_name="السؤال"
    )
    selected_answer = models.IntegerField(
        verbose_name="الإجابة المختارة"
    )
    is_correct = models.BooleanField(
        verbose_name="صحيحة"
    )
    answered_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name="وقت الإجابة"
    )
    time_spent_seconds = models.IntegerField(
        null=True,
        blank=True,
        verbose_name="الوقت المستغرق (بالثواني)"
    )

    class Meta:
        verbose_name = "إجابة"
        verbose_name_plural = "الإجابات"
        ordering = ['answered_at']
        unique_together = ['attempt', 'question']

    def __str__(self):
        return f"{self.attempt.id} - {self.question.question_id}"

