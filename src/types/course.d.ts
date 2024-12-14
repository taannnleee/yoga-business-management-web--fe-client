export interface Course {
  id?: string; // Optional, for editing existing courses
  name: string;
  instruction: string;
  description: string;
  duration: string;
  imagePath: string;
  level: string;
  videoPath: string;
  price: string;
  teacherId: string;
  topicId: string;
}
