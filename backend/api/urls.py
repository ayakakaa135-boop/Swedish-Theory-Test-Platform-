
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SectionViewSet, QuestionViewSet, TestAttemptViewSet

router = DefaultRouter()
router.register(r'sections', SectionViewSet, basename='section')
router.register(r'questions', QuestionViewSet, basename='question')
router.register(r'attempts', TestAttemptViewSet, basename='attempt')

urlpatterns = [
    path('', include(router.urls)),
]
