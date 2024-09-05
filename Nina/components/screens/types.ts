export type StackParamList = {
  TeacherView: undefined;  // no parameters expected
  RecordingScreen: { sentence: Sentence };
    // Sentence is passed as a parameter
};

export interface Sentence {
  id: number;
  English: string | null; 
  "Gloss (english)": string | null;
  "Dharug(Gloss)": string | null;
  Dharug: string | null;
  Topic: string | null;    // null if no topic is provided
  "Image Name (optional)": string | null;
  Recording: string[];     
}



// export interface Topic {
//   topic: string;
//   sentences: Sentence[];
// }