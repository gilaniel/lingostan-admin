import { AlphabetItem } from "../langs/model";
import { LessonsItem } from "../lessons/model";

export enum ExerciseType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MATCHING = "MATCHING",
  TRANSLATION = "TRANSLATION",
  LISTENING = "LISTENING",
  SPEAKING = "SPEAKING",
  FILL_BLANK = "FILL_BLANK",
  REORDER = "REORDER",
  TRUE_FALSE = "TRUE_FALSE",
}

export type ExerciseItem = {
  id: number;
  title: string;
  content: ExerciseItemContent;
  lesson: LessonsItem;
};

export type ExerciseItemContent = {
  letter: AlphabetItem;
  name: string;
  variants: { name: string; correct: boolean; audioUrl?: string }[];
  word?: string;
  lessonId: number | string;
};

export type CreateExercise<T extends ExerciseType> = {
  id?: number;
  type: T;
  title: string;
  order: number;
  content: ExerciseItemContent;
  languageId: number;
  lessonId: number | string;
};
