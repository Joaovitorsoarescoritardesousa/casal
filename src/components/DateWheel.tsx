import React, { useState } from 'react';
import { 
  Sparkles, Plus, Trash2, ChevronRight, MapPin, Play, RotateCw, Heart, X 
} from 'lucide-react';
import { DateOption } from '../types';
import { INITIAL_DATE_OPTIONS } from '../data';

export default function DateWheel() {
  const [options, setOptions] = useState<DateOption[]>(INITIAL_DATE_OPTIONS);
  const [selectedOptionName, setSelectedOptionName] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinDeg, setSpinDeg] = useState(0);
  
  // Custom spot entry state inputs
  const [newPlaceName, setNewPlaceName] = useState('');
  const [newPlaceEmoji, setNewPlaceEmoji] = useState('🍿');
  const [showAddForm, setShowAddForm] = useState(false);

  // Success romantic banners feedback
  const [romanticAlert, setRomanticAlert] = useState<string | null>(null);

  // Movie activities list
  const movieActivities = [
    { id: '1', title: 'Maratona de Séries', desc: 'Escolher um seriado novo para devorar juntinhos.', emoji: '🍿' },
    { id: '2', title: 'Ver um filme de terror / suspense', desc: 'Debaixo das cobertas segurando a mão bem apertado.', emoji: '🎬' },
    { id: '3', title: 'Ficar no TikTok segurando a mão', desc: 'Descanso total rolando o feed em parceria carinhosa.', emoji: '📱' },
    { id: '4', title: 'Jogar videogame juntos', desc: 'Disputa de jogos divertidos ou cooperativos na TV.', emoji: '🎮' }
  ];

  const handleManualSelect = (name: string) => {
    if (isSpinning) return;
    setSelectedOptionName(name);
    setRomanticAlert(`Destino selecionado: "${name}"! Um ótimo programa para curtirem juntinhos! ❤️`);
  };

  const handleSpinRoulette = () => {
    if (isSpinning || options.length === 0) return;
    
    setIsSpinning(true);
    setSelectedOptionName('Sorteando...');
    setRomanticAlert(null);

    // Calculate rotation degree
    const randomOffset = Math.floor(Math.random() * 360);
    const totalRotation = spinDeg + 1440 + randomOffset;
    setSpinDeg(totalRotation);

    // Simulate roulette slot result delay (2.2 seconds)
    setTimeout(() => {
      const winnerIndex = Math.floor(Math.random() * options.length);
      const winner = options[winnerIndex];
      
      setSelectedOptionName(winner.name);
      setIsSpinning(false);
      setRomanticAlert(`Amor! O destino decretado pela Roleta foi: "${winner.name}" ${winner.emoji}! Partiu rolê? 💖`);

      // Auto smooth scroll to winner card if present
      const element = document.getElementById(`option-card-${winner.name.toLowerCase().replace(/\s+/g, '-')}`);
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 2000);
  };

  const handleAddCustomPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaceName.trim()) return;

    const newOption: DateOption = {
      id: Date.now().toString(),
      name: newPlaceName.trim(),
      emoji: newPlaceEmoji,
      icon: 'MapPin'
    };

    setOptions(prev => [...prev, newOption]);
    setNewPlaceName('');
    setNewPlaceEmoji('🍿');
    setShowAddForm(false);
    setRomanticAlert(`Novo destino "${newOption.name}" adicionado ao banco de opções! 🎲`);
  };

  const handleDeletePlace = (id: string, name: string) => {
    setOptions(prev => prev.filter(o => o.id !== id));
    if (selectedOptionName === name) {
      setSelectedOptionName(null);
      setRomanticAlert(null);
    }
  };

  const getWinnerEmoji = () => {
    const matched = options.find(o => o.name === selectedOptionName);
    return matched ? matched.emoji : '🍽️';
  };

  // Skip from delete the 12 default options requested by user
  const originalIdsList = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-28 animate-fade-in">
      {/* Upper header section */}
      <section className="mb-6 text-center">
        <h2 className="text-2xl font-black text-gray-800 tracking-tight mb-1 leading-tight">
          Os pontos do rolê
        </h2>
        <p className="text-xs text-gray-400">Escolha onde jantar ou use nossa Roleta do Destino!</p>
      </section>

      {/* ROULETTE BOARD AND SPIN TRIGGER MODULE */}
      <section className="mb-6">
        <div className="bg-white rounded-[32px] p-6 shadow-sm border border-pink-50 text-center relative overflow-hidden">
          {/* Decorative glows */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-pink-100/10 rounded-full blur-2xl" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-blue-100/20 rounded-full blur-2xl" />
          
          <div className="relative z-10 space-y-5">
            {/* Round Slot Container with rotation animations */}
            <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
              {/* Outer circular indicator ring */}
              <div 
                className={`absolute inset-0 rounded-full border-4 border-dashed border-pink-200/50 ${
                  isSpinning ? 'animate-spin [animation-duration:4s]' : ''
                }`}
                style={{ transform: `rotate(${spinDeg}deg)`, transition: isSpinning ? 'transform 2s cubic-bezier(0.1, 0.8, 0.25, 1)' : 'none' }}
              />
              
              {/* Spinning Inner Wheel */}
              <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 relative shadow-inner">
                <span className="text-4xl filter drop-shadow-xs select-none">
                  {isSpinning ? '🎰' : getWinnerEmoji()}
                </span>
                {/* Pointer indicator arrow */}
                <div className="absolute -top-1.5 left-1 text-pink-500 animate-bounce text-xs">
                  ▼
                </div>
              </div>
            </div>

            {/* Current status display text */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-[10px] text-gray-400 uppercase tracking-widest leading-none">
                {isSpinning ? 'Sorteando destino...' : 'E o felizardo será...'}
              </h3>
              <p className="font-extrabold text-base text-pink-700 min-h-[24px]">
                {selectedOptionName || 'Deixe o destino escolher...'}
              </p>
            </div>

            {/* Spin Trigger Button */}
            <button
              onClick={handleSpinRoulette}
              disabled={isSpinning || options.length === 0}
              className={`bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3.5 rounded-full font-bold text-xs tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 mx-auto ${
                isSpinning || options.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-102 hover:shadow-pink-100 shadow-pink-200/30'
              }`}
              id="spin-roulette-btn"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>{isSpinning ? 'Sorteando...' : 'Girar Roleta do Destino'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ROMANTIC DIALOG FEEDBACK BANNER */}
      {romanticAlert && (
        <div className="bg-pink-50/50 p-4 rounded-2xl border border-pink-100 flex items-start gap-3 mb-6 animate-fade-in relative">
          <Heart className="w-5 h-5 text-pink-500 fill-pink-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-800 leading-snug">{romanticAlert}</p>
          </div>
          <button 
            onClick={() => setRomanticAlert(null)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* OPTIONS SELECTION GRID AND CARD CONTAINER */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-extrabold text-gray-800 text-xs uppercase tracking-wide">
            Pontos de Encontro ({options.length})
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="text-[10px] font-extrabold uppercase text-pink-600 hover:text-pink-700 flex items-center gap-1 bg-pink-50 px-3 py-1.5 rounded-full transition-colors"
            id="toggle-add-place-btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Adicionar Rolê</span>
          </button>
        </div>

        {/* Form to add custom dating options */}
        {showAddForm && (
          <form 
            onSubmit={handleAddCustomPlace}
            className="bg-white p-4 rounded-2xl border border-pink-50 shadow-xs space-y-3.5 animate-fade-in"
          >
            <div className="text-xs font-bold text-gray-750">Adicionar novo destino na Roleta:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Ex: Paris 6, Trailer da Praça..."
                value={newPlaceName}
                onChange={(e) => setNewPlaceName(e.target.value)}
                required
                className="col-span-1 sm:col-span-2 text-xs bg-gray-50 border border-gray-100 focus:border-pink-300 focus:outline-none p-2.5 rounded-xl text-gray-700 font-medium"
                id="new-place-name-input"
              />
              
              {/* Emoji selector dropdown */}
              <select
                value={newPlaceEmoji}
                onChange={(e) => setNewPlaceEmoji(e.target.value)}
                className="text-xs bg-gray-50 border border-gray-100 p-2.5 rounded-xl text-gray-700 focus:outline-none focus:border-pink-300 font-medium"
                id="new-place-emoji-select"
              >
                <option value="🍿">🍿 Cinema</option>
                <option value="🍝">🍝 Massa</option>
                <option value="🍽️">🍽️ Jantar</option>
                <option value="🍺">🍺 Cerveja</option>
                <option value="🍕">🍕 Pizza</option>
                <option value="🍦">🍦 Sobremesa</option>
                <option value="🍣">🍣 Japonês</option>
                <option value="🌴">🌴 Parque</option>
                <option value="🍔">🍔 Lanche</option>
                <option value="🏖️">🏖️ Passeio</option>
              </select>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-grow py-2.5 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl transition-colors"
                id="submit-new-place-btn"
              >
                Adicionar Opção
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl"
              >
                Voltar
              </button>
            </div>
          </form>
        )}

        {/* Options grid */}
        <div className="grid grid-cols-2 gap-2.5" id="roulette-cards-grid">
          {options.map((opt) => {
            const isSelected = selectedOptionName === opt.name;
            return (
              <div
                key={opt.id}
                id={`option-card-${opt.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => handleManualSelect(opt.name)}
                className={`group p-4 rounded-xl border text-center flex flex-col items-center gap-2 relative cursor-pointer select-none transition-all duration-300 ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/15 shadow-sm ring-2 ring-pink-500/10 scale-102 font-bold'
                    : 'border-gray-100 bg-white hover:border-pink-200'
                }`}
              >
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl transition-transform group-hover:scale-105 ${
                  isSelected ? 'bg-white shadow-inner scale-102' : 'bg-gray-50/50'
                }`}>
                  {opt.emoji}
                </div>
                <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">
                  {opt.name}
                </span>

                {/* Delete button (only show for custom ones, i.e. id not in original list) */}
                {!originalIdsList.includes(opt.id) && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePlace(opt.id, opt.name);
                    }}
                    className="absolute top-1.5 right-1.5 p-1 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Remover opção"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CONDITIONAL SUB-FEATURE DETAILS - Crime & Castigo */}
      {selectedOptionName === 'Casa' && (
        <section className="mt-6 animate-fade-in">
          <div className="bg-pink-50/10 p-5 rounded-3xl border border-pink-100/60 shadow-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">🍿</span>
              <h3 className="font-extrabold text-xs uppercase tracking-wide text-gray-800">
                Crime & Castigo - Cinema em Casa
              </h3>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-4">
              Já que o silêncio e repouso do lar nos convida para ficar, que tal escolhermos nosso passatempo predileto do momento? Clique em um para selar o trato:
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              {movieActivities.map((act) => (
                <div
                  key={act.id}
                  onClick={() => {
                    setRomanticAlert(`Comemorado! O plano selecionado hoje é: "${act.title}"! ❤️`);
                  }}
                  className="bg-white p-3.5 rounded-xl border border-gray-100 hover:border-pink-300 hover:shadow-xs transition-colors cursor-pointer group flex items-center justify-between"
                  id={`movie-activity-option-${act.id}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{act.emoji}</span>
                    <div className="text-left min-w-0">
                      <span className="text-xs font-bold text-gray-800 block leading-tight">
                        {act.title}
                      </span>
                      <span className="text-[10px] text-gray-400 block truncate max-w-[200px] sm:max-w-xs mt-0.5">
                        {act.desc}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-pink-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
