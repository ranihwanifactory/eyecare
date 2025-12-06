import React, { useState, useEffect } from 'react';
import { Activity, Calendar, MessageCircle, Eye, ChevronRight, Info, Play } from 'lucide-react';
import { ExercisePlayer } from './components/ExercisePlayer';
import { AIAdvisor } from './components/AIAdvisor';
import { SEOAndShare } from './components/SEOAndShare';
import { Exercise, ExerciseType, UserHistory } from './types';

// Mock Data
const EXERCISES: Exercise[] = [
  {
    id: '1',
    title: '8자 그리기 운동',
    description: '눈동자를 부드럽게 8자로 움직여 안근육의 긴장을 풀어줍니다.',
    type: ExerciseType.SMOOTH_PURSUIT,
    durationSeconds: 30,
    difficulty: 'Easy',
    instructions: '고개를 고정한 채 화면의 공을 눈으로만 따라가세요.'
  },
  {
    id: '5',
    title: '좌우 파도타기 운동',
    description: '높낮이가 변하는 노란 점을 따라가며 안구의 유연성을 기릅니다.',
    type: ExerciseType.HORIZONTAL_TRACKING,
    durationSeconds: 30,
    difficulty: 'Easy',
    instructions: '머리는 고정한 채, 물결치듯 움직이는 점을 끝까지 따라가세요.'
  },
  {
    id: '2',
    title: '동체 시력 점프',
    description: '빠르게 이동하는 점을 쫓으며 안구 조절력을 강화합니다.',
    type: ExerciseType.SACCADE,
    durationSeconds: 30,
    difficulty: 'Medium',
    instructions: '점이 나타나는 위치를 빠르게 찾아서 쳐다보세요.'
  },
  {
    id: '3',
    title: '원근 조절 운동',
    description: '수정체의 두께 조절 능력을 향상시켜 노안 예방에 도움을 줍니다.',
    type: ExerciseType.NEAR_FAR,
    durationSeconds: 45,
    difficulty: 'Medium',
    instructions: '글자가 커지면 편안하게 보고, 작아지면 집중해서 초점을 맞추세요.'
  },
  {
    id: '4',
    title: '깜빡임 트레이닝',
    description: '올바른 눈 깜빡임을 통해 안구 건조증을 예방합니다.',
    type: ExerciseType.BLINKING,
    durationSeconds: 40,
    difficulty: 'Easy',
    instructions: '지시에 따라 눈을 완전히 감았다가 크게 뜨세요.'
  }
];

export default function App() {
  const [view, setView] = useState<'dashboard' | 'exercise' | 'chat'>('dashboard');
  const [activeExercise, setActiveExercise] = useState<Exercise | null>(null);
  const [history, setHistory] = useState<UserHistory[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('eyeCareHistory');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const handleStartExercise = (ex: Exercise) => {
    setActiveExercise(ex);
    setView('exercise');
  };

  const handleCompleteExercise = () => {
    if (activeExercise) {
      const newEntry: UserHistory = {
        date: new Date().toISOString(),
        exerciseId: activeExercise.id,
        completed: true
      };
      const newHistory = [newEntry, ...history];
      setHistory(newHistory);
      localStorage.setItem('eyeCareHistory', JSON.stringify(newHistory));
    }
  };

  const exitExercise = () => {
      setView('dashboard');
      setActiveExercise(null);
  };

  // Calculate Streak
  const getStreak = () => {
    // Simplified streak logic for demo
    const today = new Date().toDateString();
    const hasToday = history.some(h => new Date(h.date).toDateString() === today);
    return hasToday ? history.length : history.length; 
  };

  const todayCount = history.filter(h => new Date(h.date).toDateString() === new Date().toDateString()).length;

  return (
    <div className="min-h-screen pb-20 md:pb-0 font-sans text-slate-900 bg-slate-50 max-w-3xl mx-auto shadow-2xl">
      <SEOAndShare />

      {/* Navigation Header */}
      <header className="bg-white sticky top-0 z-30 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2" onClick={() => setView('dashboard')}>
          <div className="bg-emerald-600 p-2 rounded-lg text-white">
            <Eye size={24} />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-800 cursor-pointer">눈건강<span className="text-emerald-600">운동</span></h1>
        </div>
        <div className="flex gap-4 text-sm font-medium text-slate-500">
          <button 
            onClick={() => setView('dashboard')}
            className={`transition-colors ${view === 'dashboard' ? 'text-emerald-600' : 'hover:text-emerald-600'}`}
          >
            홈
          </button>
          <button 
            onClick={() => setView('chat')}
            className={`transition-colors ${view === 'chat' ? 'text-emerald-600' : 'hover:text-emerald-600'}`}
          >
            AI 상담
          </button>
        </div>
      </header>

      <main className="p-4 md:p-6">
        {view === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Daily Stats Card */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-emerald-100 text-sm font-medium mb-1">오늘의 눈 건강 지수</h2>
                  <div className="text-3xl font-bold">
                    {todayCount > 0 ? '관리 중 🌿' : '운동 필요 ⚠️'}
                  </div>
                </div>
                <Activity className="text-emerald-200" size={24} />
              </div>
              <div className="flex gap-4">
                <div className="bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm">
                  <div className="text-xs text-emerald-100 opacity-80">오늘 운동</div>
                  <div className="text-xl font-bold">{todayCount}회</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 flex-1 backdrop-blur-sm">
                  <div className="text-xs text-emerald-100 opacity-80">누적 기록</div>
                  <div className="text-xl font-bold">{getStreak()}회</div>
                </div>
              </div>
            </div>

            {/* Exercise List */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Calendar className="text-emerald-600" size={20} />
                추천 운동 프로그램
              </h3>
              <div className="grid gap-3">
                {EXERCISES.map((ex) => (
                  <button
                    key={ex.id}
                    onClick={() => handleStartExercise(ex)}
                    className="group bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all text-left flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                        {ex.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">{ex.description}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full">
                          {ex.durationSeconds}초
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          ex.difficulty === 'Easy' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {ex.difficulty === 'Easy' ? '쉬움' : '보통'}
                        </span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                      <Play size={20} className="ml-1" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Promo Banner */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-indigo-500 shrink-0 mt-1" size={20} />
                <div>
                    <h4 className="font-bold text-indigo-900 text-sm">전문가 팁</h4>
                    <p className="text-xs text-indigo-700 mt-1 leading-relaxed">
                        장시간 화면을 볼 때는 20분마다 20피트(약 6m) 먼 곳을 20초간 바라보는 '20-20-20 규칙'을 실천해보세요.
                    </p>
                </div>
            </div>
          </div>
        )}

        {view === 'exercise' && activeExercise && (
          <ExercisePlayer 
            exercise={activeExercise} 
            onComplete={handleCompleteExercise}
            onExit={exitExercise}
          />
        )}

        {view === 'chat' && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="mb-4">
                 <h2 className="text-xl font-bold text-slate-800">눈 건강 AI 상담</h2>
                 <p className="text-sm text-slate-500">안구 건조증, 시력 저하 등 고민을 털어놓으세요.</p>
             </div>
             <AIAdvisor />
          </div>
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 w-full max-w-3xl bg-white border-t border-slate-200 flex justify-around p-3 md:hidden z-30 pb-safe">
        <button 
          onClick={() => setView('dashboard')}
          className={`flex flex-col items-center gap-1 ${view === 'dashboard' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <Activity size={24} />
          <span className="text-[10px] font-medium">운동</span>
        </button>
        <button 
          onClick={() => setView('chat')}
          className={`flex flex-col items-center gap-1 ${view === 'chat' ? 'text-emerald-600' : 'text-slate-400'}`}
        >
          <MessageCircle size={24} />
          <span className="text-[10px] font-medium">상담</span>
        </button>
      </nav>
      
      {/* Safe Area Spacer for Mobile */}
      <div className="h-safe-bottom bg-white md:hidden"></div>
    </div>
  );
}