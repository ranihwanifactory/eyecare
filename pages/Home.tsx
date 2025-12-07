import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Zap, History, Star } from 'lucide-react';
import { EXERCISES } from '../data/exercises';
import { Exercise } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    // Basic stat reading
    const history = localStorage.getItem('eyezen_history');
    if (history) {
      setCompletedCount(JSON.parse(history).length);
    }
  }, []);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="px-6 py-8 bg-white mb-6 rounded-b-[2rem] shadow-sm border-b border-slate-100">
        <div className="mb-4">
            <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Today's Status</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">안녕하세요! 👋</h2>
        <p className="text-slate-500 mb-6">오늘도 눈 건강을 챙겨볼까요?</p>

        <div className="flex gap-4">
            <div className="flex-1 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-4 text-white shadow-lg shadow-primary-500/20">
                <div className="flex items-start justify-between mb-2">
                    <Zap className="w-5 h-5 text-primary-100" />
                    <span className="text-2xl font-bold">{completedCount}</span>
                </div>
                <p className="text-primary-100 text-sm">완료한 운동</p>
            </div>
             <div className="flex-1 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-2">
                    <History className="w-5 h-5 text-slate-400" />
                    <span className="text-2xl font-bold text-slate-800">0</span>
                </div>
                <p className="text-slate-400 text-sm">연속일 (Coming Soon)</p>
            </div>
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="px-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            추천 운동
        </h3>
        
        <div className="grid gap-4">
          {EXERCISES.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => navigate(`/exercise/${exercise.id}`)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md hover:border-primary-200 transition-all active:scale-[0.98]"
            >
              <div className={`w-14 h-14 ${exercise.color} rounded-2xl flex items-center justify-center shrink-0`}>
                <exercise.icon className="w-7 h-7" />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-slate-800 text-lg mb-1">{exercise.title}</h4>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-medium">{exercise.difficulty}</span>
                    <span>{exercise.durationSeconds}초</span>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                <ChevronRight className="w-5 h-5" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};