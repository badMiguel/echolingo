export type StackParamList = {
  TopicScreen: { userType: 'teacher' | 'student' };  // userType to determine if it's student or teacher
  TeacherView: { sentences: Sentence[] };  // Array of sentences passed to TeacherView
  RecordingScreen: { sentence: Sentence };  // Sentence object passed to RecordingScreen
  StudentView: { sentences: Sentence[] };  // StudentView for student access
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