import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, CheckCircle, Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EXERCISES } from '../data/exercises';
import { Visualizer } from '../components/Visualizer';
import { HistoryRecord } from '../types';

// Simple sound synthesis for beeps
const playBeep = (freq = 440, type: 'sine' | 'square' = 'sine', duration = 0.1) => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + duration);
};

export const ExerciseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const exercise = EXERCISES.find(e => e.id === id);

  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (exercise) {
      setTimeLeft(exercise.durationSeconds);
    }
  }, [exercise]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Sound effects
  useEffect(() => {
      if(isActive && soundEnabled && timeLeft > 0 && timeLeft <= 3) {
          playBeep(600, 'sine', 0.2);
      }
  }, [timeLeft, isActive, soundEnabled]);

  const handleComplete = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsActive(false);
    setIsCompleted(true);
    if(soundEnabled) playBeep(880, 'sine', 0.5); // Success sound

    // Save history
    const historyItem: HistoryRecord = {
        date: new Date().toISOString(),
        exerciseId: exercise?.id || ''
    };
    const currentHistory = JSON.parse(localStorage.getItem('eyezen_history') || '[]');
    localStorage.setItem('eyezen_history', JSON.stringify([...currentHistory, historyItem]));
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    if (exercise) setTimeLeft(exercise.durationSeconds);
  };

  if (!exercise) return <div>Exercise not found</div>;

  const progress = ((exercise.durationSeconds - timeLeft) / exercise.durationSeconds) * 100;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="p-6 flex-1 flex flex-col">
        {/* Visualizer Area */}
        <div className="mb-8 relative z-10">
            <Visualizer type={exercise.type} isActive={isActive} />
            
            {/* Timer Overlay */}
             <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-full px-6 py-2 shadow-lg border border-slate-100 flex items-center gap-2">
                <span className={`font-mono text-2xl font-bold ${timeLeft <= 5 && isActive ? 'text-red-500' : 'text-slate-800'}`}>
                    {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
                </span>
             </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 flex-1">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-slate-800">{exercise.title}</h2>
                <button 
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50"
                >
                    {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">운동 방법</h3>
                <ul className="space-y-3">
                    {exercise.instructions.map((step, idx) => (
                        <li key={idx} className="flex gap-3 text-slate-700 text-sm leading-relaxed">
                            <span className="bg-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-sm text-primary-600 shrink-0 border border-slate-100">
                                {idx + 1}
                            </span>
                            {step}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-6 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-slate-100 rounded-full mb-6 overflow-hidden">
            <motion.div 
                className="h-full bg-primary-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
            />
        </div>

        <div className="flex items-center justify-center gap-6">
            <button 
                onClick={resetTimer}
                className="p-4 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors"
            >
                <RotateCcw className="w-6 h-6" />
            </button>

            {!isCompleted ? (
                <button 
                    onClick={toggleTimer}
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-xl shadow-primary-500/30 transition-all active:scale-95 ${isActive ? 'bg-amber-400 hover:bg-amber-500 text-white' : 'bg-primary-500 hover:bg-primary-600 text-white'}`}
                >
                    {isActive ? (
                        <Pause className="w-8 h-8 fill-current" />
                    ) : (
                        <Play className="w-8 h-8 fill-current ml-1" />
                    )}
                </button>
            ) : (
                <motion.button 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => navigate('/')}
                    className="w-full max-w-[200px] h-14 bg-primary-600 hover:bg-primary-700 text-white rounded-full flex items-center justify-center gap-2 font-bold shadow-lg shadow-primary-600/30"
                >
                    <CheckCircle className="w-5 h-5" />
                    완료! 돌아가기
                </motion.button>
            )}
        </div>
      </div>
    </div>
  );
};