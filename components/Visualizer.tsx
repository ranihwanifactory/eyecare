import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ExerciseType } from '../types';

interface VisualizerProps {
  type: ExerciseType;
  isActive: boolean;
}

export const Visualizer: React.FC<VisualizerProps> = ({ type, isActive }) => {
  // Generate random positions for the Random exercise
  const randomPositions = useMemo(() => {
    return Array.from({ length: 20 }).map(() => ({
      x: Math.floor(Math.random() * 200) - 100, // -100 to 100
      y: Math.floor(Math.random() * 120) - 60,  // -60 to 60
    }));
  }, []);

  if (!isActive) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
        준비가 되면 시작을 눌러주세요
      </div>
    );
  }

  // Figure 8 Animation (Lemniscate of Bernoulli)
  if (type === ExerciseType.FIGURE_EIGHT) {
    // Generate path points
    const points = [];
    const scale = 110; // Size of the 8
    const steps = 100;
    
    for (let i = 0; i <= steps; i++) {
        const t = (i / steps) * 2 * Math.PI;
        // Lemniscate formula
        const den = 1 + Math.sin(t) * Math.sin(t);
        const x = (scale * Math.cos(t)) / den;
        const y = (scale * Math.sin(t) * Math.cos(t)) / den;
        points.push({ x, y });
    }

    // Convert points to SVG path string 'M x y L x y ...'
    // Center is (150, 75) in a 300x150 box roughly, but our div is flex centered.
    // SVG viewBox 0 0 300 150 -> center is 150, 75.
    const pathData = points.map((p, i) => 
        `${i === 0 ? 'M' : 'L'} ${150 + p.x} ${75 + p.y}`
    ).join(' ') + ' Z';

    return (
      <div className="w-full h-64 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center">
        <svg width="100%" height="100%" viewBox="0 0 300 150" className="absolute inset-0 pointer-events-none">
             <path d={pathData} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
        </svg>
        <motion.div
          className="w-8 h-8 bg-primary-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] z-10"
          animate={{
            x: points.map(p => p.x),
            y: points.map(p => p.y),
          }}
          transition={{
            duration: 6, // Slower for better eye tracking
            repeat: Infinity,
            ease: "linear" // Linear because points are pre-calculated for smoothness
          }}
        />
        <p className="absolute bottom-4 text-white/50 text-sm">공을 눈으로 따라가세요</p>
      </div>
    );
  }

  // Circle Animation
  if (type === ExerciseType.CIRCLE) {
    return (
      <div className="w-full h-64 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center">
        <div className="absolute w-48 h-48 rounded-full border-2 border-dashed border-slate-700" />
        <motion.div
          className="w-8 h-8 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)]"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
             // Use a container or origin offset to rotate around center
             // A simple trick: make this div translate X, then rotate parent?
             // Or better: animate x/y using sin/cos like Figure 8, or just rotate a wrapper.
             // Here we rotate a wrapper of size 0 around center, with the ball offset.
             width: 200, 
             height: 200,
             backgroundColor: 'transparent',
             display: 'flex',
             alignItems: 'center', // Center vertically
             justifyContent: 'flex-start', // Ball at start
             boxShadow: 'none'
          }}
        >
             <div className="w-8 h-8 bg-indigo-400 rounded-full shadow-[0_0_20px_rgba(129,140,248,0.8)]" />
        </motion.div>
        <p className="absolute bottom-4 text-white/50 text-sm">원을 따라 움직이세요</p>
      </div>
    );
  }

  // Left-Right Animation
  if (type === ExerciseType.LEFT_RIGHT) {
    return (
      <div className="w-full h-64 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center">
         <div className="absolute w-4/5 h-0.5 bg-slate-700" />
         <motion.div
          className="w-8 h-8 bg-rose-400 rounded-full shadow-[0_0_20px_rgba(251,113,133,0.8)] z-10"
          animate={{
            x: ["-120px", "120px", "-120px"],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.5, 1]
          }}
        />
         <p className="absolute bottom-4 text-white/50 text-sm">좌우 끝까지 보세요</p>
      </div>
    );
  }

  // Random Animation
  if (type === ExerciseType.RANDOM) {
     return (
      <div className="w-full h-64 bg-slate-900 rounded-3xl relative overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-4 gap-4 opacity-10">
             {Array.from({length: 24}).map((_, i) => <div key={i} className="border border-white rounded-lg"></div>)}
        </div>
        
        <motion.div
          className="w-8 h-8 bg-teal-400 rounded-full shadow-[0_0_20px_rgba(45,212,191,0.8)] z-10"
          animate={{
            x: randomPositions.map(p => p.x),
            y: randomPositions.map(p => p.y),
            scale: [1, 1.2, 0.9, 1.1, 1]
          }}
          transition={{
            duration: 20, // Total time for sequence
            repeat: Infinity,
            ease: "easeInOut",
            times: randomPositions.map((_, i) => i / randomPositions.length)
          }}
        />
        <p className="absolute bottom-4 text-white/50 text-sm">공을 놓치지 마세요</p>
      </div>
     );
  }

  // Focus Change Animation
  if (type === ExerciseType.FOCUS_CHANGE) {
    return (
      <div className="w-full h-64 bg-slate-100 rounded-3xl relative flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-12 gap-4 opacity-10 pointer-events-none">
             {Array.from({length: 144}).map((_, i) => <div key={i} className="bg-slate-900 rounded-full w-1 h-1"></div>)}
        </div>
        
        <motion.div
          className="bg-primary-500 rounded-full flex items-center justify-center shadow-xl z-10"
          animate={{
            width: ["20px", "120px", "20px"],
            height: ["20px", "120px", "20px"],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-2 h-2 bg-white rounded-full" />
        </motion.div>
         <p className="absolute bottom-4 text-slate-500 text-sm font-medium">원(손가락)에 초점을 맞추세요</p>
      </div>
    );
  }

  // Blinking
  if (type === ExerciseType.BLINKING) {
    return (
      <div className="w-full h-64 bg-primary-50 rounded-3xl flex flex-col items-center justify-center gap-6">
        <motion.div
          className="w-32 h-20 bg-slate-800 rounded-[50%]"
          animate={{
            scaleY: [1, 0.1, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            times: [0, 0.5, 1],
            ease: "easeInOut"
          }}
        />
         <p className="text-primary-800 font-semibold animate-pulse">눈을 감았다가... 뜨세요</p>
      </div>
    );
  }

    // 20-20-20 & Palming (Generic Relaxing)
    return (
      <div className="w-full h-64 bg-emerald-900 rounded-3xl flex flex-col items-center justify-center relative overflow-hidden">
        <motion.div 
            className="absolute inset-0 bg-gradient-to-br from-emerald-800 to-emerald-950"
        />
        <motion.div
            className="w-48 h-48 bg-emerald-500/20 rounded-full absolute blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="relative z-10 text-center p-6">
            <h3 className="text-2xl text-emerald-100 font-bold mb-2">휴식 중</h3>
            <p className="text-emerald-200/80">편안하게 호흡하며 지시에 따르세요</p>
        </div>
      </div>
    );
};