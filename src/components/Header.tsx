import React from 'react';
import { Heart, Settings, Calendar } from 'lucide-react';
import { CoupleProfile } from '../types';

interface HeaderProps {
  profile: CoupleProfile;
  daysCounter: number;
  onOpenSettings: () => void;
}

export default function Header({ profile, daysCounter, onOpenSettings }: HeaderProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/85 backdrop-blur-xl shadow-sm border-b border-pink-50/50 no-print">
      <div className="max-w-xl mx-auto flex justify-between items-center px-6 h-16 w-full">
        {/* Brand logo & icon */}
        <div className="flex items-center gap-2 select-none group cursor-pointer">
          <div className="relative">
            <Heart className="w-6 h-6 text-pink-600 fill-pink-600 animate-pulse transition-transform group-hover:scale-110 duration-300" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-400 rounded-full animate-ping"></span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans text-lg font-bold text-pink-700 tracking-tight leading-none">
              Diário do Casal
            </h1>
            <span className="font-sans text-[10px] text-gray-500 font-medium">
              {profile.partner1} & {profile.partner2}
            </span>
          </div>
        </div>

        {/* Right activities / actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="p-2 text-gray-500 hover:text-pink-600 hover:bg-pink-50/80 rounded-full transition-all active:scale-90"
            title="Configurações do Casal"
            id="settings-trigger"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
