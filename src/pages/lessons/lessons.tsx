import { HeroSelect } from "@/components/heroSelect";
import { LearningHeader } from "@/components/learningHeader";
import { useExerciseStore } from "@/store/useExerciseStore";
import { useLangsStore } from "@/store/useLangsStore";
import { useLessonsStore } from "@/store/useLessonsStore";
import { useModulesStore } from "@/store/useModulesStore";
import { LessonsItem } from "@/types/lessons/model";
import { Delay } from "@/utils/helpers";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { Plus, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const LessonsRoute = () => {
  const {
    activeLang,
    setACtiveLang,
    langs,
    isLoading: isLangsLoading,
  } = useLangsStore();
  const { fetchData, saveLesson, deleteLesson, data, isSaving, isLoading } =
    useLessonsStore();
  const { fetchData: fetchModules, data: modules } = useModulesStore();
  const { fetchData: fetchExercises, data: exercises } = useExerciseStore();

  const [value, setValue] = useState<string>("");
  const [isAdd, setAdd] = useState(false);

  useEffect(() => {
    fetchModules();
    fetchExercises();
    fetchData();
  }, []);

  const { handleSubmit, control, reset } = useForm<LessonsItem>({
    defaultValues: {
      title: "",
      description: "",
      exerciseIds: [],
      order: 1,
    },
  });

  const [id] = useWatch({ control, name: ["id"] });

  const onSubmit = async (data: LessonsItem) => {
    await saveLesson({
      id: data.id || undefined,
      description: data.description,
      title: data.title,
      order: Number(data.order),
      exerciseIds: data.exerciseIds?.map((item) => Number(item)),
      moduleId: Number(data.moduleId),
      languageId: activeLang.id,
    });

    reset({ title: "" });

    addToast({ title: "Урок успешно сохранен", color: "success" });

    await Delay();

    setValue("");
    setAdd(false);
  };

  const handleDeleteClick = async () => {
    await deleteLesson(id!);

    addToast({ title: `Урок удалён`, color: "success" });

    setValue("");
    setAdd(false);

    await Delay();

    reset({ title: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      <LearningHeader />

      <h1 className="text-3xl font-semibold">Уроки</h1>

      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4 flex-1">
          <HeroSelect
            className="min-w-xs flex-1"
            defaultSelectedKeys={isLangsLoading ? [] : [activeLang.code]}
            label="Язык"
            onSelectionChange={(v) => {
              setACtiveLang(langs.find((item) => item.code === v.currentKey)!);

              fetchModules();
              fetchExercises();
              fetchData();
            }}
          >
            {langs.map((lang) => (
              <SelectItem key={lang.code}>{lang.name}</SelectItem>
            ))}
          </HeroSelect>

          <HeroSelect
            listboxProps={{
              emptyContent: "Нет данных",
            }}
            className="min-w-xs flex-1"
            label="Уроки"
            selectedKeys={[value]}
            onSelectionChange={(v) => {
              if (!v.currentKey) return;

              setAdd(true);
              setValue(v.currentKey);

              const lesson = data.find(
                (lesson) => lesson.id === Number(v.currentKey)
              );

              reset({
                ...lesson,
                moduleId: String(lesson?.moduleId || ""),
                exercises: lesson?.exercises?.map((item) => String(item)),
              });
            }}
            isLoading={isLoading}
          >
            {data.map((lesson) => (
              <SelectItem key={lesson.id}>{lesson.title}</SelectItem>
            ))}
          </HeroSelect>
        </div>

        <Button
          color="primary"
          onPress={() => {
            setAdd((prev) => {
              if (prev) {
                setValue("");
              }
              return !prev;
            });
            reset({ title: "", order: 1 });
          }}
        >
          {isAdd ? (
            "Отменить"
          ) : (
            <>
              <Plus className="size-5" />
              Добавить
            </>
          )}
        </Button>
      </div>

      {isAdd && (
        <Form
          className="flex flex-col gap-5 mt-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-4 w-full">
            <Controller
              name="title"
              control={control}
              render={({ field, fieldState }) => (
                <Input
                  {...field}
                  label="Название урока"
                  labelPlacement="inside"
                  className="flex-1"
                  isInvalid={fieldState.invalid}
                />
              )}
              rules={{ required: true }}
            />

            <Controller
              name="order"
              control={control}
              render={({ field, fieldState }) => {
                return (
                  <Input
                    label="Номер"
                    labelPlacement="inside"
                    className="w-[100px]"
                    isInvalid={fieldState.invalid}
                    type="number"
                    min={1}
                    value={String(field.value)}
                    onChange={field.onChange}
                  />
                );
              }}
              rules={{ required: true }}
            />
          </div>

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                value={field.value || ""}
                label="Описание"
                labelPlacement="inside"
                className="min-w-[250px] flex-1"
                isInvalid={fieldState.invalid}
              />
            )}
            rules={{ required: true }}
          />

          <Controller
            name="moduleId"
            control={control}
            render={({ field, fieldState }) => (
              <HeroSelect
                listboxProps={{
                  emptyContent: "Нет данных",
                }}
                isInvalid={fieldState.invalid}
                className="min-w-xs"
                label="Модули"
                selectedKeys={[field.value]}
                onSelectionChange={(v) => {
                  field.onChange(v.currentKey);
                }}
              >
                {modules.map((module) => (
                  <SelectItem key={module.id}>{module.title}</SelectItem>
                ))}
              </HeroSelect>
            )}
            rules={{ required: true }}
          />

          <Controller
            name="exerciseIds"
            control={control}
            render={({ field, fieldState }) => (
              <HeroSelect
                listboxProps={{
                  emptyContent: "Нет данных",
                }}
                isClearable={true}
                isInvalid={fieldState.invalid}
                className="min-w-xs"
                label="Упражнения"
                selectionMode="multiple"
                selectedKeys={field.value}
                onSelectionChange={(v) => {
                  const selectedValues = Array.from(v).map((item) => item);

                  field.onChange(selectedValues);
                }}
              >
                {exercises.map((exercise) => (
                  <SelectItem key={exercise.id}>{exercise.title}</SelectItem>
                ))}
              </HeroSelect>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" color="success" isLoading={isSaving}>
              <Save className="size-4" />
              Сохранить
            </Button>

            {id && (
              <Button color="danger" onPress={handleDeleteClick}>
                <Trash className="size-5" />
                Удалить
              </Button>
            )}
          </div>
        </Form>
      )}
    </div>
  );
};

export default LessonsRoute;
