import axios from 'axios';


const API_BASE_URL = '/api';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor للطلبات (Request)
api.interceptors.request.use(
  (config) => {
    console.log('📤 Sending request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Interceptor للاستجابات (Response)
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', response.status, response.config.url);
    console.log('📦 Data:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', error.message);

    if (error.response) {
      // الخادم أرسل استجابة بخطأ
      console.error('📛 Error status:', error.response.status);
      console.error('📛 Error data:', error.response.data);
    } else if (error.request) {
      // الطلب تم إرساله لكن لم يتم استقبال رد
      console.error('📛 No response received');
      console.error('📛 Request:', error.request);
    } else {
      // خطأ في إعداد الطلب
      console.error('📛 Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

// =============== Sections API ===============
export const sectionsAPI = {
  getAll: () => {
    console.log('🔍 Fetching all sections...');
    return api.get('/sections/');
  },

  getById: (id) => {
    console.log('🔍 Fetching section:', id);
    return api.get(`/sections/${id}/`);
  },

  getStatistics: (sectionId) => {
    console.log('🔍 Fetching section statistics:', sectionId);
    return api.get(`/sections/${sectionId}/statistics/`);
  },
};

// =============== Questions API ===============
export const questionsAPI = {
  getAll: () => {
    console.log('🔍 Fetching all questions...');
    return api.get('/questions/');
  },

  getById: (id) => {
    console.log('🔍 Fetching question:', id);
    return api.get(`/questions/${id}/`);
  },

  getRandomFullTest: () => {
    console.log('🔍 Fetching random full test...');
    return api.get('/questions/random_full_test/');
  },

  getBySection: (sectionId, randomCount = null) => {
    console.log('🔍 Fetching questions by section:', sectionId);
    const params = new URLSearchParams({ section_id: sectionId });
    if (randomCount) {
      params.append('random', randomCount);
    }
    return api.get(`/questions/by_section/?${params.toString()}`);
  },
};

// =============== Test Attempts API ===============
export const attemptsAPI = {
  getAll: () => {
    console.log('🔍 Fetching all attempts...');
    return api.get('/attempts/');
  },

  getById: (id) => {
    console.log('🔍 Fetching attempt:', id);
    return api.get(`/attempts/${id}/`);
  },

  create: (data) => {
    console.log('➕ Creating attempt:', data);
    return api.post('/attempts/', data);
  },

  submit: (attemptId, answers) => {
    console.log('📨 Submitting test:', attemptId);
    return api.post(`/attempts/${attemptId}/submit/`, { answers });
  },

  getStatistics: () => {
    console.log('🔍 Fetching statistics...');
    return api.get('/attempts/statistics/');
  },
};

export default api;
