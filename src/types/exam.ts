export type ExamCategory =
  | "Engineering"
  | "Research & Space"
  | "Regulatory & Finance"
  | "Defence & PSU"
  | "IT & Government";

export type ExamSectionName =
  | "Syllabus"
  | "Subjects"
  | "Previous Year Papers"
  | "Practice Questions"
  | "Mock Tests"
  | "Study Material";

export interface ExamSubject {
  id: string;
  name: string;
  topics: string[];
  weightage?: string;
}

export interface ExamPaper {
  id: string;
  title: string;
  year: number;
  subject?: string;
  downloadUrl?: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  subject?: string;
}

export interface ExamMockTest {
  id: string;
  title: string;
  duration: string;
  totalQuestions: number;
  subject?: string;
}

export interface ExamStudyMaterial {
  id: string;
  title: string;
  type: "notes" | "video" | "book" | "article";
  subject?: string;
  url?: string;
}

export interface Exam {
  id: string;
  name: string;
  category: ExamCategory;
  description: string;
  fullDescription: string;
  sections: ExamSectionName[];
  eligibility: string;
  pattern: string;
  conductedBy: string;
  frequency: string;
  subjects: ExamSubject[];
  papers: ExamPaper[];
  questions: ExamQuestion[];
  mockTests: ExamMockTest[];
  studyMaterials: ExamStudyMaterial[];
}

export interface ExamProgress {
  examId: string;
  questionsAttempted: number;
  questionsCorrect: number;
  mockTestsTaken: number;
  lastAccessedAt: number;
  sectionsVisited: ExamSectionName[];
}

export interface SavedExam {
  examId: string;
  savedAt: number;
}
