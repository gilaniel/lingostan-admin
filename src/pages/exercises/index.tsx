import { useLangsStore } from "@/store/useLangsStore";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { CreateListenForm } from "./components/createListenForm";
import { useExerciseStore } from "@/store/useExerciseStore";
import { ExerciseItem } from "@/types/exercises/model";

const ExercisesPage = () => {
  const { langs, activeLang, setACtiveLang } = useLangsStore();
  const {
    fetchData,
    data: exercises,
    setExercise,
    isLoading,
    types,
    activeType,
    setActiveType,
  } = useExerciseStore();

  const [isAdd, setAdd] = useState(false);
  const [value, setValue] = useState<any>(new Set([]));

  useEffect(() => {
    fetchData();
  }, []);

  if (!langs.length) {
    return null;
  }

  return (
    <div className="flex flex-col gap-5 items-start">
      <h1 className="text-3xl font-semibold">Упражнения</h1>

      <div className="flex gap-5">
        <Select
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
        </Select>

        <Select
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
        </Select>

        <Select
          className="min-w-xs"
          label="Упражнения"
          isLoading={isLoading}
          selectedKeys={value}
          onSelectionChange={(v) => {
            setValue(v);
            setAdd(true);

            setExercise(
              exercises.find((item) => String(item.id) === v.currentKey)!
            );
          }}
        >
          {exercises.map((exercise) => (
            <SelectItem key={exercise.id}>{exercise.title}</SelectItem>
          ))}
        </Select>
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

          {isAdd && <CreateListenForm />}
        </>
      )}
    </div>
  );
};

export default ExercisesPage;
