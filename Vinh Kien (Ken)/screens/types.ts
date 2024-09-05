export type Word = {
  id: number;
  English: string | null;  
  Gloss: string | null;
  DharugGloss: string | null;
  Dharug: string | null;
  Topic: string | null;
  ImageName?: string | null;  // Optional 
  recording: string | null;
  completed: boolean;
};
