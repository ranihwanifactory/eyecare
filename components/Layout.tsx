import React from 'react';
import { Share2, Download, Menu, ArrowLeft, Trophy } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  title?: string;
  onInstall?: () => void;
  canInstall?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBack = false, 
  title = "EyeZen",
  onInstall,
  canInstall
}) => {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EyeZen - 눈 건강 운동',
          text: '하루 5분, 당신의 눈 건강을 위한 습관 EyeZen과 함께하세요.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      alert('이 브라우저에서는 공유 기능을 지원하지 않습니다. URL을 복사해서 전달해주세요!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col max-w-md mx-auto shadow-2xl overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-slate-700" />
            </button>
          ) : (
             <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                <Trophy className="w-5 h-5 text-white" />
             </div>
          )}
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h1>
        </div>
        
        <div className="flex items-center gap-2">
          {canInstall && (
            <button 
              onClick={onInstall}
              className="p-2 hover:bg-primary-50 text-primary-600 rounded-full transition-colors"
              title="앱 설치"
            >
              <Download className="w-5 h-5" />
            </button>
          )}
          <button 
            onClick={handleShare}
            className="p-2 hover:bg-slate-100 text-slate-600 rounded-full transition-colors"
            title="공유하기"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Simple Footer Text */}
      <footer className="py-6 text-center text-slate-400 text-xs">
        <p>© 2024 EyeZen. 당신의 눈 건강을 응원합니다.</p>
      </footer>
    </div>
  );
};