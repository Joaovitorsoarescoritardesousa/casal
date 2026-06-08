import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Home, BookOpen, Sparkles, User, Settings, 
  ArrowRight, Landmark, Gift, MessageCircleHeart, Info 
} from 'lucide-react';
import { DiaryEntry, CoupleProfile } from './types';
import { 
  INITIAL_PROFILE, INITIAL_DIARY_ENTRIES 
} from './data';

// Component Imports
import Header from './components/Header';
import NewDiaryWizard from './components/NewDiaryWizard';
import DiaryHistory from './components/DiaryHistory';
import DateWheel from './components/DateWheel';
import ProfileSettings from './components/ProfileSettings';

export default function App() {
  // State Initialization from localStorage or presets
  const [profile, setProfile] = useState<CoupleProfile>(() => {
    const stored = localStorage.getItem('couple_profile');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* ignore */ }
    }
    return INITIAL_PROFILE;
  });

  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const stored = localStorage.getItem('diary_entries');
    if (stored) {
      try { return JSON.parse(stored); } catch (e) { /* ignore */ }
    }
    return INITIAL_DIARY_ENTRIES;
  });

  const [currentTab, setCurrentTab] = useState<'inicio' | 'diario' | 'planos' | 'perfil'>('inicio');
  const [activeWizard, setActiveWizard] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Synchronize with localStorage
  useEffect(() => {
    localStorage.setItem('couple_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('diary_entries', JSON.stringify(entries));
  }, [entries]);

  // Days longevity calculation since the relationship anniversary date
  const calculateDaysCounter = (dateStr: string) => {
    const anniversary = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    // Reset time for full days check count
    today.setHours(23, 59, 59, 999);
    
    const diffMs = today.getTime() - anniversary.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const daysCounter = calculateDaysCounter(profile.anniversaryDate);

  // Automatically formatted current date for welcome page
  const [formattedToday, setFormattedToday] = useState('');
  useEffect(() => {
    const now = new Date();
    const ptDate = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    // Capitalize first letter (e.g. Segunda-feira)
    const capitalized = ptDate.charAt(0).toUpperCase() + ptDate.slice(1);
    setFormattedToday(capitalized);
  }, []);

  // Save new completed diary entry
  const handleSaveNewEntry = (
    newPayload: Omit<DiaryEntry, 'id' | 'date' | 'formattedDate' | 'formattedTime'>
  ) => {
    const now = new Date();
    const capitalizedDate = now.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).replace(/^\w/, (c) => c.toUpperCase());

    const formattedTime = now.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const fullEntry: DiaryEntry = {
      ...newPayload,
      id: `diary-${Date.now()}`,
      date: now.toISOString(),
      formattedDate: capitalizedDate,
      formattedTime: formattedTime
    };

    setEntries(prev => [fullEntry, ...prev]);
    setActiveWizard(false);
    setCurrentTab('diario');
    
    // Trigger celebratory success feedback!
    setSuccessToast("Sua memória diária de amor foi salva com sucesso! ❤️");
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Delete an existing entry
  const handleDeleteEntry = (id: string) => {
    setEntries(prev => prev.filter(e => e.id !== id));
    setSuccessToast("Registro de diário removido.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Profile fields updating
  const handleUpdateProfile = (newProfile: CoupleProfile) => {
    setProfile(newProfile);
  };

  // Full reset back to high fidelity mockups
  const handleResetAllData = () => {
    setProfile(INITIAL_PROFILE);
    setEntries(INITIAL_DIARY_ENTRIES);
    setCurrentTab('inicio');
    setActiveWizard(false);
    setSuccessToast("Os dados foram resetados para o protótipo inicial.");
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans select-none overflow-x-hidden pb-safe">
      {/* Dynamic Toast Feedback overlay */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-4 right-4 max-w-sm mx-auto bg-gray-900 border border-gray-800 text-white text-xs font-semibold text-center py-3 px-5 rounded-full z-50 shadow-xl flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-pink-500 text-pink-500 animate-pulse" />
            <span>{successToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Area */}
      <Header 
        profile={profile} 
        daysCounter={daysCounter} 
        onOpenSettings={() => {
          setActiveWizard(false);
          setCurrentTab('perfil');
          // Smooth scroll to profile inputs if needed
          setTimeout(() => {
            document.getElementById('partner-1-name-input')?.focus();
          }, 100);
        }}
      />

      {/* Main Container Stage */}
      <main className="flex-grow pt-20 pb-28">
        <AnimatePresence mode="wait">
          {activeWizard ? (
            /* Multi-step diary questionnaire wizard overriding tabs */
            <motion.div
              key="wizard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <NewDiaryWizard 
                onSave={handleSaveNewEntry}
                onCancel={() => setActiveWizard(false)}
              />
            </motion.div>
          ) : (
            /* Standard Bottom Navigation Tabs stage views */
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="stage-transition"
            >
              {currentTab === 'inicio' && (
                /* Home View Screen 1 precisely matching holding hands sunset artwork */
                <div className="w-full max-w-xl mx-auto px-6 text-center space-y-7">
                  {/* Hero Ambient image element inside floated romantic card */}
                  <div className="relative w-full max-w-[325px] aspect-square mx-auto rounded-[48px] overflow-hidden shadow-lg animate-float mt-5 border-4 border-white">
                    {/* Golden sunset couple artwork */}
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD25_qEj_TYXx3C5il1Xn_ZMxYv8nHPD4OLbqb8EagxCgW3nEPdubmLO98o3kmj2iTy1qKK4MUOToQObxuqnyI1HvplV8rTaj06EQD5Z3iwLTUIruYwld-FOHCWHN191JyxBgkNZSlmffQPyJBhEdUY2tfGZIyi8VKSCLs-b9dTBSCbN5Q-pKGvos8DswqkYYO0KH8IMUWcAL7mDIqDvPtAN_JqvBZe0oAdv59kzKQg__JTNWNw4FC82mhkrAawSw7XbIPQkqIM9N49" 
                      alt="Casal de Mãos Dadas no Pôr do Sol" 
                      className="w-full h-full object-cover select-none"
                    />
                    {/* Shadow overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Date badge & Header texts */}
                  <div className="space-y-3 px-2">
                    <p className="font-sans text-[11px] font-bold text-pink-600 uppercase tracking-widest leading-none">
                      {formattedToday || 'Segunda-feira, 8 de Junho de 2026'}
                    </p>
                    <h2 className="text-3xl font-black text-gray-800 font-sans tracking-tight leading-tight px-4">
                      Seu dia, sua conexão
                    </h2>
                    <p className="text-sm font-medium text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                      Cultive memórias preciosas e fortaleça o laço entre vocês, uma página por vez.
                    </p>
                  </div>

                  {/* Primary Call to Action Button */}
                  <div className="w-full max-w-sm mx-auto space-y-4">
                    <button
                      onClick={() => setActiveWizard(true)}
                      className="w-full h-15 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold text-sm tracking-wide shadow-md shadow-pink-200/50 flex transition-all items-center justify-center gap-2 group"
                      id="start-today-diary-btn"
                    >
                      <span>Começar Diário de Hoje</span>
                      <ArrowRight className="w-4 h-4 translate-x-0 group-hover:translate-x-1 transition-transform stroke-[2.5]" />
                    </button>

                    {/* Quick navigation split metrics */}
                    <div className="grid grid-cols-2 gap-3.5">
                      <button
                        onClick={() => {
                          setCurrentTab('diario');
                        }}
                        className="bg-white hover:bg-pink-50/20 active:scale-95 border border-pink-50/40 p-4 rounded-3xl flex flex-col items-center text-center shadow-xs transition-all gap-2"
                        id="open-moments-shortcut"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                          <Sparkles className="w-5 h-5 fill-blue-500/10" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Momentos</span>
                      </button>

                      <button
                        onClick={() => {
                          setCurrentTab('diario');
                        }}
                        className="bg-white hover:bg-pink-50/20 active:scale-95 border border-pink-50/40 p-4 rounded-3xl flex flex-col items-center text-center shadow-xs transition-all gap-2"
                        id="open-memories-shortcut"
                      >
                        <div className="w-10 h-10 rounded-full bg-pink-50 text-pink-600 flex items-center justify-center">
                          <BookOpen className="w-5 h-5 fill-pink-500/10" />
                        </div>
                        <span className="text-xs font-bold text-gray-700">Memórias</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentTab === 'diario' && (
                /* Diary list and full details view */
                <DiaryHistory 
                  entries={entries}
                  onDeleteEntry={handleDeleteEntry}
                  onBackToHome={() => setCurrentTab('inicio')}
                />
              )}

              {currentTab === 'planos' && (
                /* Plan / Dating Picker spot wheel */
                <DateWheel />
              )}

              {currentTab === 'perfil' && (
                /* Profile view and data parameters configuration */
                <ProfileSettings 
                  profile={profile}
                  daysCounter={daysCounter}
                  onUpdateProfile={handleUpdateProfile}
                  onResetAllData={handleResetAllData}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FLOAT BACKDROP BOTTOM TAB NAVIGATION BAR */}
      {!activeWizard && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-pink-100/30 shadow-[0px_-8px_32px_rgba(0,0,0,0.03)] rounded-t-[32px] no-print">
          <div className="max-w-xl mx-auto flex justify-around items-center h-20 px-4 pb-safe">
            {/* INICIO TAB */}
            <button
              onClick={() => setCurrentTab('inicio')}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative ${
                currentTab === 'inicio' ? 'text-pink-600 font-bold scale-102' : 'text-gray-400 font-medium hover:text-pink-500'
              }`}
              id="navigation-tab-inicio"
            >
              <Home className={`w-5 h-5 ${currentTab === 'inicio' ? 'fill-pink-500/5 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-wide">Início</span>
              {currentTab === 'inicio' && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-pink-600 rounded-full" />
              )}
            </button>

            {/* DIARIO TAB */}
            <button
              onClick={() => setCurrentTab('diario')}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative ${
                currentTab === 'diario' ? 'text-pink-600 font-bold scale-102' : 'text-gray-400 font-medium hover:text-pink-500'
              }`}
              id="navigation-tab-diario"
            >
              <BookOpen className={`w-5 h-5 ${currentTab === 'diario' ? 'fill-pink-500/5 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-wide">Diário</span>
              {currentTab === 'diario' && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-pink-600 rounded-full" />
              )}
            </button>

            {/* PLANOS TAB */}
            <button
              onClick={() => setCurrentTab('planos')}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative ${
                currentTab === 'planos' ? 'text-pink-600 font-bold scale-102' : 'text-gray-400 font-medium hover:text-pink-500'
              }`}
              id="navigation-tab-planos"
            >
              <Sparkles className={`w-5 h-5 ${currentTab === 'planos' ? 'fill-pink-500/5 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-wide">Planos</span>
              {currentTab === 'planos' && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-pink-600 rounded-full" />
              )}
            </button>

            {/* PERFIL TAB */}
            <button
              onClick={() => setCurrentTab('perfil')}
              className={`flex flex-col items-center justify-center gap-1 min-w-[64px] transition-all relative ${
                currentTab === 'perfil' ? 'text-pink-600 font-bold scale-102' : 'text-gray-400 font-medium hover:text-pink-500'
              }`}
              id="navigation-tab-perfil"
            >
              <User className={`w-5 h-5 ${currentTab === 'perfil' ? 'fill-pink-500/5 stroke-[2.5]' : ''}`} />
              <span className="text-[10px] tracking-wide">Perfil</span>
              {currentTab === 'perfil' && (
                <span className="absolute -bottom-1.5 w-1 h-1 bg-pink-600 rounded-full" />
              )}
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
