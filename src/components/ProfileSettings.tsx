import React, { useState } from 'react';
import { 
  Heart, Calendar, Camera, RefreshCw, Sparkles, 
  ChevronRight, Award, Quote, Save, CheckCircle
} from 'lucide-react';
import { CoupleProfile } from '../types';

interface ProfileSettingsProps {
  profile: CoupleProfile;
  daysCounter: number;
  onUpdateProfile: (newProfile: CoupleProfile) => void;
  onResetAllData: () => void;
}

export default function ProfileSettings({ 
  profile, daysCounter, onUpdateProfile, onResetAllData 
}: ProfileSettingsProps) {
  const [partner1, setPartner1] = useState(profile.partner1);
  const [partner2, setPartner2] = useState(profile.partner2);
  const [anniversaryDate, setAnniversaryDate] = useState(profile.anniversaryDate);
  const [photoUrl, setPhotoUrl] = useState(profile.profilePhoto);
  
  const [isSavedRecently, setIsSavedRecently] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);

  const loveQuotes = [
    { text: "O amor não consiste em olhar um para o outro, mas sim em olhar juntos na mesma direção.", writer: "Antoine de Saint-Exupéry" },
    { text: "Estar com você faz qualquer dia comum parecer um final de semana ensolarado.", writer: "Anônimo" },
    { text: "Cultivar nossa conexão diária é a maior e mais linda declaração de fidelidade ao nosso futuro.", writer: "Diário do Casal" },
    { text: "Você é a página mais bonita que o destino escreveu na minha vida.", writer: "Clarice Lispector" }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      partner1: partner1.trim() || 'Parceiro 1',
      partner2: partner2.trim() || 'Parceiro 2',
      anniversaryDate: anniversaryDate || '2024-06-12',
      profilePhoto: photoUrl || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600'
    });
    setIsSavedRecently(true);
    setTimeout(() => setIsSavedRecently(false), 3000);
  };

  const milestones = [
    { id: 1, title: 'Primeiro Mês', days: 30, desc: 'Frio na barriga e as primeiras confissões.' },
    { id: 2, title: 'Cem Dias Juntos', days: 100, desc: 'O início de uma bela sintonia diária.' },
    { id: 3, title: 'Um Ano de União', days: 365, desc: '365 dias celebrando cumplicidade.' },
    { id: 4, title: 'Mil Dias', days: 1000, desc: 'Fortalecidos pelo tempo e respeito mútuo.' }
  ];

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-28 animate-fade-in space-y-5">
      {/* Upper overview section with longevity counter */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 relative overflow-hidden text-center">
        {/* Glow backdrop decorative */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-pink-100/10 rounded-full blur-2xl -z-10" />
        
        {/* Profile Picture Circle and Camera Trigger */}
        <div className="relative w-24 h-24 mx-auto mb-4 group">
          <img 
            src={photoUrl} 
            alt="Foto do Casal" 
            className="w-full h-full object-cover rounded-full border-4 border-pink-100 shadow-sm transition-transform duration-300 group-hover:scale-102"
          />
          <div className="absolute bottom-0 right-0 p-1.5 bg-pink-500 rounded-full text-white shadow-md cursor-pointer hover:bg-pink-600 active:scale-90 transition-colors">
            <Camera className="w-3.5 h-3.5" />
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-xl font-bold font-sans text-gray-800 leading-tight">
            {profile.partner1} & {profile.partner2}
          </h2>
        </div>
      </section>

      {/* LOVE QUOTES INTERACTIVE TIMELINE CAROUSEL */}
      <div 
        onClick={() => setQuoteIndex(prev => (prev + 1) % loveQuotes.length)}
        className="bg-gradient-to-r from-pink-50/40 to-rose-50/20 p-5 rounded-2xl border border-pink-200/20 cursor-pointer hover:bg-pink-50/50 transition-colors shadow-xs relative overflow-hidden"
      >
        <Quote className="absolute right-4 top-3 text-pink-300/40 w-10 h-10 select-none pointer-events-none" />
        <div className="flex items-center gap-2 text-pink-600 text-xs font-bold mb-2">
          <Quote className="w-3.5 h-3.5" />
          <span>Inspiração do Dia (Clique para ver outra)</span>
        </div>
        <p className="text-xs font-serif italic text-gray-700 leading-relaxed pr-6">
          "{loveQuotes[quoteIndex].text}"
        </p>
        <span className="text-[10px] font-bold text-gray-400 block mt-2 text-right">
          — {loveQuotes[quoteIndex].writer}
        </span>
      </div>

      {/* SETTINGS CARD FORM */}
      <section className="bg-white p-5 rounded-3xl border border-pink-50 shadow-sm">
        <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-pink-600" />
          <span>Configurações das Nossas Datas</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Nome do Parceiro 1:
              </label>
              <input
                type="text"
                value={partner1}
                onChange={(e) => setPartner1(e.target.value)}
                placeholder="Ex: João"
                className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 hover:border-pink-200 focus:border-pink-400 focus:outline-none p-2.5 rounded-xl transition-all"
                id="partner-1-name-input"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Nome do Parceiro 2:
              </label>
              <input
                type="text"
                value={partner2}
                onChange={(e) => setPartner2(e.target.value)}
                placeholder="Ex: Maria"
                className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 hover:border-pink-200 focus:border-pink-400 focus:outline-none p-2.5 rounded-xl transition-all"
                id="partner-2-name-input"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              Data de Início do Namoro / Casamento:
            </label>
            <input
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 focus:border-pink-400 focus:outline-none p-2.5 rounded-xl transition-all"
              id="anniversary-date-input"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
              URL da Foto do Casal (Avatar Principal):
            </label>
            <input
              type="url"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
              placeholder="Cole a URL de uma foto bacana..."
              className="w-full text-xs font-medium text-gray-700 bg-gray-50 border border-gray-100 focus:border-pink-400 focus:outline-none p-2.5 rounded-xl transition-all"
              id="profile-photo-url-input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs rounded-xl shadow-xs hover:opacity-95 transition-all flex items-center justify-center gap-1.5"
            id="save-profile-settings-btn"
          >
            {isSavedRecently ? (
              <>
                <CheckCircle className="w-4 h-4 stroke-[2.5]" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </>
            )}
          </button>
        </form>
      </section>

      {/* SYSTEM OPERATIONS RESET BTN */}
      <section className="bg-red-50/30 p-4 rounded-2xl border border-red-100 text-center space-y-2">
        <div className="text-xs font-bold text-red-800">Zona de Perigo</div>
        <p className="text-[10px] text-gray-400 leading-tight">
          Apaga todas as suas novas memórias criadas e redefine o perfil e as opções de roteiro para o estado original padrão do mockup!
        </p>
        <button
          onClick={() => {
            if (window.confirm("Atenção! Isso apagará todas as suas novas memórias criadas no Diário e resetará tudo para os valores iniciais do protótipo. Confirmar?")) {
              onResetAllData();
            }
          }}
          className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 border border-red-200 text-xs font-bold rounded-full transition-colors inline-flex items-center gap-1.5"
          id="danger-zone-reset-btn"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Resetar para Estado do Mockup</span>
        </button>
      </section>
    </div>
  );
}
