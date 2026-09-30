export type LessonPlanSequenceItem = {
  time: string;
  activity: string;
  description: string;
  notes?: string | undefined;
};

export type LessonPlanAssessment = {
  formative?: string[] | undefined;
  summative?: string[] | undefined;
};

export type LessonPlanProps = {
  subject: string;
  gradeLevel: string;
  lessonTitle: string;
  date: string;
  teacherName: string;
  duration: string;
  topic?: string | undefined;
  essentialQuestion?: string | undefined;
  objectives: string[];
  standards?: string[] | undefined;
  materials: string[];
  sequence: LessonPlanSequenceItem[];
  differentiation?: string[] | undefined;
  assessment: LessonPlanAssessment;
  homework?: string | undefined;
  reflection?: string | undefined;
  accentColor?: string | undefined;
};
