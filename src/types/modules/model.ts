import { Difficult } from "..";

export type ModulesItem = {
  id: number;
  title: string;
  description: string;
  order: number;
  difficulty: Difficult;
  imageUrl?: string;
  estimatedDuration?: number;
  languageId: number;
  lessonIds?: number[] | string[];
  lessons: number[];
};
