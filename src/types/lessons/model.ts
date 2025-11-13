import { ExerciseItem } from "../exercises/model";
import { ModulesItem } from "../modules/model";

export type LessonsItem = {
  id: number;
  title: string;
  description: string;
  order: number;
  duration?: number;
  videoUrl?: string;
  moduleId: number | string;
  exerciseIds?: number[] | string[];
  mods: ModulesItem;
  exercises: ExerciseItem[];
};
