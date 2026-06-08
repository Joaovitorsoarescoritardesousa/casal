import { DiaryEntry, DateOption, CoupleProfile } from './types';

export const INITIAL_PROFILE: CoupleProfile = {
  partner1: "João",
  partner2: "Maria",
  anniversaryDate: "2024-06-12",
  profilePhoto: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&q=80&w=600",
};

export const MOODS_LIST = [
  { text: "Brava", emoji: "😡", desc: "Irritada ou impaciente" },
  { text: "Triste", emoji: "😢", desc: "Sentindo falta ou desanimada" },
  { text: "Ansiosa", emoji: "🤯", desc: "Com a mente acelerada" },
  { text: "Chata", emoji: "😒", desc: "Sem paciência para gracinhas" },
  { text: "Feliz", emoji: "😊", desc: "Radiante e com energia boa" },
  { text: "Preguiça", emoji: "🥱", desc: "Com preguiça de existir" },
  { text: "Rindo de nervoso", emoji: "🤡", desc: "Passei perrengue mas rindo" },
  { text: "Carentona", emoji: "🥰", desc: "Precisando de dengo e carinho" },
];

export const ENERGY_LIST = [
  { text: "Exausta", emoji: "😴", desc: "Só quero minha cama." },
  { text: "Disposta", emoji: "⚡", desc: "Pronta para qualquer coisa!" },
  { text: "Automático", emoji: "💤", desc: "Sobrevivendo ao dia." },
  { text: "Carregada", emoji: "🔋", desc: "Bateria em 100%." },
];

export const FOOD_LIST = [
  { text: "Japonês", emoji: "🍣" },
  { text: "Pizza", emoji: "🍕" },
  { text: "Lanche / Hambúrguer", emoji: "🍔" },
  { text: "Cachorro-quente", emoji: "🌭" },
  { text: "Esfirra", emoji: "🫓" },
  { text: "Massa / Macarronada", emoji: "🍝" },
  { text: "Churrasco / Carne", emoji: "🥩" },
  { text: "Pastel de feira", emoji: "🥟" },
  { text: "Comida caseira / Arroz e feijão", emoji: "🍲" }
];

export const DESSERT_LIST = [
  { text: "Churros", emoji: "🥖" },
  { text: "Pastel doce", emoji: "🥐" },
  { text: "Esfirra doce", emoji: "🫓" },
  { text: "Pizza doce", emoji: "🍫" },
  { text: "Sorvete / Açaí", emoji: "🍦" },
  { text: "Um pedaço de bolo / Doce de vitrine", emoji: "🍰" },
  { text: "Chocolate / Bombom de mercado", emoji: "🍬" }
];

export const EXERCISE_LIST = [
  { text: "Caminhar Capelinha", emoji: "👟" },
  { text: "Caminhar Tubarão", emoji: "🦈" },
  { text: "Andar de Bicicleta", emoji: "🚴" },
  { text: "Passear com os cachorros", emoji: "🐕" },
  { text: "Jogar bola", emoji: "⚽" },
  { text: "Academia", emoji: "🏋️" },
  { text: "Alongamento em casa", emoji: "🧘" },
  { text: "Hoje é dia de descanso absoluto / Greve de cardio", emoji: "🛑" }
];

export const IN_HOME_ACTIVITIES = [
  { text: "Ver um filme de terror / suspense", emoji: "🎬" },
  { text: "Maratonar nossa série do momento", emoji: "🍿" },
  { text: "Ficar cada um no seu TikTok segurando a mão do outro", emoji: "📱" },
  { text: "Jogar videogame juntos", emoji: "🎮" }
];

export const WHO_PAYS_LIST = [
  { text: "Você paga (Meu amorzinho)", emoji: "💳" },
  { text: "Eu pago (Hoje eu tô rica/o)", emoji: "💵" },
  { text: "Meio a meio (Parceria pura)", emoji: "🤝" },
  { text: "Par ou ímpar decide no restaurante", emoji: "🎲" }
];

export const LOVE_MOMENT_LIST = [
  { text: "Sim", emoji: "❤️" },
  { text: "Sim, com certeza!", emoji: "💖" },
  { text: "Sim, mas com cafuné obrigatório antes", emoji: "💞" }
];

export const INITIAL_DATE_OPTIONS: DateOption[] = [
  { id: "1", name: "Josephinas", icon: "Utensils", emoji: "🍽️" },
  { id: "2", name: "Ilhapub", icon: "Beer", emoji: "🍺" },
  { id: "3", name: "Melk-Pub", icon: "GlassWater", emoji: "🍻" },
  { id: "4", name: "Carol", icon: "Cake", emoji: "🥞" },
  { id: "5", name: "Pizzaria", icon: "Pizza", emoji: "🍕" },
  { id: "6", name: "Casa", icon: "Home", emoji: "🏠" },
  { id: "7", name: "Itapeva", icon: "MapPin", emoji: "🗺️" },
  { id: "8", name: "Taquari", icon: "Footprints", emoji: "🪵" },
  { id: "9", name: "Rancho", icon: "Moon", emoji: "🏕️" },
  { id: "10", name: "Dobroski Pub", icon: "PartyPopper", emoji: "🍀" },
  { id: "11", name: "Trailer de Lanche de rua", icon: "Truck", emoji: "🍔" },
  { id: "12", name: "Rodízio Japonês", icon: "CupSoda", emoji: "🍣" },
];

export const INITIAL_DIARY_ENTRIES: DiaryEntry[] = [
  {
    id: "sample-1",
    date: "2026-06-08T13:17:00.000Z",
    formattedDate: "Segunda-feira, 8 de Junho de 2026",
    formattedTime: "13:17",
    moods: ["Feliz", "Carentona"],
    energy: "Carregada",
    wantToEat: ["Massa / Macarronada"],
    dessert: ["Sorvete / Açaí"],
    whereToEat: "Casa",
    exercise: ["Alongamento em casa"],
    watchInHome: "Maratonar nossa série do momento",
    whoPays: "Parceria pura",
    loveMoment: "Sim, com certeza!",
    highlights: {
      dinner: {
        title: "Jantar Especial",
        description: "Cozinhamos massa italiana juntos e abrimos aquele vinho reservado."
      },
      movie: {
        title: "Filme da Noite",
        description: "Assistimos 'About Time' debaixo das cobertas. Chorei um pouquinho."
      }
    },
    gratitudes: [
      "Pela paciência que você teve comigo hoje cedo.",
      "Por me fazer rir até a barriga doer no almoço."
    ],
    photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDWjzz0fCmyZ19n906j4yALJ7bp0IaUQIUXKqwDlZu3dgyJtu9dcVd2CafjQxmY8uZgD7Pz4wq5uHmvY-p0bedQgZX68txJJtEp1u_E4mDkjgkODme-bsOz7Sih5w1t90VVqsS6h1Q_4yyJDJe9zIoRA2O8AxyxsuBKdIvWInaxCU9CiIXhiRUDajPNZCEwKW2DGfxuFgyAwRToKCfiohZ4pfHWhBCLfUuU3pjqGg3pIbCWpsbsbevkNmMCc5TuuAppZpQabfcGBQNz",
    photoCaption: "Nosso momento no pôr do sol"
  },
  {
    id: "sample-2",
    date: "2026-06-07T21:40:00.000Z",
    formattedDate: "Domingo, 7 de Junho de 2026",
    formattedTime: "21:40",
    moods: ["Preguiça", "Feliz"],
    energy: "Automático",
    wantToEat: ["Pizza"],
    dessert: ["Chocolate / Bombom de mercado"],
    whereToEat: "Pizzaria",
    exercise: ["Passear com os cachorros"],
    whoPays: "Você paga (Meu amorzinho)",
    loveMoment: "Sim, mas com cafuné obrigatório antes",
    highlights: {
      dinner: {
        title: "Lanche Rápido",
        description: "Pedimos uma pizza e ficamos jogando conversa fora."
      }
    },
    gratitudes: [
      "Pelo abraço apertado logo após o cansaço do trabalho.",
      "Por organizar a cozinha sem eu precisar pedir."
    ],
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    photoCaption: "Nossa tarde preguiçosa no sofá"
  }
];
