import React, { useState } from 'react';
import { 
  ArrowLeft, ArrowRight, Check, Heart, Sparkles, 
  RotateCw, Dumbbell, AlertOctagon, HelpCircle, Flame, Pizza, Coffee, DollarSign, ListMusic
} from 'lucide-react';
import { 
  MOODS_LIST, ENERGY_LIST, FOOD_LIST, DESSERT_LIST, 
  EXERCISE_LIST, IN_HOME_ACTIVITIES, WHO_PAYS_LIST, 
  LOVE_MOMENT_LIST, INITIAL_DATE_OPTIONS 
} from '../data';
import { DiaryEntry } from '../types';

interface NewDiaryWizardProps {
  onSave: (entry: Omit<DiaryEntry, 'id' | 'date' | 'formattedDate' | 'formattedTime'>) => void;
  onCancel: () => void;
}

export default function NewDiaryWizard({ onSave, onCancel }: NewDiaryWizardProps) {
  // Navigation Index
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Core Form state
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedEnergy, setSelectedEnergy] = useState<string>('Disposta');
  const [selectedFood, setSelectedFood] = useState<string[]>([]);
  const [selectedDessert, setSelectedDessert] = useState<string[]>([]);
  const [selectedWhereToEat, setSelectedWhereToEat] = useState<string>('Casa');
  const [selectedExercise, setSelectedExercise] = useState<string[]>([]);
  const [selectedWatchInHome, setSelectedWatchInHome] = useState<string>('Maratonar nossa série do momento');
  const [selectedWhoPays, setSelectedWhoPays] = useState<string>('Você paga (Meu amorzinho)');
  const [selectedLoveMoment, setSelectedLoveMoment] = useState<string>('Sim, com certeza!');

  // Step 10: Memories details & Photo metadata
  const [dinnerTitle, setDinnerTitle] = useState('Momento Gastronômico');
  const [dinnerDesc, setDinnerDesc] = useState('');
  const [movieTitle, setMovieTitle] = useState('Passatempo Romântico');
  const [movieDesc, setMovieDesc] = useState('');
  const [gratitude1, setGratitude1] = useState('');
  const [gratitude2, setGratitude2] = useState('');
  const [gratitude3, setGratitude3] = useState('');
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState(1);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('Nossa conexão de amor e cumplicidade');

  // Inline roulette states for Onde Jantar
  const [isRouletteSpinning, setIsRouletteSpinning] = useState(false);
  const [rouletteFlashItem, setRouletteFlashItem] = useState<string | null>(null);

  const photoPresets = [
    { id: 1, url: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWjzz0fCmyZ19n906j4yALJ7bp0IaUQIUXKqwDlZu3dgyJtu9dcVd2CafjQxmY8uZgD7Pz4wq5uHmvY-p0bedQgZX68txJJtEp1u_E4mDkjgkODme-bsOz7Sih5w1t90VVqsS6h1Q_4yyJDJe9zIoRA2O8AxyxsuBKdIvWInaxCU9CiIXhiRUDajPNZCEwKW2DGfxuFgyAwRToKCfiohZ4pfHWhBCLfUuU3pjqGg3pIbCWpsbsbevkNmMCc5TuuAppZpQabfcGBQNz", label: "Pôr do Sol Silhueta" },
    { id: 2, url: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600", label: "Mãos Dadas" },
    { id: 3, url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600", label: "Abraço Acolhedor" },
    { id: 4, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600", label: "Sorrisos de Amor" }
  ];

  // Dynamic step keys calculation
  const activeSteps = [
    'humor',       // Step 1
    'animo',       // Step 2
    'comer',       // Step 3
    'sobremesa',   // Step 4
    'jantar',      // Step 5
    'exercicio',   // Step 6
    ...(selectedWhereToEat === 'Casa' ? ['homeActivity'] : []), // Step 7 Conditional
    'pagamento',   // Step 8
    'love',        // Step 9
    'memorias'     // Step 10
  ];

  const currentStepKey = activeSteps[currentStepIndex];
  const totalSteps = activeSteps.length;
  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  // Toggle mood helpers
  const handleToggleMood = (text: string) => {
    setSelectedMoods(prev => 
      prev.includes(text) ? prev.filter(m => m !== text) : [...prev, text]
    );
  };

  // Toggle food helpers
  const handleToggleFood = (text: string) => {
    setSelectedFood(prev => 
      prev.includes(text) ? prev.filter(f => f !== text) : [...prev, text]
    );
  };

  // Toggle dessert helpers
  const handleToggleDessert = (text: string) => {
    setSelectedDessert(prev => 
      prev.includes(text) ? prev.filter(d => d !== text) : [...prev, text]
    );
  };

  // Toggle exercise helpers
  const handleToggleExercise = (text: string) => {
    setSelectedExercise(prev => {
      // Restrict conflict between normal items and "descanso absoluto"
      if (text.includes('descanso')) {
        return [text];
      }
      const cleaned = prev.filter(e => !e.includes('descanso'));
      return cleaned.includes(text) ? cleaned.filter(e => e !== text) : [...cleaned, text];
    });
  };

  // Instant Interactive Roulette Trigger for where to eat
  const handleSpinWhereToEat = () => {
    if (isRouletteSpinning) return;
    setIsRouletteSpinning(true);
    let count = 0;
    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * INITIAL_DATE_OPTIONS.length);
      const place = INITIAL_DATE_OPTIONS[idx].name;
      setRouletteFlashItem(place);
      count++;
      if (count > 15) {
        clearInterval(interval);
        const finalIdx = Math.floor(Math.random() * INITIAL_DATE_OPTIONS.length);
        const winner = INITIAL_DATE_OPTIONS[finalIdx].name;
        setSelectedWhereToEat(winner);
        setRouletteFlashItem(null);
        setIsRouletteSpinning(false);
      }
    }, 80);
  };

  // Navigation handlers
  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Step 10 Save Finalization logic
      const gratitudesList: string[] = [];
      if (gratitude1.trim()) gratitudesList.push(gratitude1.trim());
      if (gratitude2.trim()) gratitudesList.push(gratitude2.trim());
      if (gratitude3.trim()) gratitudesList.push(gratitude3.trim());

      if (gratitudesList.length === 0) {
        gratitudesList.push("Pelo privilégio de compartilhar risadas eternas juntos.");
        gratitudesList.push("Por cozinharmos nossa parceria em cada detalhe diário.");
      }

      const activePhotoUrl = customPhotoUrl.trim() || photoPresets.find(p => p.id === selectedPhotoPreset)?.url || photoPresets[0].url;

      onSave({
        moods: selectedMoods.length > 0 ? selectedMoods : ["Feliz"],
        energy: selectedEnergy,
        wantToEat: selectedFood.length > 0 ? selectedFood : ["Comida caseira / Arroz e feijão"],
        dessert: selectedDessert.length > 0 ? selectedDessert : ["Chocolate / Bombom de mercado"],
        whereToEat: selectedWhereToEat,
        exercise: selectedExercise.length > 0 ? selectedExercise : ["Hoje é dia de descanso absoluto / Greve de cardio"],
        watchInHome: selectedWhereToEat === 'Casa' ? selectedWatchInHome : undefined,
        whoPays: selectedWhoPays,
        loveMoment: selectedLoveMoment,
        highlights: {
          dinner: dinnerDesc.trim() ? { title: dinnerTitle, description: dinnerDesc } : undefined,
          movie: movieDesc.trim() ? { title: movieTitle, description: movieDesc } : undefined,
        },
        gratitudes: gratitudesList,
        photoUrl: activePhotoUrl,
        photoCaption: photoCaption.trim() ? photoCaption : "Um de nossos instantes repletos de riso e doçura",
      });
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-28">
      {/* Questionnaire Header Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50 mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-pink-600 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-600 animate-pulse" />
            <span>CATEGORIA {currentStepIndex + 1} DE {totalSteps}</span>
          </span>
          <span className="text-xs font-bold text-pink-600 bg-pink-50 px-3 py-1 rounded-full">
            {progressPercent}% respondido
          </span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Screen dynamic rendering */}
      <div className="min-h-[380px]">
        {/* Step 1: HUMOR */}
        {currentStepKey === 'humor' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Como estou me sentindo hoje?</h2>
              <p className="text-xs text-gray-400">Selecione uma ou mais emoções que resumem seu dia (Humor)</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {MOODS_LIST.map((m) => {
                const isSelected = selectedMoods.includes(m.text);
                return (
                  <button
                    key={m.text}
                    onClick={() => handleToggleMood(m.text)}
                    className={`p-4 rounded-2xl border text-center relative transition-all active:scale-[0.98] duration-200 flex flex-col items-center gap-2 ${
                      isSelected 
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-100 shadow-xs'
                    }`}
                  >
                    <div className="text-3xl filter drop-shadow-xs">{m.emoji}</div>
                    <span className="text-xs font-bold text-gray-800">{m.text}</span>
                    <span className="text-[10px] text-gray-400 leading-tight block">{m.desc}</span>
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 2: ENERGY (BATERIA) */}
        {currentStepKey === 'animo' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Qual o seu nível de ânimo?</h2>
              <p className="text-xs text-gray-400">O status atual da sua bateria emocional (Escolha única)</p>
            </div>
            <div className="space-y-3">
              {ENERGY_LIST.map((item) => {
                const isSelected = selectedEnergy === item.text;
                return (
                  <button
                    key={item.text}
                    onClick={() => setSelectedEnergy(item.text)}
                    className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all relative ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-100 shadow-xs'
                    }`}
                  >
                    <div className="text-3xl">{item.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-bold text-gray-800 block">{item.text}</span>
                      <span className="text-[10px] text-gray-400 block">{item.desc}</span>
                    </div>
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-[10px]">✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 3: WANT TO EAT */}
        {currentStepKey === 'comer' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-full text-pink-500">
                <Pizza className="w-5 h-5 animate-bounce" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">O que bateu vontade de comer?</h2>
              <p className="text-xs text-gray-400">Selecione tudo o que der deu água na boca hoje</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {FOOD_LIST.map((food) => {
                const isSelected = selectedFood.includes(food.text);
                return (
                  <button
                    key={food.text}
                    onClick={() => handleToggleFood(food.text)}
                    className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20'
                        : 'border-gray-100 bg-white hover:border-pink-50'
                    }`}
                  >
                    <span className="text-2xl">{food.emoji}</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">{food.text}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 4: DESSERT */}
        {currentStepKey === 'sobremesa' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-full text-pink-500">
                <Coffee className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Para adoçar a vida!</h2>
              <p className="text-xs text-gray-400">As sobremesas mais cobiçadas pelo casal</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {DESSERT_LIST.map((dessert) => {
                const isSelected = selectedDessert.includes(dessert.text);
                return (
                  <button
                    key={dessert.text}
                    onClick={() => handleToggleDessert(dessert.text)}
                    className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20'
                        : 'border-gray-100 bg-white hover:border-pink-50'
                    }`}
                  >
                    <span className="text-2xl">{dessert.emoji}</span>
                    <span className="text-xs font-bold text-gray-800 leading-tight">{dessert.text}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 5: JANTAR (OS PONTOS DO ROLÊ + INTERACTIVE SPIN) */}
        {currentStepKey === 'jantar' && (
          <section className="space-y-5 fade-in">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Os pontos do rolê - Onde jantar?</h2>
              <p className="text-xs text-gray-400">Escolha seu destino ou acione a Roleta da Noite</p>
            </div>

            {/* Special spinning control bar */}
            <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-4 rounded-2xl text-white shadow-md flex items-center justify-between gap-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-xl pointer-events-none" />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] uppercase font-bold tracking-widest text-pink-100 block">Indecisos?</span>
                <p className="text-xs font-medium text-white truncate">
                  {isRouletteSpinning 
                    ? `Sorteando: ${rouletteFlashItem || '...'}` 
                    : `Destino Atual: ${selectedWhereToEat}`
                  }
                </p>
              </div>
              <button
                type="button"
                onClick={handleSpinWhereToEat}
                disabled={isRouletteSpinning}
                className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm hover:bg-gray-50 flex-shrink-0"
              >
                <RotateCw className={`w-3.5 h-3.5 ${isRouletteSpinning ? 'animate-spin' : ''}`} />
                <span>Girar Roleta</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
              {INITIAL_DATE_OPTIONS.map((opt) => {
                const isSelected = selectedWhereToEat === opt.name;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedWhereToEat(opt.name)}
                    className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/30 font-bold ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-100'
                    }`}
                  >
                    <span className="text-xl">{opt.emoji}</span>
                    <span className="text-xs text-gray-700 truncate">{opt.name}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 6: EXERCÍCIO DO DIA */}
        {currentStepKey === 'exercicio' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-full text-pink-500">
                <Dumbbell className="w-5 h-5 animate-pulse" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Exercício do Dia</h2>
              <p className="text-xs text-gray-400">Como foi movimentado o esqueleto hoje?</p>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              {EXERCISE_LIST.map((item) => {
                const isSelected = selectedExercise.includes(item.text);
                return (
                  <button
                    key={item.text}
                    onClick={() => handleToggleExercise(item.text)}
                    className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/5'
                        : 'border-gray-100 bg-white hover:border-pink-50'
                    }`}
                  >
                    <span className="text-xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-gray-800">{item.text}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 7: (CONDITIONAL) CRIME & CASTIGO: O que assistir em Casa? */}
        {currentStepKey === 'homeActivity' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-full text-pink-500">
                <Flame className="w-5 h-5 stroke-[2.5]" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Crime & Castigo!</h2>
              <p className="text-xs text-gray-400">Já que o jantar é em Casa, qual o plano de sossego?</p>
            </div>
            <div className="space-y-3">
              {IN_HOME_ACTIVITIES.map((item) => {
                const isSelected = selectedWatchInHome === item.text;
                return (
                  <button
                    key={item.text}
                    onClick={() => setSelectedWatchInHome(item.text)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-3 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-50'
                    }`}
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <span className="text-xs font-bold text-gray-700">{item.text}</span>
                    <span className={`w-4 h-4 ml-auto rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-[10px] font-black">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 8: QUEM PAGA A CONTA? */}
        {currentStepKey === 'pagamento' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-full text-pink-500">
                <DollarSign className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Quem paga a conta hoje?</h2>
              <p className="text-xs text-gray-400">Na hora do PIX, como fica selada a cumplicidade?</p>
            </div>
            <div className="space-y-3.5">
              {WHO_PAYS_LIST.map((pay) => {
                const isSelected = selectedWhoPays === pay.text;
                return (
                  <button
                    key={pay.text}
                    onClick={() => setSelectedWhoPays(pay.text)}
                    className={`w-full p-4 rounded-xl border text-left flex items-center gap-3.5 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-100'
                    }`}
                  >
                    <span className="text-2xl">{pay.emoji}</span>
                    <span className="text-xs font-bold text-gray-800">{pay.text}</span>
                    <span className={`w-4 h-4 ml-auto rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-[10px] font-black">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 9: MOMENTO LOVE */}
        {currentStepKey === 'love' && (
          <section className="space-y-6 fade-in">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2.5 bg-pink-100 rounded-full text-pink-600 animate-pulse">
                <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Momento de Amor</h2>
              <p className="text-xs text-gray-400">A regra é sagrada e o chamego é lei hoje</p>
            </div>
            <div className="space-y-3">
              {LOVE_MOMENT_LIST.map((love) => {
                const isSelected = selectedLoveMoment === love.text;
                return (
                  <button
                    key={love.text}
                    onClick={() => setSelectedLoveMoment(love.text)}
                    className={`w-full p-5 rounded-2xl border text-left flex items-center gap-4 transition-all ${
                      isSelected
                        ? 'border-pink-500 bg-pink-50/20 ring-2 ring-pink-500/10'
                        : 'border-gray-100 bg-white hover:border-pink-100'
                    }`}
                  >
                    <span className="text-2xl">{love.emoji}</span>
                    <span className="text-xs font-bold text-gray-800">{love.text}</span>
                    <span className={`w-4 h-4 ml-auto rounded-full border flex items-center justify-center ${
                      isSelected ? 'bg-pink-500 border-pink-500 text-white' : 'border-gray-300'
                    }`}>
                      {isSelected && <span className="text-[10px] font-black">✓</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Step 10: MEMORIES WRITE UP, PHOTO & GRATITUDE */}
        {currentStepKey === 'memorias' && (
          <section className="space-y-5 fade-in max-h-[460px] overflow-y-auto pr-1">
            <div className="text-center space-y-1.5">
              <div className="inline-flex p-2 bg-pink-50 rounded-2xl text-pink-500">
                <Sparkles className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">Memorizar Nosso Dia</h2>
              <p className="text-xs text-gray-400">Escreva o bento romântico final para guardar no coração</p>
            </div>

            {/* Gratitudes entries template inputs */}
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-3.5">
              <div className="flex items-center gap-2 text-pink-600 font-bold text-xs">
                <Heart className="w-4 h-4 fill-pink-500" />
                <span>Hoje sou imensamente grato(a) por...</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  value={gratitude1}
                  onChange={(e) => setGratitude1(e.target.value)}
                  placeholder="Atitude carinhosa 1 (Ex: Pelo cafuné espontâneo...)"
                  className="w-full text-xs bg-gray-50/50 hover:bg-white focus:outline-none border border-gray-100 focus:border-pink-300 rounded-xl p-2.5 text-gray-700 transition`colors"
                />
                <input
                  type="text"
                  value={gratitude2}
                  onChange={(e) => setGratitude2(e.target.value)}
                  placeholder="Atitude carinhosa 2 (Ex: Me dar o maior pedaço de doce...)"
                  className="w-full text-xs bg-gray-50/50 hover:bg-white focus:outline-none border border-gray-100 focus:border-pink-300 rounded-xl p-2.5 text-gray-700 transition`colors"
                />
                <input
                  type="text"
                  value={gratitude3}
                  onChange={(e) => setGratitude3(e.target.value)}
                  placeholder="Atitude carinhosa 3 (Opcional)"
                  className="w-full text-xs bg-gray-50/50 hover:bg-white focus:outline-none border border-gray-100 focus:border-pink-300 rounded-xl p-2.5 text-gray-700 transition`colors"
                />
              </div>
            </div>

            {/* General optional title and highlights descriptions */}
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
              <span className="text-xs font-bold text-gray-800">🍽️ Detalhes do Roteiro Gastronômico (Opcional)</span>
              <textarea
                value={dinnerDesc}
                onChange={(e) => setDinnerDesc(e.target.value)}
                placeholder="Ex e dicas: Pedimos aquela pizza com borda de catupiry e rimos assistindo besteira..."
                className="w-full text-xs bg-gray-50/50 focus:bg-white border rounded-xl p-3 h-16 resize-none focus:outline-none border-gray-100 focus:border-pink-300"
              />
            </div>

            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-3">
              <span className="text-xs font-bold text-gray-800">🍿 Detalhes de Outro Relato / Filme (Opcional)</span>
              <textarea
                value={movieDesc}
                onChange={(e) => setMovieDesc(e.target.value)}
                placeholder="Ex e dicas: Assistimos série sob as cobertas trocando carinho bem juntinhos..."
                className="w-full text-xs bg-gray-50/50 focus:bg-white border rounded-xl p-3 h-16 resize-none focus:outline-none border-gray-100 focus:border-pink-300"
              />
            </div>

            {/* Photo selections presets */}
            <div className="bg-white p-4.5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
              <span className="text-xs font-bold text-gray-800 block">📸 Foto de Capa</span>
              <div className="grid grid-cols-4 gap-2">
                {photoPresets.map((photo) => (
                  <button
                    key={photo.id}
                    type="button"
                    onClick={() => {
                      setSelectedPhotoPreset(photo.id);
                      setCustomPhotoUrl('');
                    }}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all active:scale-95 ${
                      selectedPhotoPreset === photo.id && !customPhotoUrl
                        ? 'border-pink-500 scale-102 ring-2 ring-pink-500/10'
                        : 'border-transparent opacity-80'
                    }`}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Ou insira URL de sua foto personalizada:</label>
                <input
                  type="url"
                  value={customPhotoUrl}
                  onChange={(e) => {
                    setCustomPhotoUrl(e.target.value);
                    setSelectedPhotoPreset(0);
                  }}
                  placeholder="https://exemplo.com/casal.jpg"
                  className="w-full text-xs bg-gray-50 border border-gray-100 focus:border-pink-300 p-2 rounded-lg focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">Legenda do Nosso Momento:</label>
                <input
                  type="text"
                  value={photoCaption}
                  onChange={(e) => setPhotoCaption(e.target.value)}
                  placeholder="Ex: Pôr do sol recheado de sorrisos eternos..."
                  className="w-full text-xs bg-gray-50 border border-gray-100 focus:border-pink-300 p-2 rounded-lg focus:outline-none focus:bg-white text-gray-700 font-medium"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* FOOTER WIZARD ACTIONS BAR */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-pink-50/50 z-40">
        <div className="max-w-xl mx-auto flex gap-3">
          <button
            onClick={handlePrev}
            className="flex-1 h-12 rounded-full bg-gray-100 hover:bg-gray-250 text-gray-600 font-bold text-xs tracking-wider transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{currentStepIndex === 0 ? 'Voltar' : 'Anterior'}</span>
          </button>

          <button
            onClick={handleNext}
            className="flex-[2] h-12 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:brightness-105 active:scale-95 text-white font-bold text-xs tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-pink-200/50"
          >
            <span>{currentStepIndex === totalSteps - 1 ? 'Finalizar Diário de Hoje' : 'Próxima Questão'}</span>
            {currentStepIndex === totalSteps - 1 ? (
              <Check className="w-4 h-4 stroke-[3]" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
