import React, { useState } from 'react';
import { 
  BookOpen, Calendar, ChevronRight, Heart, Share2, 
  Trash2, FileText, ArrowLeft, Search, Filter, Sparkles, CheckCircle2,
  UtensilsCrossed, CalendarDays, Zap, Shield, HelpCircle, Flame, Dumbbell, DollarSign
} from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DiaryEntry, CoupleProfile } from '../types';

interface DiaryHistoryProps {
  entries: DiaryEntry[];
  onDeleteEntry: (id: string) => void;
  onBackToHome: () => void;
  profile: CoupleProfile;
}

export default function DiaryHistory({ entries, onDeleteEntry, onBackToHome, profile }: DiaryHistoryProps) {
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('all');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Find selected entry
  const selectedEntry = entries.find(e => e.id === selectedEntryId);

  // Generate unique list of moods from all entries for filter select inputs
  const allUsedMoods = Array.from(
    new Set(entries.flatMap(e => e.moods))
  );

  // Filter entries
  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.moods.some(m => m.toLowerCase().includes(searchQuery.toLowerCase())) ||
      entry.energy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.formattedDate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.gratitudes.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (entry.highlights.dinner?.description.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (entry.highlights.movie?.description.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    const matchesMood = selectedMoodFilter === 'all' || entry.moods.includes(selectedMoodFilter);

    return matchesSearch && matchesMood;
  });

  // Calculate emoji for an entry
  const getMoodEmoji = (mood: string) => {
    switch (mood) {
      case 'Brava': return '😡';
      case 'Triste': return '😢';
      case 'Ansiosa': return '🤯';
      case 'Chata': return '😒';
      case 'Feliz': return '😊';
      case 'Preguiça': return '🥱';
      case 'Rindo de nervoso': return '🤡';
      case 'Carentona': return '🥰';
      default: return '❤️';
    }
  };

  const getEnergyEmoji = (energy: string) => {
    switch (energy) {
      case 'Exausta': return '😴';
      case 'Disposta': return '⚡';
      case 'Automático': return '💤';
      case 'Carregada': return '🔋';
      default: return '✨';
    }
  };

  // WhatsApp romantic string formulations for the 9-part custom questionnaire
  const handleShareWhatsApp = (entry: DiaryEntry) => {
    const moodString = entry.moods.join(', ');
    const gratitudeString = entry.gratitudes.map((g, i) => `💝 ${g}`).join('\n');
    const foodString = entry.wantToEat && entry.wantToEat.length > 0 ? entry.wantToEat.join(', ') : 'Comida caseira';
    const dessertString = entry.dessert && entry.dessert.length > 0 ? entry.dessert.join(', ') : 'Chocolate';
    const exerciseString = entry.exercise && entry.exercise.length > 0 ? entry.exercise.join(', ') : 'Descanso';
    const watchString = entry.watchInHome ? `\n🍿 *O que assistir em Casa:* ${entry.watchInHome}` : '';

    const text = `Meu amorzinho! ❤️ Olha só nosso registro diário de hoje *${entry.formattedDate}* às *${entry.formattedTime}*:

😡 *Humor do dia:* ${moodString}
⚡ *Bateria do dia:* ${entry.energy} ${getEnergyEmoji(entry.energy)}
🍣 *Desejo de comer:* ${foodString}
🍩 *Sobremesa:* ${dessertString}
📍 *Ponto do rolê (Jantar):* ${entry.whereToEat || 'Casa'} ${watchString}
👟 *Exercício:* ${exerciseString}
💳 *Quem paga hoje:* ${entry.whoPays || 'Você paga (Meu amorzinho)'}
💖 *Regra do Amor:* ${entry.loveMoment || 'Sim, com certeza!'}

✨ *Nossas Gratidões:*
${gratitudeString}

📸 *Nossa Foto do Dia:* ${entry.photoCaption}

Cultivar nossa sintonização e riso mútuo a cada detalhe simples é minha parte favorita de nós! Te amo💕`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  // Trigger browser print or direct instant high quality client PDF download
  const handlePrintPDF = async () => {
    if (!selectedEntry || isGeneratingPdf) return;

    const element = document.getElementById('diary-detail-pdf-template');
    if (!element) {
      window.print();
      return;
    }

    setIsGeneratingPdf(true);

    try {
      // Small timeout to let any active hover or transitions finalize
      await new Promise(resolve => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2.2, // Excellent presentation quality
        useCORS: true, // Allow external pictures to render correctly
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff', // Matches template background perfectly
        onclone: (clonedDoc) => {
          const clonedWindow = clonedDoc.defaultView;
          if (clonedWindow) {
            const originalGetComputedStyle = clonedWindow.getComputedStyle;
            
            const canvasHelper = clonedDoc.createElement('canvas');
            canvasHelper.width = 1;
            canvasHelper.height = 1;
            const ctxHelper = canvasHelper.getContext('2d');
            
            const normalizeColor = (colorStr: string): string => {
              if (!colorStr || typeof colorStr !== 'string') return colorStr;
              if (!colorStr.includes('oklch')) return colorStr;
              
              try {
                if (!ctxHelper) return colorStr;
                ctxHelper.clearRect(0, 0, 1, 1);
                ctxHelper.fillStyle = colorStr;
                ctxHelper.fillRect(0, 0, 1, 1);
                const imgData = ctxHelper.getImageData(0, 0, 1, 1);
                const r = imgData.data[0];
                const g = imgData.data[1];
                const b = imgData.data[2];
                const a = imgData.data[3] / 255;
                return `rgba(${r}, ${g}, ${b}, ${a})`;
              } catch (err) {
                return colorStr;
              }
            };

            clonedWindow.getComputedStyle = function (elt, pseudoElt) {
              const style = originalGetComputedStyle.call(clonedWindow, elt, pseudoElt);
              return new Proxy(style, {
                get(target, prop) {
                  const value = target[prop as any];
                  if (typeof value === 'string' && value.includes('oklch')) {
                    return normalizeColor(value);
                  }
                  if (typeof value === 'string' && prop === 'boxShadow' && value.includes('oklch')) {
                    return value.replace(/oklch\([^)]+\)/g, (match) => normalizeColor(match));
                  }
                  if (typeof value === 'function') {
                    return value.bind(target);
                  }
                  return value;
                }
              });
            };

            const container = clonedDoc.getElementById('diary-detail-pdf-template');
            if (container) {
              const allNodes = container.getElementsByTagName('*');
              for (let i = 0; i < allNodes.length; i++) {
                const node = allNodes[i] as any;
                const tagName = node.tagName?.toLowerCase();
                
                // SVG attributes normalization for oklch colors (e.g. fill / stroke)
                if (tagName === 'path' || tagName === 'svg' || tagName === 'circle' || tagName === 'rect') {
                  const fillAttr = node.getAttribute('fill');
                  if (fillAttr && fillAttr.includes('oklch')) {
                    node.setAttribute('fill', normalizeColor(fillAttr));
                  }
                  const strokeAttr = node.getAttribute('stroke');
                  if (strokeAttr && strokeAttr.includes('oklch')) {
                    node.setAttribute('stroke', normalizeColor(strokeAttr));
                  }
                }
                
                // Inline style props normalization
                if (node.style) {
                  for (let j = 0; j < node.style.length; j++) {
                    const propName = node.style[j];
                    const propValue = node.style.getPropertyValue(propName);
                    if (propValue && propValue.includes('oklch')) {
                      node.style.setProperty(propName, normalizeColor(propValue));
                    }
                  }
                }
              }
            }
          }
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      // Create a smaller, highly consolidated PDF page form
      const pdfWidth = 550;
      const pdfHeight = 715;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: [pdfWidth, pdfHeight]
      });
      
      // Forces the captured image to map onto the exact bounds 100% perfectly on a single page
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      // Safe clean filename based on dates
      const cleanDate = selectedEntry.formattedDate
        .toLowerCase()
        .replace(/[^a-z0-0]/g, '_')
        .substring(0, 35);
      
      pdf.save(`diario_do_casal_${cleanDate}.pdf`);
    } catch (err) {
      console.error('Falha ao gerar o PDF direto, usando print nativo:', err);
      // Absolute premium fallback to native print if anything gets blocked
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (selectedEntry) {
    // Elegant fallbacks for legacy/default values
    const foodItems = selectedEntry.wantToEat && selectedEntry.wantToEat.length > 0 ? selectedEntry.wantToEat : ["Comida caseira / Arroz e feijão"];
    const dessertItems = selectedEntry.dessert && selectedEntry.dessert.length > 0 ? selectedEntry.dessert : ["Chocolate / Bombom de mercado"];
    const whereToEat = selectedEntry.whereToEat || "Casa";
    const exercisesList = selectedEntry.exercise && selectedEntry.exercise.length > 0 ? selectedEntry.exercise : ["Descanso absoluto / Sem atividades"];
    const whoPaysPrice = selectedEntry.whoPays || "Você paga (Meu amorzinho)";
    const loveRule = selectedEntry.loveMoment || "Sim, com certeza!";

    // RENDER DETAIL VIEW - Beautiful Bento Grid matching the custom 9 choices precisely
    return (
      <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-48 animate-fade-in print:pb-0">
        {/* EXCLUSIVE HIGH RESOLUTION PRINT TEMPLATE (HIDDEN OFF-SCREEN) */}
        {(() => {
          // Compute active selected categories for compact PDF dynamically
          const activeCategories = [];

          if (selectedEntry.moods && selectedEntry.moods.length > 0) {
            activeCategories.push({
              id: 'moods',
              title: '💓 Sintonia',
              bgColor: 'bg-white',
              borderColor: 'border-blue-100/60',
              content: (
                <div className="flex items-center gap-1 font-sans">
                  <div className="w-5 h-5 rounded bg-pink-105 flex items-center justify-center text-xs flex-shrink-0">
                    {getMoodEmoji(selectedEntry.moods[0])}
                  </div>
                  <div>
                    <p className="text-[7.5px] font-extrabold text-gray-800 leading-none truncate max-w-[90px]">
                      {selectedEntry.moods.join(' • ')}
                    </p>
                  </div>
                </div>
              )
            });
          }

          if (selectedEntry.energy) {
            activeCategories.push({
              id: 'energy',
              title: '⚡ Bateria',
              bgColor: 'bg-blue-50/10',
              borderColor: 'border-blue-100/40',
              content: (
                <div className="flex items-center gap-1 font-sans">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center text-[9px] flex-shrink-0">
                    {getEnergyEmoji(selectedEntry.energy)}
                  </div>
                  <div>
                    <p className="text-[7.5px] font-extrabold text-gray-805 leading-none">
                      {selectedEntry.energy}
                    </p>
                  </div>
                </div>
              )
            });
          }

          if (selectedEntry.whereToEat) {
            activeCategories.push({
              id: 'whereToEat',
              title: '📍 Rolê',
              bgColor: 'bg-white',
              borderColor: 'border-gray-200/50',
              content: (
                <div className="flex items-start gap-0.5 font-sans">
                  <span className="text-[9px] shrink-0 leading-none">📍</span>
                  <p className="text-[7.5px] font-black text-gray-800 leading-tight truncate max-w-[100px]">{whereToEat}</p>
                </div>
              )
            });
          }

          if (selectedEntry.wantToEat && selectedEntry.wantToEat.length > 0) {
            activeCategories.push({
              id: 'wantToEat',
              title: '🍔 Desejos',
              bgColor: 'bg-white',
              borderColor: 'border-gray-200/50',
              content: (
                <div className="flex flex-wrap gap-0.5 font-sans">
                  {foodItems.slice(0, 2).map((food, i) => (
                    <span key={i} className="text-[6.5px] font-bold text-gray-700 bg-gray-50 border border-gray-100 px-1 py-0.1 rounded truncate max-w-[48px]">
                      {food}
                    </span>
                  ))}
                </div>
              )
            });
          }

          if (selectedEntry.dessert && selectedEntry.dessert.length > 0) {
            activeCategories.push({
              id: 'dessert',
              title: '🍦 Sobremesa',
              bgColor: 'bg-white',
              borderColor: 'border-gray-200/50',
              content: (
                <div className="flex flex-wrap gap-0.5 font-sans">
                  {dessertItems.slice(0, 2).map((sweet, i) => (
                    <span key={i} className="text-[6.5px] font-bold text-gray-700 bg-gray-50 border border-gray-100 px-1 py-0.1 rounded truncate max-w-[48px]">
                      {sweet}
                    </span>
                  ))}
                </div>
              )
            });
          }

          if (selectedEntry.exercise && selectedEntry.exercise.length > 0) {
            activeCategories.push({
              id: 'exercise',
              title: '👟 Exercício',
              bgColor: 'bg-blue-50/10',
              borderColor: 'border-blue-100/40',
              content: (
                <div className="flex flex-wrap gap-0.5 font-sans">
                  {exercisesList.slice(0, 2).map((ex, i) => (
                    <span key={i} className="text-[6.5px] font-bold text-pink-600 bg-pink-50/40 px-1 py-0.1 rounded truncate max-w-[48px]">
                      {ex}
                    </span>
                  ))}
                </div>
              )
            });
          }

          if (selectedEntry.watchInHome && selectedEntry.watchInHome.trim() !== '') {
            activeCategories.push({
              id: 'watchInHome',
              title: '🍿 Assistir',
              bgColor: 'bg-white',
              borderColor: 'border-gray-200/50',
              content: (
                <div className="flex items-start gap-0.5 font-sans">
                  <span className="text-[8px] shrink-0 leading-none">🍿</span>
                  <p className="text-[7.5px] font-black text-gray-800 leading-tight truncate max-w-[100px]">{selectedEntry.watchInHome}</p>
                </div>
              )
            });
          }

          if (selectedEntry.whoPays) {
            activeCategories.push({
              id: 'whoPays',
              title: '💳 Conta',
              bgColor: 'bg-white',
              borderColor: 'border-gray-150',
              content: (
                <div className="flex items-center gap-0.5 font-sans">
                  <span className="text-[8px] shrink-0 leading-none">💳</span>
                  <p className="text-[7.5px] font-black text-gray-800 leading-none truncate max-w-[100px]">{whoPaysPrice}</p>
                </div>
              )
            });
          }

          if (selectedEntry.loveMoment) {
            activeCategories.push({
              id: 'loveMoment',
              title: '💝 Regra Clara',
              bgColor: 'bg-blue-50/10',
              borderColor: 'border-blue-100/40',
              content: (
                <div className="flex items-center gap-0.5 font-sans">
                  <span className="text-[8px] shrink-0 leading-none">💖</span>
                  <p className="text-[7.5px] font-black text-rose-500 leading-none truncate max-w-[100px]">{loveRule}</p>
                </div>
              )
            });
          }

          if (selectedEntry.highlights?.dinner?.description && selectedEntry.highlights.dinner.description.trim() !== '') {
            activeCategories.push({
              id: 'dinnerComment',
              title: '📝 Comentário',
              bgColor: 'bg-gray-50/60',
              borderColor: 'border-gray-150',
              content: (
                <p className="text-[6.5px] text-gray-600 italic leading-snug font-sans truncate max-w-[110px]">
                  "🍽️ {selectedEntry.highlights.dinner.description}"
                </p>
              )
            });
          }

          if (selectedEntry.highlights?.movie?.description && selectedEntry.highlights.movie.description.trim() !== '') {
            activeCategories.push({
              id: 'movieComment',
              title: '🍿 Nota Filme',
              bgColor: 'bg-gray-50/60',
              borderColor: 'border-gray-150',
              content: (
                <p className="text-[6.5px] text-gray-600 italic leading-snug font-sans truncate max-w-[110px]">
                  "🍿 {selectedEntry.highlights.movie.description}"
                </p>
              )
            });
          }

          return (
            <div 
              id="diary-detail-pdf-template" 
              style={{
                position: 'absolute',
                left: '-9999px',
                top: '-9999px',
                width: '550px',
                height: '715px',
                backgroundColor: '#ffffff',
                boxSizing: 'border-box',
                overflow: 'hidden'
              }}
              className="p-4 font-sans relative text-gray-800 border-[6px] border-blue-50/25"
            >
              {/* Heart decorative watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.012] pointer-events-none select-none">
                <Heart className="w-[300px] h-[300px] text-pink-600 fill-pink-600" />
              </div>

              <div className="relative border border-gray-100 p-4 rounded-xl w-full h-full flex flex-col justify-between font-sans bg-white shadow-3xs">
                {/* Header section (Modern & Minimalist, with logo and generation date/time) */}
                <div className="flex justify-between items-center pb-2 border-b border-gray-100/80">
                  {/* Left part: Logo & App Title */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-50/80 flex items-center justify-center text-pink-500 border border-pink-50 shadow-3xs">
                      <Heart className="w-3 h-3 fill-pink-500 text-pink-500" />
                    </div>
                    <div className="text-left font-sans">
                      <h1 className="text-xs font-black tracking-tight text-gray-850 leading-none">
                        ❤️ Diário do Casal
                      </h1>
                      <p className="text-[7.5px] font-extrabold text-pink-500 uppercase tracking-widest mt-0.5 leading-none">
                        {profile.partner1} & {profile.partner2}
                      </p>
                    </div>
                  </div>

                  {/* Right part: PDF generation timestamp */}
                  <div className="text-right flex flex-col font-mono text-[6.5px] text-gray-400 leading-tight">
                    <span className="font-sans font-extrabold text-pink-700 text-[7px] uppercase tracking-wider mb-0.5">Página de Recordação</span>
                    <span>Documento Oficial: {new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span>Registro: {selectedEntry.formattedDate} às {selectedEntry.formattedTime}</span>
                  </div>
                </div>

                {/* Quote of the Day (Very compact) */}
                <div className="py-1 px-2 text-center text-[7.5px] text-gray-400 italic font-sans bg-gray-50/40 border border-gray-100/30 rounded-md max-w-xs mx-auto my-1 leading-normal">
                  "Cultivar nossa sintonização e riso mútuo a cada detalhe simples é nossa parte favorita de nós."
                </div>

                {/* Grid with active items (compact cards of selected categories only) */}
                <div className="grid grid-cols-2 gap-1.5 flex-grow my-1 items-stretch content-start">
                  {activeCategories.map((cat) => (
                    <div 
                      key={cat.id} 
                      className={`p-2 rounded-[8px] border ${cat.borderColor} ${cat.bgColor} shadow-3xs flex flex-col justify-center font-sans`}
                    >
                      <div>
                        <span className="text-[6.8px] font-black uppercase text-pink-650 tracking-wider block mb-0.5 font-sans leading-none">
                          {cat.title}
                        </span>
                        <div className="font-sans mt-0.5 leading-relaxed">
                          {cat.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Row: Gratitudes & Polaroid Photo */}
                <div className="grid grid-cols-12 gap-1.5 mt-1 pt-1.5 border-t border-gray-100/80">
                  {selectedEntry.gratitudes && selectedEntry.gratitudes.length > 0 && (
                    <div className="col-span-6 p-2 bg-white border border-blue-50/70 rounded-[8px] shadow-3xs flex flex-col justify-between">
                      <div>
                        <span className="text-[6.8px] font-black uppercase text-pink-500 tracking-wider block mb-1 font-sans leading-none">
                          💫 Sou grato(a) por...
                        </span>
                        <ul className="space-y-0.5 font-sans">
                          {selectedEntry.gratitudes.slice(0, 3).map((grat, index) => (
                            <li key={index} className="flex items-start gap-0.5 bg-[#fdfaf8]/60 p-0.5 rounded border border-pink-100/5 font-sans">
                              <span className="text-pink-500 text-[6.5px] font-black shrink-0 mt-0.2">❤️</span>
                              <p className="text-[7px] font-semibold text-gray-700 leading-snug">
                                {grat}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {selectedEntry.photoUrl && (
                    <div className="col-span-6 p-2 bg-white border border-gray-200/60 rounded-[8px] shadow-3xs flex flex-col justify-between">
                      <div>
                        <span className="text-[6.8px] font-black uppercase text-pink-500 tracking-wider block mb-1 font-sans leading-none">
                          📸 Foto do Dia
                        </span>
                        <div className="w-full h-12 rounded overflow-hidden border border-gray-100 relative mb-0.5">
                          <img 
                            referrerPolicy="no-referrer"
                            src={selectedEntry.photoUrl} 
                            alt="Momento do casal" 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        {selectedEntry.photoCaption && (
                          <p className="text-[6.5px] font-bold text-pink-600 tracking-tight leading-normal font-sans italic text-center truncate max-w-[200px]">
                            "{selectedEntry.photoCaption}"
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer (Very compact with beautiful quotation) */}
                <div className="pt-1.5 border-t border-gray-100 text-center flex flex-col items-center justify-center font-sans mt-1">
                  <p className="text-[7.5px] font-bold text-gray-400 leading-none">
                    "Cada dia ao seu lado é uma memória guardada para sempre no coração."
                  </p>
                  <div className="flex items-center gap-1 mt-0.5 font-sans">
                    <Heart className="w-1.5 h-1.5 text-pink-400 fill-pink-400" />
                    <span className="text-[6.5px] font-extrabold text-gray-500 uppercase tracking-widest font-sans">
                      {profile.partner1} & {profile.partner2} • Diário do Casal
                    </span>
                    <Heart className="w-1.5 h-1.5 text-pink-400 fill-pink-400" />
                  </div>
                </div>

              </div>
            </div>
          );
        })()}

        {/* Back and actions header */}
        <div className="flex justify-between items-center mb-6 no-print">
          <button 
            onClick={() => {
              setSelectedEntryId(null);
              setShowDeleteConfirm(false);
            }}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-pink-600 bg-white border border-gray-100 rounded-full px-4 py-2 transition-all active:scale-95 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar ao Histórico</span>
          </button>
          
          {!showDeleteConfirm ? (
            <button 
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-150/70 border border-red-105 rounded-full px-4 py-2 transition-all active:scale-95 shadow-2xs animate-fade-in"
              title="Excluir Registro"
              id="btn-trigger-delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Apagar Registro</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-full py-1 px-3 shadow-xs animate-fade-in" id="confirm-delete-block">
              <span className="text-[10px] font-black text-red-700">Tem certeza?</span>
              <button 
                onClick={() => {
                  if (selectedEntry) {
                    onDeleteEntry(selectedEntry.id);
                    setSelectedEntryId(null);
                    setShowDeleteConfirm(false);
                  }
                }}
                className="text-[10px] font-extrabold text-white bg-red-500 hover:bg-red-650 rounded-full px-3 py-1.5 transition-all shadow-3xs active:scale-95 text-center leading-none"
                id="btn-confirm-delete-yes"
              >
                Sim, apagar
              </button>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="text-[10px] font-bold text-gray-500 bg-white hover:bg-gray-100 border border-gray-150 rounded-full px-3 py-1.5 transition-all active:scale-95 text-center leading-none"
                id="btn-confirm-delete-no"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>

        {/* Capture Container for instant high quality PDF */}
        <div id="diary-detail-capture" className="bg-gray-50/50 p-4 rounded-[32px] border border-gray-100/40 space-y-4">
          {/* Header Title Section */}
          <section className="mb-6 text-center print:mt-10">
            <h2 className="text-2xl font-black text-gray-800 font-sans tracking-tight mb-2">
              Resumo do Nosso Dia
            </h2>
            <div className="text-xs font-extrabold text-pink-700 bg-pink-100/70 border border-pink-200/50 px-4 py-1.5 rounded-full inline-block">
              {selectedEntry.formattedDate} • {selectedEntry.formattedTime}
            </div>
          </section>

          {/* Bento Grid layout representing all 9 custom categories */}
          <div className="space-y-4">
          
          {/* Card 1: Emoção & Bateria */}
          <div className="bg-white p-5 rounded-[24px] border border-pink-50 hover:shadow-xs transition-shadow flex items-center gap-4.5 shadow-xs">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl">
              {getMoodEmoji(selectedEntry.moods[0])}
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[9px] font-extrabold text-pink-600 uppercase tracking-widest block">Nosso Estado do Diário</span>
              <p className="text-base font-bold text-gray-850 truncate">
                {selectedEntry.moods.join(' • ')}
              </p>
              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-gray-500 bg-blue-50/50 px-2 py-0.5 rounded-md">
                <span>{getEnergyEmoji(selectedEntry.energy)}</span>
                <span className="capitalize">Energia: {selectedEntry.energy}</span>
              </span>
            </div>
          </div>

          {/* Card 2: Lanchinhos & Sobremesas (Múltipla Escolha) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-pink-500 block mb-1">🍔 Desejo de Comer</span>
                <div className="flex flex-wrap gap-1.5">
                  {foodItems.map((food, i) => (
                    <span key={i} className="text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                      {food}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs flex flex-col justify-between space-y-3">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-pink-500 block mb-1">🍦 Desejo de Doce</span>
                <div className="flex flex-wrap gap-1.5">
                  {dessertItems.map((sweet, i) => (
                    <span key={i} className="text-[11px] font-bold text-gray-700 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
                      {sweet}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Onde jantar & Crime/Castigo se houver */}
          <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs space-y-3.5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-pink-50 rounded-xl text-pink-600 text-lg">📍</div>
              <div>
                <span className="text-[9px] font-black uppercase text-pink-500 tracking-wider">O Ponto do Rolê</span>
                <h4 className="text-sm font-bold text-gray-800 leading-tight mt-0.5">{whereToEat}</h4>
                <p className="text-[10px] text-gray-400">Ponto escolhido para selar a gastronomia do dia</p>
              </div>
            </div>

            {selectedEntry.watchInHome && (
              <div className="border-t border-gray-50 pt-3 flex items-start gap-3">
                <div className="p-2 bg-pink-50 rounded-xl text-pink-500 text-lg">🍿</div>
                <div>
                  <span className="text-[9px] font-black uppercase text-pink-500 tracking-wider">Crime & Castigo - O que assistir</span>
                  <p className="text-xs text-gray-700 font-medium leading-tight mt-0.5">{selectedEntry.watchInHome}</p>
                </div>
              </div>
            )}
          </div>

          {/* Card 4: Exercício & Quem Paga */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs space-y-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-pink-500 block">👟 Exercício do Dia</span>
              <div className="space-y-1">
                {exercisesList.map((ex, i) => (
                  <p key={i} className="text-[11px] text-gray-600 font-bold bg-pink-50/15 p-1 px-2 rounded-md">
                    {ex}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs space-y-1.5 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-pink-500 block">💳 Quem Paga a Conta?</span>
                <p className="text-xs text-gray-800 font-bold mt-1.5">{whoPaysPrice}</p>
              </div>
              <span className="text-[9px] text-gray-400 font-medium block">Acordo selado na roleta do Pix</span>
            </div>
          </div>

          {/* Card 5: Momento Love regrinha */}
          <div className="bg-red-50/10 p-5 rounded-[24px] border border-pink-100 shadow-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-pulse">💝</span>
              <div>
                <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Momento Love</span>
                <p className="text-xs font-bold text-gray-800 mt-0.5">{loveRule}</p>
              </div>
            </div>
            <span className="text-[10px] text-pink-600 font-black tracking-wide bg-pink-50 px-2.5 py-1 rounded-full uppercase">Regra Clara</span>
          </div>

          {/* Custom optional details descriptions if inserted */}
          {(selectedEntry.highlights.dinner?.description || selectedEntry.highlights.movie?.description) && (
            <div className="bg-white p-5 rounded-[24px] border border-pink-50 shadow-xs space-y-3">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400 block pb-1 border-b border-gray-50">Comentários & Histórias</span>
              {selectedEntry.highlights.dinner?.description && (
                <div className="space-y-0.5">
                  <h5 className="text-xs font-bold text-gray-700">🍽️ Detalhes Gastronômicos:</h5>
                  <p className="text-xs text-gray-500 italic leading-relaxed">"{selectedEntry.highlights.dinner.description}"</p>
                </div>
              )}
              {selectedEntry.highlights.movie?.description && (
                <div className="space-y-0.5 pt-1">
                  <h5 className="text-xs font-bold text-gray-700">🍿 Detalhes de Lazer:</h5>
                  <p className="text-xs text-gray-500 italic leading-relaxed">"{selectedEntry.highlights.movie.description}"</p>
                </div>
              )}
            </div>
          )}

          {/* Gratitude Box (Sou Grato Por) */}
          <div className="bg-white p-6 rounded-[24px] border border-pink-50 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4.5 h-4.5 text-pink-500 fill-pink-500" />
              <h3 className="font-extrabold text-gray-850 text-sm">
                Sou imensamente grato(a) por...
              </h3>
            </div>
            <ul className="space-y-2.5">
              {selectedEntry.gratitudes.map((grat, index) => (
                <li key={index} className="flex items-start gap-2.5 bg-pink-50/10 p-3 rounded-xl border border-pink-50/20">
                  <span className="text-pink-500 text-xs font-extrabold mt-0.5">{index + 1}.</span>
                  <p className="text-xs font-medium text-gray-700 leading-tight">
                    {grat}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Photo Block with romantic typography caption overlay */}
          <div className="relative h-64 rounded-[24px] overflow-hidden shadow-xs group">
            <img 
              referrerPolicy="no-referrer"
              src={selectedEntry.photoUrl} 
              alt="Momento do casal" 
              className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
              <span className="text-[9px] font-extrabold text-pink-300 uppercase tracking-widest mb-1">
                MEMÓRIA EM IMAGEM
              </span>
              <p className="text-sm font-bold text-white shadow-xs leading-snug">
                "{selectedEntry.photoCaption}"
              </p>
            </div>
          </div>
        </div>
      </div>

        {/* BOTTOM STICKY ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/85 backdrop-blur-xl border-t border-pink-50/80 shadow-md z-40 no-print">
          <div className="max-w-xl mx-auto flex flex-col gap-2">
            <button 
              onClick={handlePrintPDF}
              disabled={isGeneratingPdf}
              className={`w-full h-12 ${isGeneratingPdf ? 'bg-pink-400' : 'bg-pink-600 hover:bg-pink-700'} text-white rounded-full font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all active:scale-95 shadow-md shadow-pink-100 disabled:opacity-75 disabled:cursor-wait`}
              id="generate-pdf-btn"
            >
              <FileText className={`w-4 h-4 ${isGeneratingPdf ? 'animate-pulse' : ''}`} />
              <span>{isGeneratingPdf ? 'Gerando PDF instantâneo...' : 'Gerar Diário do Dia (PDF)'}</span>
            </button>

            <div className="flex gap-2">
              <button 
                onClick={() => handleShareWhatsApp(selectedEntry)}
                className="flex-1 h-12 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-xs"
                id="whatsapp-share-btn"
              >
                <Share2 className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              
              <button 
                onClick={() => setSelectedEntryId(null)}
                className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-bold text-xs tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95"
                id="save-diary-feedback-btn"
              >
                <span>Voltar ao Álbum</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RENDER LIST OF MEMORIES VIEW
  return (
    <div className="w-full max-w-xl mx-auto px-4 pt-4 pb-28 animate-fade-in">
      <div className="space-y-4">
        {/* Memory overview container */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-pink-50 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 rounded-xl text-pink-600">
              <Heart className="w-5 h-5 fill-pink-500 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-gray-800 tracking-tight uppercase">Nosso Álbum de Recordações</h3>
              <p className="text-[10px] text-gray-400 font-bold">Temos {entries.length} memórias salvas no coração.</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 italic leading-relaxed">
            "Amar é registrar pequenos milagres diários que acontecem sem pressa, cultivando um relicário de sorrisos eternizados no peito."
          </p>
        </div>

        {/* Filter / Search options bar */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Search bar */}
          <div className="flex-1 relative">
            <span className="absolute left-3.5 top-3 text-gray-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Buscar momentos ou palavras..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-100 rounded-2xl text-xs focus:outline-none focus:border-pink-300 shadow-xs"
              id="memory-search-input"
            />
          </div>

          {/* Mood filter selector */}
          <div className="sm:w-44 flex items-center bg-white border border-gray-100 rounded-2xl shadow-xs px-2">
            <span className="text-xs text-pink-500 mr-1.5 pl-1.5">
              <Filter className="w-3.5 h-3.5" />
            </span>
            <select
              value={selectedMoodFilter}
              onChange={(e) => setSelectedMoodFilter(e.target.value)}
              className="w-full py-2 bg-transparent text-xs text-gray-600 focus:outline-none border-none font-medium pr-6"
              id="memory-mood-filter-select"
            >
              <option value="all">Filtro: Emoção</option>
              {allUsedMoods.map(mood => (
                <option key={mood} value={mood}>{mood}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Entries list or blank state */}
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100/60 shadow-xs space-y-4">
            <div className="w-16 h-16 mx-auto bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-gray-700">Nenhum momento encontrado</h4>
              <p className="text-xs text-gray-400 max-w-xs mx-auto">
                {searchQuery || selectedMoodFilter !== 'all' 
                  ? "Experimente mudar suas palavras-chave do filtro para ver outras memórias."
                  : "Vocês ainda não criaram registros de diário hoje. Que tal registrar sua primeira memória juntos?"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5">
            {filteredEntries.map((entry) => (
              <button
                key={entry.id}
                onClick={() => setSelectedEntryId(entry.id)}
                className="w-full group bg-white border border-gray-100/80 p-4 rounded-2xl shadow-xs hover:border-pink-200 transition-all text-left flex items-center gap-3.5 active:scale-[0.99]"
                id={`memory-entry-card-${entry.id}`}
              >
                {/* Mood preview container */}
                <div className="w-12 h-12 rounded-xl bg-pink-50/50 flex-shrink-0 flex items-center justify-center text-2xl group-hover:bg-blue-50 transition-colors">
                  {getMoodEmoji(entry.moods[0])}
                </div>
                
                {/* Metadata content text */}
                <div className="flex-1 min-w-0 font-sans">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-gray-400">
                      {entry.formattedDate.split(',')[1]?.trim() || entry.formattedDate}
                    </span>
                    <span className="text-[9px] font-bold text-pink-500 bg-pink-50 px-2 py-0.5 rounded-full">
                      {entry.formattedTime}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 truncate mt-0.5 group-hover:text-pink-600 transition-colors">
                    {entry.moods.join(' • ')}
                  </h4>
                  <p className="text-[10px] text-gray-400 truncate mt-0.5">
                    🍽️ jantar em: {entry.whereToEat || 'Casa'} • {entry.energy}
                  </p>
                </div>
                
                {/* Arrow indicator */}
                <span className="text-gray-300 group-hover:text-pink-600 group-hover:translate-x-0.5 transition-all">
                  <ChevronRight className="w-4 h-4" />
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
