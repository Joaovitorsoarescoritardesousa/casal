export interface DiaryEntry {
  id: string;
  date: string; // ISO string
  formattedDate: string; // e.g. "Segunda-feira, 8 de Junho de 2026"
  formattedTime: string; // e.g. "13:17"
  moods: string[]; // ['Feliz', 'Carentona']
  energy: string; // 'Disposta', 'Exausta'
  wantToEat: string[]; // ['Pizza', 'Japonês']
  dessert: string[]; // ['Sorvete / Açaí']
  whereToEat: string; // 'Casa', 'Ilhapub', etc.
  exercise: string[]; // ['Caminhar Capelinha', 'Academia']
  watchInHome?: string; // 'Maratonar nossa série', etc.
  whoPays: string; // 'Você paga', 'Eu pago', etc.
  loveMoment: string; // 'Sim', 'Sim, com certeza!', etc.
  highlights: {
    dinner?: {
      title: string;
      description: string;
    };
    movie?: {
      title: string;
      description: string;
    };
    custom?: {
      title: string;
      description: string;
    };
  };
  gratitudes: string[];
  photoUrl: string;
  photoCaption: string;
}

export interface DateOption {
  id: string;
  name: string;
  icon: string; // Lucide icon name
  emoji: string;
}

export interface CoupleProfile {
  partner1: string;
  partner2: string;
  anniversaryDate: string; // "YYYY-MM-DD" e.g., "2024-06-12"
  profilePhoto: string;
}
