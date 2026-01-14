import React from 'react';
import { AlertCircle, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ErrorMessage = ({ message, onRetry }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="space-y-3">
            {onRetry && (
              <button
                onClick={onRetry}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition"
              >
                إعادة المحاولة
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
