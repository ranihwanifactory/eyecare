import React, { useState, useEffect } from 'react';
import { Share2, Download, Check } from 'lucide-react';

export const SEOAndShare: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    // Logic to capture PWA install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '눈건강운동',
          text: '하루 5분, 눈의 피로를 푸는 눈건강운동 앱을 시작해보세요.',
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-40">
      {/* Install Button (Only shows if installable) */}
      {isInstallable && (
        <button
          onClick={handleInstallClick}
          className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:bg-slate-800 transition-transform hover:scale-105 flex items-center gap-2 group"
          aria-label="앱 설치하기"
        >
          <Download size={20} />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">앱 설치</span>
        </button>
      )}

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="bg-emerald-600 text-white p-4 rounded-full shadow-lg hover:bg-emerald-700 transition-transform hover:scale-105 relative"
        aria-label="친구에게 공유하기"
      >
        {showCopied ? <Check size={20} /> : <Share2 size={20} />}
        {showCopied && (
            <span className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                링크 복사됨
            </span>
        )}
      </button>
    </div>
  );
};