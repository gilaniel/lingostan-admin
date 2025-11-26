export type LessonsItem = {
  id?: number;
  title: string;
  description: string;
  order: number;
  duration?: number;
  videoUrl?: string;
  moduleId: number | string;
  exerciseIds?: number[] | string[];
  languageId: number;
  exercises?: number[];
};
