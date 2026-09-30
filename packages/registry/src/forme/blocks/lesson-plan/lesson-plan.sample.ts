import type { LessonPlanProps } from './lesson-plan.types.ts';

export const sampleLessonPlanData: LessonPlanProps = {
  accentColor: '#7c3aed',
  assessment: {
    formative: ['Exit ticket', 'Observation during guided practice'],
    summative: ['Chapter quiz'],
  },
  date: 'September 15, 2026',
  differentiation: [
    'Provide equation mats for visual learners',
    'Allow calculator use for students with processing difficulties',
    'Offer extension problems for advanced learners',
  ],
  duration: '50 minutes',
  essentialQuestion: 'How can we represent real-world relationships using linear equations?',
  gradeLevel: '8th Grade',
  homework: 'Complete worksheet problems 11-20',
  lessonTitle: 'Introduction to Linear Equations',
  materials: ['Graph paper', 'Rulers', 'Calculator', 'Whiteboard markers'],
  objectives: [
    'Define linear equations',
    'Graph linear equations on a coordinate plane',
    'Solve simple linear equations',
  ],
  sequence: [
    {
      activity: 'Warm-up',
      description: 'Review solving one-step equations',
      notes: '5 problems on the board',
      time: '5 min',
    },
    {
      activity: 'Introduction',
      description: 'Define linear equations, show examples',
      notes: 'Use real-world context',
      time: '10 min',
    },
    {
      activity: 'Guided Practice',
      description: 'Work through 3 examples together',
      notes: 'Check for understanding',
      time: '15 min',
    },
    {
      activity: 'Independent Practice',
      description: 'Complete worksheet problems 1-10',
      notes: 'Circulate and support',
      time: '15 min',
    },
    {
      activity: 'Closure',
      description: 'Exit ticket: solve one linear equation',
      notes: 'Collect before dismissal',
      time: '5 min',
    },
  ],
  standards: ['CCSS.MATH.8.EE.B.6', 'CCSS.MATH.8.EE.C.7'],
  subject: 'Mathematics',
  teacherName: 'Ms. Johnson',
  topic: 'Linear Equations',
};
