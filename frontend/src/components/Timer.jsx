import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';
import { useTest } from '../contexts/TestContext';

const Timer = ({ onTimeUp }) => {
  const { timeLeft, setTimeLeft, useTimer } = useTest();

  useEffect(() => {
    if (!useTimer || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [useTimer, timeLeft, onTimeUp, setTimeLeft]);

  if (!useTimer) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const isLowTime = timeLeft < 300; // Less than 5 minutes

  return (
    <div className={`flex items-center gap-2 font-bold ${
      isLowTime ? 'text-red-600 animate-pulse' : 'text-blue-600'
    }`}>
      <Clock className="w-5 h-5" />
      <span className="text-lg">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </span>
    </div>
  );
};

export default Timer;
