export interface Demographics {
  name: string;
  age: string;
  gender: string;
  schoolType: string;
  siblings: string;
  studyingClass: string;
  screenTime: string;
  consent: boolean;
}

export interface Question {
  id: string; // e.g. "AR1"
  text: string;
  category: string; // e.g. "Advertisement Recall"
  categoryEmoji: string;
}

export interface SurveyResponse extends Demographics {
  id: string;
  submittedAt: string;
  ratings: Record<string, number>; // Maps QID -> 1-5 rating
}

export interface VideoItem {
  id: number;
  title: string;
  typeLabel: string;
  filename: string;
  fallbackUrl: string; // High-quality reliable remote streaming fallback if local is absent
}

export const SURVEY_QUESTIONS: Question[] = [
  // Advertisement Recall (AR)
  { id: "AR1", text: "I watched all the advertisements carefully.", category: "Advertisement Recall (AR)", categoryEmoji: "👀" },
  { id: "AR2", text: "I can remember all the products shown in the advertisements.", category: "Advertisement Recall (AR)", categoryEmoji: "👀" },
  { id: "AR3", text: "The advertisements were interesting.", category: "Advertisement Recall (AR)", categoryEmoji: "👀" },
  { id: "AR4", text: "I liked the way the advertisements looked.", category: "Advertisement Recall (AR)", categoryEmoji: "👀" },
  { id: "AR5", text: "I would like to watch the advertisements again.", category: "Advertisement Recall (AR)", categoryEmoji: "👀" },

  // Emotional Response (ER)
  { id: "ER1", text: "The advertisements made me happy.", category: "Emotional Response (ER)", categoryEmoji: "❤️" },
  { id: "ER2", text: "The advertisements were exciting.", category: "Emotional Response (ER)", categoryEmoji: "❤️" },
  { id: "ER3", text: "I felt emotionally connected to the advertisements.", category: "Emotional Response (ER)", categoryEmoji: "❤️" },
  { id: "ER4", text: "The advertisements made the products look fun.", category: "Emotional Response (ER)", categoryEmoji: "❤️" },

  // Celebrity (CE)
  { id: "CE1", text: "I liked the celebrity in the advertisement.", category: "Celebrity Advertisement (CE)", categoryEmoji: "🌟" },
  { id: "CE2", text: "The celebrity made the product more attractive.", category: "Celebrity Advertisement (CE)", categoryEmoji: "🌟" },
  { id: "CE3", text: "I trust products shown by famous people.", category: "Celebrity Advertisement (CE)", categoryEmoji: "🌟" },
  { id: "CE4", text: "I would like to use products used by the celebrity.", category: "Celebrity Advertisement (CE)", categoryEmoji: "🌟" },

  // Cartoon (CC)
  { id: "CC1", text: "I liked the cartoon character in the advertisement.", category: "Cartoon Advertisement (CC)", categoryEmoji: "🎨" },
  { id: "CC2", text: "The cartoon character made the product more attractive.", category: "Cartoon Advertisement (CC)", categoryEmoji: "🎨" },
  { id: "CC3", text: "I trust products shown by cartoon characters.", category: "Cartoon Advertisement (CC)", categoryEmoji: "🎨" },
  { id: "CC4", text: "I would like to use products used by the cartoon character.", category: "Cartoon Advertisement (CC)", categoryEmoji: "🎨" },

  // Purchase Intention (PD)
  { id: "PD1", text: "I want this product.", category: "Purchase Intention (PD)", categoryEmoji: "🛍️" },
  { id: "PD2", text: "I would like my parents to buy this product for me.", category: "Purchase Intention (PD)", categoryEmoji: "🛍️" },
  { id: "PD3", text: "I may ask my parents to buy this product.", category: "Purchase Intention (PD)", categoryEmoji: "🛍️" },
  { id: "PD4", text: "I think this product is better than other products.", category: "Purchase Intention (PD)", categoryEmoji: "🛍️" },
  { id: "PD5", text: "I would feel happy if I got this product.", category: "Purchase Intention (PD)", categoryEmoji: "🛍️" },

  // Pestering Behaviour (PP)
  { id: "PP1", text: "I will ask my parents to buy this product many times.", category: "Pestering Behaviour (PP)", categoryEmoji: "📣" },
  { id: "PP2", text: "I will remind my parents again if they refuse.", category: "Pestering Behaviour (PP)", categoryEmoji: "📣" },
  { id: "PP3", text: "I may feel upset if my parents do not buy this product.", category: "Pestering Behaviour (PP)", categoryEmoji: "📣" },
  { id: "PP4", text: "I may compare this product with what my friends have.", category: "Pestering Behaviour (PP)", categoryEmoji: "📣" },
  { id: "PP5", text: "I will try hard to convince my parents to buy this product.", category: "Pestering Behaviour (PP)", categoryEmoji: "📣" },

  // Peer Influence (PI)
  { id: "PI1", text: "My friends influence what products I like.", category: "Peer Influence (PI)", categoryEmoji: "👥" },
  { id: "PI2", text: "I want products that my friends have.", category: "Peer Influence (PI)", categoryEmoji: "👥" },
  { id: "PI3", text: "I feel left out if I do not have products like my friends.", category: "Peer Influence (PI)", categoryEmoji: "👥" }
];

export const VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Big Babool Crow Ad",
    typeLabel: "Humour Ad",
    filename: "Big babool crow ad.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  },
  {
    id: 2,
    title: "Boost #PlayABiggerGame",
    typeLabel: "Celebrity Ad",
    filename: "vidssave.com Boost #PlayABiggerGame 2018 720P.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
  },
  {
    id: 3,
    title: "Kellogg's Multigrain Chocos",
    typeLabel: "Cartoon Ad",
    filename: "vidssave.com Kellogg’s Multigrain Chocos.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
  },
  {
    id: 4,
    title: "Kissan Jam",
    typeLabel: "Product Attribute Ad",
    filename: "vidssave.com Kissan Jam (Hindi) 720P.mp4",
    fallbackUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
  }
];

export const LIKERT_SCALE = [
  { value: 1, label: "Strongly Disagree", labelShort: "SD", emoji: "😡", colorClass: "hover:bg-red-100 hover:text-red-700 active:bg-red-200 border-red-200" },
  { value: 2, label: "Disagree", labelShort: "D", emoji: "🙁", colorClass: "hover:bg-orange-100 hover:text-orange-700 active:bg-orange-200 border-orange-200" },
  { value: 3, label: "Neutral", labelShort: "N", emoji: "😐", colorClass: "hover:bg-yellow-100 hover:text-yellow-700 active:bg-yellow-200 border-yellow-200" },
  { value: 4, label: "Agree", labelShort: "A", emoji: "🙂", colorClass: "hover:bg-emerald-100 hover:text-emerald-700 active:bg-emerald-200 border-emerald-200" },
  { value: 5, label: "Strongly Agree", labelShort: "SA", emoji: "😄", colorClass: "hover:bg-teal-100 hover:text-teal-700 active:bg-teal-200 border-teal-200" }
];
