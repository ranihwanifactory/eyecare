import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { ExerciseDetail } from './pages/ExerciseDetail';

// Wrapper to pass route props to Layout
const LayoutWrapper: React.FC<{children: React.ReactNode, installPrompt: any}> = ({ children, installPrompt }) => {
    const location = useLocation();
    const isHome = location.pathname === '/';
    
    const handleInstall = () => {
        if (installPrompt) {
            installPrompt.prompt();
            installPrompt.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                }
            });
        }
    };

    return (
        <Layout 
            showBack={!isHome} 
            canInstall={!!installPrompt} 
            onInstall={handleInstall}
        >
            {children}
        </Layout>
    );
};

export default function App() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <HashRouter>
      <LayoutWrapper installPrompt={deferredPrompt}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/exercise/:id" element={<ExerciseDetail />} />
        </Routes>
      </LayoutWrapper>
    </HashRouter>
  );
}