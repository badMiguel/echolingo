export type StackParamList = {
  TopicScreen: { userType: 'teacher' | 'student' };  // userType passed from HomeScreen
  TeacherView: { sentences: Sentence[], userType: 'teacher' };  // userType also passed to TeacherView
  Sentences: { sentences: Sentence[], userType: 'teacher' | 'student' };  // Sentences with userType
  RecordingScreen: { sentence: Sentence, userType: 'teacher' | 'student' };  // RecordingScreen needs the userType
  StudentView: { sentence: Sentence };  // StudentView does not need the userType (only sentence)
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