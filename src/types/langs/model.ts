export type Lang = {
  id: number;
  code: string;
  name: string;
  alphabet: AlphabetItem[];
};

export type AlphabetItem = {
  letter: string;
  transcription: string;
  audioUrl?: string;
  order: number;
};
