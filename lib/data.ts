export type Scene =
  | "coffee"
  | "couple"
  | "sunset"
  | "flowers"
  | "airplane"
  | "river";

export type Memory = {
  id: string;
  date: string; // ISO yyyy-mm-dd
  weekday: string;
  weather: "sunny" | "cloudy" | "rainy";
  title: string;
  caption: string;
  body: string;
  scene: Scene;
  photos: Scene[];
  audioSeconds: number;
  likes: number;
  comments: number;
  location?: string;
  stickers?: string[];
  author: "mia" | "jake" | "both";
};

export type DailyQuestion = {
  id: string;
  prompt: string;
  tint: "pink" | "yellow" | "blue" | "green";
  emoji: string;
  answeredOn?: string;
};

export type Todo = {
  id: string;
  title: string;
  notes?: string;
  assignee: "mia" | "jake" | "both";
  due?: string; // "Today", "Sat", "May 22", etc.
  category: "errand" | "date" | "trip" | "read" | "home";
  done: boolean;
};

export const couple = {
  names: { mia: "mia", jake: "jake" } as const,
  spaceName: "our little space",
  daysTogether: 362,
  anniversary: "May 11, 2023",
};

export const memories: Memory[] = [
  {
    id: "m1",
    date: "2024-05-18",
    weekday: "Saturday",
    weather: "sunny",
    title: "A perfect little day",
    caption: "little coffee date in the morn-ing ☕",
    body: "It was such a cozy day! We went to our favorite cafe, took a walk by the river and watched the sunset together. ❤",
    scene: "couple",
    photos: ["coffee", "couple", "sunset"],
    audioSeconds: 28,
    likes: 12,
    comments: 3,
    location: "Riverside Cafe",
    stickers: ["🌷", "🌼", "💗"],
    author: "both",
  },
  {
    id: "m2",
    date: "2024-05-16",
    weekday: "Thursday",
    weather: "sunny",
    title: "Long walk, longer talks",
    caption: "sunset by the bridge",
    body: "We picked up flowers on the way home and watched the planes blink across the sky.",
    scene: "sunset",
    photos: ["sunset", "flowers", "airplane"],
    audioSeconds: 18,
    likes: 8,
    comments: 1,
    location: "East Bridge",
    stickers: ["🌸", "✈️"],
    author: "mia",
  },
  {
    id: "m3",
    date: "2024-05-06",
    weekday: "Monday",
    weather: "cloudy",
    title: "Our quiet Monday",
    caption: "rainy reading day",
    body: "Stayed in, made banana bread, read out loud. The good kind of slow.",
    scene: "flowers",
    photos: ["flowers", "couple"],
    audioSeconds: 12,
    likes: 6,
    comments: 0,
    location: "Home",
    stickers: ["📖", "🍞"],
    author: "jake",
  },
  {
    id: "m4",
    date: "2024-04-28",
    weekday: "Sunday",
    weather: "sunny",
    title: "Down by the river",
    caption: "skipped stones for an hour",
    body: "Found a quiet bend in the river. Jake skipped a stone seven times. I'm still impressed.",
    scene: "river",
    photos: ["river", "couple"],
    audioSeconds: 22,
    likes: 14,
    comments: 4,
    location: "Greenfield Park",
    stickers: ["🪨", "💦"],
    author: "both",
  },
];

export const dailyQuestions: DailyQuestion[] = [
  {
    id: "q1",
    prompt: "What's something you appreciate about me?",
    tint: "pink",
    emoji: "💌",
  },
  {
    id: "q2",
    prompt: "If we could travel anywhere together, where would it be?",
    tint: "yellow",
    emoji: "✈️",
  },
  {
    id: "q3",
    prompt: "What was the best part of your day?",
    tint: "blue",
    emoji: "☁️",
  },
];

export const dailyQuestionHistory: DailyQuestion[] = [
  {
    id: "qh1",
    prompt: "What made you smile today?",
    tint: "yellow",
    emoji: "🌼",
    answeredOn: "May 17",
  },
  {
    id: "qh2",
    prompt: "What's a small thing you'd love to do this weekend?",
    tint: "green",
    emoji: "🌿",
    answeredOn: "May 15",
  },
];

export const todos: Todo[] = [
  {
    id: "t1",
    title: "Pick up flowers for friday",
    assignee: "jake",
    due: "Fri",
    category: "errand",
    done: false,
    notes: "the peach ones from the corner shop",
  },
  {
    id: "t2",
    title: "Book sunset picnic spot",
    assignee: "mia",
    due: "Sat",
    category: "date",
    done: false,
  },
  {
    id: "t3",
    title: "Plan summer trip ideas",
    assignee: "both",
    due: "May 25",
    category: "trip",
    done: false,
    notes: "3 places each, then vote 💌",
  },
  {
    id: "t4",
    title: "Finish reading 'A Little Life' chapter",
    assignee: "mia",
    category: "read",
    done: false,
  },
  {
    id: "t5",
    title: "Water the plants 🌿",
    assignee: "jake",
    due: "Today",
    category: "home",
    done: true,
  },
  {
    id: "t6",
    title: "Movie night — bring popcorn",
    assignee: "both",
    category: "date",
    done: true,
  },
];

export const stats = {
  memories: 42,
  photos: 68,
  voiceNotes: 15,
  questionsAnswered: 87,
};

export const favorites = {
  memoryId: "m1",
  memoryDateLabel: "May 6, 2024",
  song: { title: "Lovely", artist: "Billie Eilish" },
  placesCount: 3,
};

export const categoryLabels: Record<Todo["category"], { emoji: string; label: string; tint: string }> = {
  errand: { emoji: "🌿", label: "errand", tint: "bg-green-soft" },
  date: { emoji: "🍰", label: "date", tint: "bg-pink-soft" },
  trip: { emoji: "✈️", label: "trip", tint: "bg-blue-soft" },
  read: { emoji: "📚", label: "read", tint: "bg-yellow-soft" },
  home: { emoji: "🏡", label: "home", tint: "bg-cream" },
};

export function memoriesByMonth(year: number, month: number) {
  // month is 1-indexed
  return memories.filter((m) => {
    const [y, mo] = m.date.split("-").map(Number);
    return y === year && mo === month;
  });
}

export function getMemory(id: string) {
  return memories.find((m) => m.id === id);
}
