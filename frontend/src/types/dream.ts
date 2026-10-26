export interface Symbol {
  name: string;
  meaning: string;
}

export interface Emotion {
  name: string;
  intensity: number;
}

export interface DreamAnalysis {
  title: string;
  symbols: Symbol[];
  emotions: Emotion[];
  archetypes: string[];
  interpretation: string;
  advice: string;
}