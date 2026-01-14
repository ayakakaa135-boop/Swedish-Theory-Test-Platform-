from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Count, Q
from django.utils import timezone
import random

from .models import Section, Question, TestAttempt, TestAnswer
from .serializers import (
    SectionSerializer,
    QuestionSerializer,
    QuestionWithoutAnswerSerializer,
    TestAttemptSerializer,
    TestAnswerSerializer,
    TestSubmissionSerializer
)


class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API للأقسام
    - list: عرض جميع الأقسام
    - retrieve: عرض قسم محدد
    - statistics: إحصائيات القسم
    """
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    lookup_field = 'section_id'

    @action(detail=True, methods=['get'])
    def statistics(self, request, section_id=None):
        """إحصائيات القسم"""
        section = self.get_object()

        stats = {
            'section_id': section.section_id,
            'section_name': section.name_ar,
            'total_questions': section.questions.filter(is_active=True).count(),
            'difficulty_breakdown': {
                'easy': section.questions.filter(difficulty='easy', is_active=True).count(),
                'medium': section.questions.filter(difficulty='medium', is_active=True).count(),
                'hard': section.questions.filter(difficulty='hard', is_active=True).count(),
            }
        }

        return Response(stats)


class QuestionViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API للأسئلة
    - list: عرض جميع الأسئلة
    - retrieve: عرض سؤال محدد
    - random_full_test: توليد 65 سؤال عشوائي
    - by_section: الحصول على أسئلة قسم محدد
    """
    queryset = Question.objects.filter(is_active=True)
    serializer_class = QuestionSerializer

    def get_serializer_class(self):
        """اختيار المحول المناسب"""
        if self.action in ['random_full_test', 'by_section']:
            return QuestionWithoutAnswerSerializer
        return QuestionSerializer

    @action(detail=False, methods=['get'])
    def random_full_test(self, request):
        """
        توليد 65 سؤال عشوائي حسب التوزيع المطلوب:
        - 16 من السلامة المرورية
        - 32 من قواعد المرور
        - 5 من البيئة
        - 7 من معرفة المركبة والمناورة
        - 5 من الشروط الشخصية
        """
        try:
            questions = []

            # توزيع الأسئلة حسب القسم
            distribution = {
                'traffic_safety': 16,
                'traffic_rules': 32,
                'environment': 5,
                'vehicle_knowledge_and_manoeuvring': 7,
                'personal_conditions': 5
            }

            for section_id, count in distribution.items():
                section_questions = self._get_random_questions(section_id, count)
                questions.extend(section_questions)

            # خلط الأسئلة
            random.shuffle(questions)

            serializer = self.get_serializer(questions, many=True)
            return Response({
                'total': len(questions),
                'distribution': distribution,
                'questions': serializer.data
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _get_random_questions(self, section_id, count):
        """الحصول على عدد محدد من الأسئلة العشوائية من قسم معين"""
        try:
            section = Section.objects.get(section_id=section_id)
            questions = list(
                Question.objects.filter(section=section, is_active=True)
            )

            # إذا كان عدد الأسئلة المطلوبة أكبر من المتاح
            if len(questions) < count:
                print(f"تحذير: القسم {section_id} يحتوي على {len(questions)} سؤال فقط، مطلوب {count}")
                return questions

            return random.sample(questions, count)

        except Section.DoesNotExist:
            print(f"خطأ: القسم {section_id} غير موجود")
            return []

    @action(detail=False, methods=['get'])
    def by_section(self, request):
        """
        الحصول على أسئلة قسم محدد
        Parameters:
            - section_id: معرف القسم
            - random: عدد الأسئلة العشوائية (اختياري)
        """
        section_id = request.query_params.get('section_id')
        random_count = request.query_params.get('random')

        if not section_id:
            return Response(
                {'error': 'معرف القسم مطلوب (section_id)'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            section = Section.objects.get(section_id=section_id)
            questions = Question.objects.filter(
                section=section,
                is_active=True
            )

            # إذا طلب عدد عشوائي محدد
            if random_count:
                try:
                    count = int(random_count)
                    questions = list(questions)
                    if len(questions) > count:
                        questions = random.sample(questions, count)
                except ValueError:
                    pass

            serializer = self.get_serializer(questions, many=True)
            return Response({
                'section': SectionSerializer(section).data,
                'total': len(serializer.data),
                'questions': serializer.data
            })

        except Section.DoesNotExist:
            return Response(
                {'error': 'القسم غير موجود'},
                status=status.HTTP_404_NOT_FOUND
            )


class TestAttemptViewSet(viewsets.ModelViewSet):
    """
    API لمحاولات الاختبار
    - create: إنشاء محاولة جديدة
    - submit: إرسال نتائج الاختبار
    - statistics: إحصائيات عامة
    """
    queryset = TestAttempt.objects.all()
    serializer_class = TestAttemptSerializer

    def create(self, request, *args, **kwargs):
        """إنشاء محاولة اختبار جديدة"""
        test_type = request.data.get('test_type')
        section_id = request.data.get('section_id')
        with_timer = request.data.get('with_timer', False)

        # التحقق من نوع الاختبار
        if test_type not in ['full', 'section']:
            return Response(
                {'error': 'نوع الاختبار غير صحيح'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # حساب عدد الأسئلة
        if test_type == 'full':
            total_questions = 65
            section = None
        else:
            if not section_id:
                return Response(
                    {'error': 'معرف القسم مطلوب لاختبار القسم'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                section = Section.objects.get(section_id=section_id)
                total_questions = section.questions.filter(is_active=True).count()
            except Section.DoesNotExist:
                return Response(
                    {'error': 'القسم غير موجود'},
                    status=status.HTTP_404_NOT_FOUND
                )

        # إنشاء المحاولة
        attempt = TestAttempt.objects.create(
            test_type=test_type,
            section=section,
            with_timer=with_timer,
            total_questions=total_questions,
            user_ip=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )

        serializer = self.get_serializer(attempt)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        """
        إرسال نتائج الاختبار
        Body: {
            "answers": {
                "question_id": selected_answer_index,
                ...
            }
        }
        """
        attempt = self.get_object()

        # التحقق من أن الاختبار لم يكتمل بعد
        if attempt.completed_at:
            return Response(
                {'error': 'تم إكمال هذا الاختبار مسبقاً'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # التحقق من البيانات
        submission_serializer = TestSubmissionSerializer(data=request.data)
        if not submission_serializer.is_valid():
            return Response(
                submission_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        answers_data = submission_serializer.validated_data['answers']

        # حفظ الإجابات
        for question_id, selected_answer in answers_data.items():
            try:
                question = Question.objects.get(id=question_id)
                is_correct = question.correct_answer == selected_answer

                TestAnswer.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=selected_answer,
                    is_correct=is_correct
                )
            except Question.DoesNotExist:
                continue

        # تحديث المحاولة
        attempt.completed_at = timezone.now()
        attempt.calculate_results()

        # إرجاع النتائج
        serializer = self.get_serializer(attempt)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def statistics(self, request):
        """إحصائيات عامة"""
        total_attempts = TestAttempt.objects.filter(
            completed_at__isnull=False
        ).count()

        passed_attempts = TestAttempt.objects.filter(
            completed_at__isnull=False,
            passed=True
        ).count()

        full_test_attempts = TestAttempt.objects.filter(
            test_type='full',
            completed_at__isnull=False
        ).count()

        stats = {
            'total_attempts': total_attempts,
            'passed_attempts': passed_attempts,
            'failed_attempts': total_attempts - passed_attempts,
            'pass_rate': (passed_attempts / total_attempts * 100) if total_attempts > 0 else 0,
            'full_test_attempts': full_test_attempts,
        }

        return Response(stats)

    def _get_client_ip(self, request):
        """الحصول على IP العميل"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip