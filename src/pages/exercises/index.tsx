import { useLangsStore } from "@/store/useLangsStore";
import { Button } from "@heroui/button";
import { SelectItem, SelectSection } from "@heroui/select";
import { Plus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CreateForm } from "./components/createForm";
import { useExerciseStore } from "@/store/useExerciseStore";
import {
  CreateExercise,
  ExerciseItem,
  ExerciseType,
} from "@/types/exercises/model";
import { useLessonsStore } from "@/store/useLessonsStore";
import { LearningHeader } from "@/components/learningHeader";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import { HeroSelect } from "@/components/heroSelect";

const ExercisesPage = () => {
  const { langs, activeLang, setACtiveLang } = useLangsStore();
  const { fetchData: fetchLessons, data: lessons } = useLessonsStore();
  const { fetchData: fetchVocabulary } = useVocabularyStore();
  const {
    fetchData,
    data: exercises,
    setExercise,
    isLoading,
    types,
    activeType,
    setActiveType,
    delete: deleteItem,
    activeExercise,
    saveExercise,
  } = useExerciseStore();

  const [isAdd, setAdd] = useState(false);
  const [value, setValue] = useState<any>(new Set([]));

  const handleDeleteClick = async () => {
    await deleteItem(activeExercise.id);

    setExercise({} as ExerciseItem);
    setValue([]);
    setAdd(false);

    return true;
  };

  const handleSaveClick = async <T extends ExerciseType>(
    data: CreateExercise<T>
  ) => {
    await saveExercise(data);

    setExercise({} as ExerciseItem);
    setValue([]);
    setAdd(false);

    return true;
  };

  const groupedExercises = useMemo(
    () =>
      exercises.reduce(
        (acc, exercise) => {
          const lessonId = exercise.lessonId;

          if (!acc[lessonId]) {
            acc[lessonId] = [];
          }

          acc[lessonId].push(exercise);

          acc[lessonId].sort((a, b) => a.order - b.order);

          return acc;
        },
        {} as Record<number, ExerciseItem[]>
      ),
    [exercises]
  );

  useEffect(() => {
    fetchVocabulary(activeLang.id);
    fetchLessons();
    fetchData();
  }, []);

  if (!langs.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 items-start">
      <LearningHeader />

      <h1 className="text-3xl font-semibold">Упражнения</h1>

      <div className="flex gap-5">
        <HeroSelect
          className="min-w-xs"
          defaultSelectedKeys={[activeLang.code]}
          label="Язык"
          onSelectionChange={(v) => {
            setACtiveLang(langs.find((item) => item.code === v.currentKey)!);

            if (activeType.key) {
              fetchData();
            }
          }}
        >
          {langs.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </HeroSelect>

        <HeroSelect
          className="min-w-xs"
          label="Тип упражнения"
          selectedKeys={[activeType.key]}
          isDisabled={!activeLang.id}
          onSelectionChange={(v) => {
            setExercise({} as ExerciseItem);
            setValue([]);
            setAdd(false);

            setActiveType(types.find((item) => item.key === v.currentKey)!);
            fetchData();
          }}
        >
          {types.map((type) => (
            <SelectItem key={type.key}>{type.name}</SelectItem>
          ))}
        </HeroSelect>

        <HeroSelect
          isDisabled={!activeType.key}
          className="min-w-xs"
          label="Упражнения"
          isLoading={isLoading}
          scrollShadowProps={{
            isEnabled: false,
          }}
          selectedKeys={value}
          onSelectionChange={(v) => {
            setValue(v);
            setAdd(true);

            setExercise(
              exercises.find((item) => String(item.id) === v.currentKey)!
            );
          }}
        >
          {lessons.map((lesson) => {
            if (!groupedExercises[lesson.id!]) return null;

            return (
              <SelectSection
                key={lesson.id}
                classNames={{
                  heading:
                    "flex w-full sticky top-1 z-20 py-1.5 px-2 bg-default-100 shadow-small rounded-small",
                }}
                title={lesson.title}
              >
                {groupedExercises[lesson.id!].map((exercise) => (
                  <SelectItem key={exercise.id}>{exercise.title}</SelectItem>
                ))}
              </SelectSection>
            );
          })}
        </HeroSelect>
      </div>

      {activeLang.code && (
        <>
          {activeType.key && (
            <Button
              onPress={() => {
                setExercise({} as ExerciseItem);
                setValue([]);
                setAdd((prev) => !prev);
              }}
            >
              {isAdd ? (
                "Отменить"
              ) : (
                <>
                  <Plus className="size-4" />
                  Создать упражнение
                </>
              )}
            </Button>
          )}

          {isAdd && (
            <CreateForm
              onSaveClick={handleSaveClick}
              onDeleteClick={handleDeleteClick}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ExercisesPage;
