import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Exercise, ExerciseType } from '../types';
import { Play, Pause, X, CheckCircle, RefreshCw, Maximize2 } from 'lucide-react';

interface ExercisePlayerProps {
  exercise: Exercise;
  onComplete: () => void;
  onExit: () => void;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise, onComplete, onExit }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false); // State for "Ready?" overlay
  const [timeLeft, setTimeLeft] = useState(exercise.durationSeconds);
  const [animationFrame, setAnimationFrame] = useState(0);
  
  // Animation refs
  const requestRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const startExercise = () => {
    setIsReady(true);
    setIsPlaying(true);
  };

  const resetExercise = () => {
    setIsPlaying(false);
    setIsReady(false);
    setTimeLeft(exercise.durationSeconds);
    setAnimationFrame(0);
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
  };

  const animate = useCallback((time: number) => {
    if (startTimeRef.current === null) startTimeRef.current = time;
    const progress = time - (startTimeRef.current ?? time);
    
    setAnimationFrame(progress);
    
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isPlaying]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    
    if (isPlaying && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            onComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      requestRef.current = requestAnimationFrame(animate);
    } else {
       if (requestRef.current) cancelAnimationFrame(requestRef.current);
       startTimeRef.current = null;
    }

    return () => {
      if (timer) clearInterval(timer);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, timeLeft, onComplete, animate]);

  // --- Visual Renderers ---

  const renderVisuals = () => {
    switch (exercise.type) {
      case ExerciseType.SMOOTH_PURSUIT:
        // Figure 8 Logic:
        const t = animationFrame * 0.0015; 
        const x = Math.sin(t) * 35; 
        const y = Math.sin(t * 2) * 25; 
        
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Guide path (faint) */}
            <div className="absolute w-[70vw] h-[50vh] border border-emerald-500/10 rounded-[50%] opacity-20 pointer-events-none"></div>
             
             {/* Moving Ball */}
            <div 
              className="w-12 h-12 bg-emerald-400 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.6)] transform will-change-transform"
              style={{ transform: `translate(${x}vw, ${y}vh)` }}
            >
                <div className="w-full h-full bg-white rounded-full opacity-30 animate-pulse"></div>
            </div>
            
            <div className="absolute bottom-32 text-emerald-400/50 text-lg font-medium animate-pulse">
                고개는 고정하고 눈동자만 움직이세요
            </div>
          </div>
        );

      case ExerciseType.HORIZONTAL_TRACKING:
        const ht = animationFrame * 0.002;
        const hx = Math.sin(ht) * 40; // Horizontal: fast
        const hy = Math.sin(ht * 0.5) * 25; // Vertical: slow sine wave (height adjustment)
        
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Guide Grid (Faint) */}
            <div className="absolute w-full h-full opacity-5 pointer-events-none" 
                 style={{ 
                    backgroundImage: 'radial-gradient(circle, #10b981 1px, transparent 1px)',
                    backgroundSize: '50px 50px' 
                 }}>
            </div>
            
            {/* Moving Yellow Dot */}
            <div 
                className="w-10 h-10 bg-yellow-400 rounded-full shadow-[0_0_25px_rgba(250,204,21,0.6)] transform will-change-transform"
                style={{ transform: `translate(${hx}vw, ${hy}vh)` }}
            >
                <div className="w-full h-full bg-white rounded-full opacity-40 animate-pulse"></div>
            </div>
            
            <div className="absolute bottom-32 text-emerald-400/50 text-lg font-medium animate-pulse text-center px-4">
                노란 점이 파도를 타듯 움직입니다<br/>시선을 떼지 마세요
            </div>
          </div>
        );

      case ExerciseType.SACCADE:
        const positions = [
          { top: '10%', left: '10%' },
          { top: '80%', left: '80%' },
          { top: '10%', right: '10%' },
          { bottom: '10%', left: '10%' },
          { top: '50%', left: '50%' },
        ];
        const jumpPhase = Math.floor(animationFrame / 1200) % positions.length;
        const currentPos = positions[jumpPhase];
        
        return (
          <div className="relative w-full h-full">
            <div 
                className="absolute w-10 h-10 bg-orange-400 rounded-full shadow-[0_0_20px_rgba(251,146,60,0.6)] transition-all duration-200 ease-out"
                style={currentPos as any}
            ></div>
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <span className="text-emerald-500/30 text-lg">점이 나타나는 곳을 빠르게 응시하세요</span>
             </div>
          </div>
        );

      case ExerciseType.BLINKING:
        const blinkPhase = Math.floor(animationFrame / 2500) % 2;
        return (
          <div className="flex flex-col items-center justify-center h-full">
             <div className={`text-9xl mb-8 transition-all duration-500 transform ${blinkPhase === 0 ? 'opacity-100 scale-100 text-emerald-400' : 'opacity-20 scale-90 text-emerald-800'}`}>
                👁️
             </div>
             <div className="text-4xl font-bold text-emerald-100 text-center">
               {blinkPhase === 0 ? "눈을 크게 뜨세요" : "눈을 꽉 감으세요"}
             </div>
          </div>
        );

      case ExerciseType.NEAR_FAR:
          const scalePhase = Math.sin(animationFrame * 0.0015) + 1.5; 
          return (
             <div className="flex flex-col items-center justify-center h-full overflow-hidden">
                <div 
                    className="text-emerald-400 font-bold transition-transform duration-75 will-change-transform"
                    style={{ fontSize: '4rem', transform: `scale(${scalePhase})`}}
                >
                    A
                </div>
                <div className="mt-24 text-emerald-300/70 text-xl">글자가 커지면 이완, 작아지면 집중</div>
             </div>
          );

      default:
        return <div className="h-full flex items-center justify-center text-emerald-500">운동 화면 준비 중...</div>;
    }
  };

  // --- Complete View ---
  if (timeLeft === 0) {
      return (
          <div className="fixed inset-0 z-50 bg-emerald-950 flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
              <CheckCircle className="w-32 h-32 text-emerald-400 mb-8 shadow-emerald-500/20 drop-shadow-xl" />
              <h2 className="text-4xl font-bold text-white mb-4">운동 완료!</h2>
              <p className="text-emerald-200/80 mb-12 text-center text-lg max-w-md">
                  눈이 한결 편안해지셨나요?<br/>꾸준한 관리가 건강한 눈을 만듭니다.
              </p>
              <button 
                onClick={onExit}
                className="w-full max-w-sm bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-6 rounded-2xl shadow-lg transition-all transform hover:scale-105"
              >
                  메인으로 돌아가기
              </button>
          </div>
      )
  }

  // --- Main Fullscreen Player ---
  return (
    <div className="fixed inset-0 z-50 bg-emerald-950 flex flex-col overflow-hidden">
      
      {/* Top Bar (Minimal) */}
      <div className="absolute top-0 left-0 w-full p-6 flex items-center justify-between z-10 bg-gradient-to-b from-black/40 to-transparent">
        <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-lg backdrop-blur-sm">
                 <Maximize2 size={20} className="text-emerald-300" />
            </div>
            <div>
                <h3 className="font-bold text-emerald-100 text-lg shadow-black drop-shadow-md">{exercise.title}</h3>
                <p className="text-emerald-400/80 text-xs">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} 남음</p>
            </div>
        </div>
        <button onClick={onExit} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors backdrop-blur-md">
          <X size={24} />
        </button>
      </div>

      {/* Main Visual Area */}
      <div className="flex-1 relative w-full h-full">
        {!isReady ? (
            // Ready State Overlay
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-emerald-900/90 backdrop-blur-sm z-20 animate-in fade-in">
                <h2 className="text-3xl font-bold text-white mb-8 text-center px-4 leading-snug">
                    눈의 피로를 풀 준비가<br/>되셨나요?
                </h2>
                <div className="bg-black/20 p-6 rounded-2xl max-w-sm mx-6 mb-10 border border-emerald-500/30">
                    <p className="text-emerald-100 text-center text-lg leading-relaxed">
                        "{exercise.instructions}"
                    </p>
                </div>
                <button 
                    onClick={startExercise}
                    className="bg-emerald-500 hover:bg-emerald-400 text-white text-xl font-bold py-5 px-12 rounded-full shadow-[0_0_40px_rgba(16,185,129,0.4)] transition-all transform hover:scale-105 flex items-center gap-3"
                >
                    <Play fill="currentColor" /> 시작하기
                </button>
                <p className="mt-8 text-emerald-400/60 text-sm flex items-center gap-2">
                    <Maximize2 size={14}/> 전체 화면으로 진행됩니다
                </p>
            </div>
        ) : (
            // Active Exercise Visuals
            renderVisuals()
        )}
      </div>

      {/* Bottom Controls (Only visible when playing) */}
      {isReady && (
        <div className="absolute bottom-0 w-full p-8 flex justify-center items-center gap-6 z-10 bg-gradient-to-t from-black/60 to-transparent pb-12">
            <button 
                onClick={resetExercise}
                className="p-4 rounded-full bg-white/10 border border-white/10 text-white/80 hover:bg-white/20 backdrop-blur-md transition-all"
                title="다시 시작"
            >
                <RefreshCw size={24} />
            </button>
            
            <div className="flex-1 max-w-xs h-2 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                <div 
                    className="h-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] transition-all duration-1000 ease-linear"
                    style={{ width: `${(timeLeft / exercise.durationSeconds) * 100}%` }}
                ></div>
            </div>

            <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-5 rounded-full bg-emerald-500 text-white shadow-lg hover:bg-emerald-400 hover:scale-110 transition-all"
            >
                {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1"/>}
            </button>
        </div>
      )}
    </div>
  );
};