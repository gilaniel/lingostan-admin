import { AlphabetItem } from "../langs/model";
import { LessonsItem } from "../lessons/model";

export enum ExerciseType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  MULTIPLE_CHOICE_IMGS = "MULTIPLE_CHOICE_IMGS",
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
  letter?: AlphabetItem;
  name: string;
  word?: string;
  lessonId: number | string;
  imageUrl?: string;
} & (ExerciseWithVariants | ExerciseWithPairs);

export type ExerciseWithVariants = {
  type: "variants";
  variants: {
    name: string;
    correct: boolean;
    audioUrl?: string;
    imageUrl?: string;
  }[];
};

export type ExerciseWithPairs = {
  type: "pairs";
  left: { onlyAudio: boolean; isLetter: boolean };
  right: { onlyAudio: boolean; isLetter: boolean };
  pairs: {
    id: string;
    left: {
      value: string;
      audioUrl?: string;
    };
    right: {
      value: string;
      audioUrl?: string;
    };
  }[];
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
