import React, { useState, useEffect, useCallback, useRef } from 'react';
import Lottie from 'lottie-react';
import { Page, Language, SessionMode, SessionState } from './types';
import { COLORS, Icons } from './constants';
import LanguageSelection from './components/LanguageSelection';
import Session from './components/Session';
import SetupTitle from './components/SetupTitle';
import HomeAnimatedTitles from './components/HomeAnimatedTitles';
import Koala_1 from './Illustrations/Koala_1';
import KoalasGlassesOnHead from './Illustrations/Koalas_glasses_on_head_1';
import Koalas_bottom_1 from './Illustrations/Koalas_bottom_1';
import { playNav, playTap, playPageTransition, playHomeEntryPresence } from './services/uiAudioService';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('HOME');
  const [prevPage, setPrevPage] = useState<Page | null>(null);
  const [nextPage, setNextPage] = useState<Page | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isKoalaButtonPressed, setIsKoalaButtonPressed] = useState(false);
  const [lottieData, setLottieData] = useState<any>(null);
  const [lottieError, setLottieError] = useState(false);
  const hasInteractedRef = useRef(false);
  
  const [session, setSession] = useState<SessionState>({
    targetLang: Language.SPANISH,
    rootLang: Language.ENGLISH,
    currentPhraseIndex: 0,
    mode: SessionMode.DEFAULT,
    playbackRate: 1.0
  });

  const [knownLang, setKnownLang] = useState<Language>(Language.ENGLISH);
  const [targetLang, setTargetLang] = useState<Language>(Language.SPANISH);

  // Attempt to load Koalas_flying.json
  useEffect(() => {
    fetch('./Illustrations/Koalas_flying.json')
      .then(response => {
        if (!response.ok) throw new Error('Not found');
        return response.json();
      })
      .then(data => {
        // Safety check: ensure JSON data is a valid Lottie object
        if (data && typeof data === 'object' && Array.isArray(data.layers)) {
          setLottieData(data);
        } else {
          setLottieError(true);
        }
      })
      .catch(() => setLottieError(true));
  }, []);

  // Global Interaction Listener for Audio Context Resume
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
      }
    };
    window.addEventListener('pointerdown', handleFirstInteraction);
    return () => window.removeEventListener('pointerdown', handleFirstInteraction);
  }, []);

  useEffect(() => {
    playHomeEntryPresence();
  }, []);

  useEffect(() => {
    if (currentPage === 'SPLASH' && !isTransitioning) {
      const timer = setTimeout(() => {
        handleNavigate('SESSION');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, isTransitioning]);

  const handleNavigate = useCallback((next: Page) => {
    if (isTransitioning) return;
    
    const isSessionTransition = next === 'SESSION' || currentPage === 'SESSION';
    if (isSessionTransition) {
      setCurrentPage(next);
      return;
    }
    setPrevPage(currentPage);
    setNextPage(next);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentPage(next);
      setPrevPage(null);
      setNextPage(null);
      setIsTransitioning(false);
    }, 1200);
  }, [currentPage, isTransitioning]);

  const handleSelectKnown = (lang: Language) => {
    playTap();
    setKnownLang(lang);
  };

  const handleSelectTarget = (lang: Language) => {
    playTap();
    setTargetLang(lang);
  };

  const startSession = () => {
    if (knownLang && targetLang) {
      playTap();
      setSession(prev => ({ 
        ...prev, 
        targetLang: targetLang, 
        rootLang: knownLang 
      }));
      handleNavigate('READY');
    }
  };

  const handleKoalaButtonPress = () => {
    playTap();
    setIsKoalaButtonPressed(true);
  };

  const handleKoalaButtonRelease = () => {
    if (isKoalaButtonPressed) {
      setIsKoalaButtonPressed(false);
      handleNavigate('PARTNER');
    }
  };

  const renderPageContent = (page: Page | null) => {
    if (!page) return null; // Safe check for undefined/null page during transition

    switch (page) {
      case 'HOME':
        return (
          <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
            {/* Koala Element - Attempt Lottie, fallback to Koala_1. Sized 100% bigger (30vh) */}
            <div className="absolute top-[10vh] z-10 h-[30vh] w-[30vh] animate-float flex items-center justify-center">
              {lottieData && !lottieError ? (
                <Lottie animationData={lottieData} loop={true} className="w-full h-full" />
              ) : (
                <Koala_1 className="w-full h-full" />
              )}
            </div>

            {/* Central Content Stack */}
            <div className="relative z-20 w-full h-full px-[3vw] flex flex-col items-center justify-center">
              <HomeAnimatedTitles />
              
              <button 
                onPointerDown={handleKoalaButtonPress}
                onPointerUp={handleKoalaButtonRelease}
                onPointerLeave={() => setIsKoalaButtonPressed(false)}
                className="btn-setup-primary animate-button-entry mt-20 px-16 py-5 rounded-full text-2xl font-extrabold tracking-tight border border-white/10 transition-all duration-100"
                style={{
                  backgroundColor: isKoalaButtonPressed ? COLORS.WHITE : COLORS.BRAND_BLUE,
                  color: isKoalaButtonPressed ? COLORS.BRAND_BLUE : COLORS.WHITE,
                }}
              >
                <span className="btn-text-glow">koalas</span>
              </button>
            </div>

            {/* Bottom Social Links */}
            <div className="absolute bottom-12 left-0 right-0 flex justify-center items-center space-x-4 pointer-events-auto z-10">
              <a 
                onPointerDown={() => playTap()} 
                href="https://www.instagram.com/fluentfast_koalas/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-tactile text-white active:scale-110 w-[22px] h-[22px] flex items-center justify-center social-icon-animate"
                style={{ animationDelay: '1.8s' }}
              >
                <Icons.Instagram />
              </a>
              <a 
                onPointerDown={() => playTap()} 
                href="https://www.tiktok.com/@fluentfast_koalas" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-tactile text-white active:scale-110 w-[22px] h-[22px] flex items-center justify-center social-icon-animate"
                style={{ animationDelay: '2.5s' }}
              >
                <Icons.TikTok />
              </a>
            </div>
          </div>
        );
      case 'PARTNER':
        return (
          <div className="relative flex flex-col items-center justify-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
            <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none flex justify-center items-end opacity-100 animate-koala-up">
              <KoalasGlassesOnHead className="w-full h-auto max-h-[30vh]" />
            </div>

            <div className="relative z-10 flex flex-col items-center space-y-8 p-6">
              <SetupTitle text="2-PLAYER" baselineSize={72} />
              <h2 className="text-xl font-medium text-white opacity-70 uppercase tracking-widest mt-4">Koala Conversations</h2>
              <button 
                onPointerDown={() => { playTap(); handleNavigate('LANGUAGES'); }}
                className="btn-setup-primary mt-12 px-20 py-5 rounded-full text-2xl font-extrabold tracking-widest uppercase border border-white/10"
              >
                <span className="btn-text-glow">Next</span>
              </button>
            </div>
          </div>
        );
      case 'LANGUAGES':
        return (
          <LanguageSelection 
            known={knownLang}
            target={targetLang}
            onSelectKnown={handleSelectKnown}
            onSelectTarget={handleSelectTarget}
            onConfirm={startSession}
          />
        );
      case 'READY':
        return (
          <div className="relative flex flex-col items-center h-full w-full overflow-hidden" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
            <div className="absolute bottom-0 left-0 right-0 z-0 pointer-events-none flex justify-center items-end px-6">
              <Koalas_bottom_1 className="w-[90vw] h-auto max-h-[40vh] opacity-100" />
            </div>

            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6">
              <SetupTitle text="READY?" baselineSize={100} />
              <button 
                onPointerDown={() => { playTap(); handleNavigate('SPLASH'); }}
                className="btn-setup-primary px-24 py-6 rounded-full text-4xl font-extrabold flex items-center mt-12 border border-white/10"
              >
                <span className="btn-text-glow flex items-center">Start <span className="ml-6 opacity-40">→</span></span>
              </button>
            </div>
            
            <div className="h-[40vh] w-full pointer-events-none shrink-0" />
          </div>
        );
      case 'SPLASH':
        return (
          <div className="h-full w-full flex flex-col">
            <div className="flex-1 flex items-center justify-center rotate-180" style={{ backgroundColor: COLORS.BRAND_BLUE }}>
              <h1 className="text-5xl font-extrabold text-white tracking-tighter uppercase">FLUENTFAST</h1>
            </div>
            <div className="h-[8%] bg-black flex items-center justify-center"></div>
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: COLORS.WHITE }}>
              <h1 className="text-5xl font-extrabold text-[#6865F0] tracking-tighter uppercase">FLUENTFAST</h1>
            </div>
          </div>
        );
      case 'SESSION':
        return (
          <Session 
            state={session} 
            onUpdate={(u) => setSession(s => ({ ...s, ...u }))}
            onExit={() => {
              setSession(prev => ({ ...prev, currentPhraseIndex: 0 }));
              handleNavigate('HOME');
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="swipe-container">
      {isTransitioning && prevPage && (
        <div className="page-surface animate-swipe-exit">
          {renderPageContent(prevPage)}
        </div>
      )}
      <div className={`page-surface ${isTransitioning ? 'animate-swipe-enter' : ''}`}>
        {renderPageContent(isTransitioning ? nextPage : currentPage)}
      </div>
    </div>
  );
};

export default App;
