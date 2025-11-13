import { LearningHeader } from "@/components/learningHeader";
import { useLangsStore } from "@/store/useLangsStore";
import { useLessonsStore } from "@/store/useLessonsStore";
import { useModulesStore } from "@/store/useModulesStore";
import { ModulesItem } from "@/types/modules/model";
import { Delay } from "@/utils/helpers";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { addToast } from "@heroui/toast";
import { Plus, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

const ModulesRoute = () => {
  const { activeLang, setACtiveLang, langs } = useLangsStore();
  const {
    fetchData,
    saveModule,
    delete: deleteModule,
    data,
    isLoading,
    isSaving,
  } = useModulesStore();
  const { fetchData: fetchLessons, data: lessons } = useLessonsStore();

  const [value, setValue] = useState<string>("");
  const [isAdd, setAdd] = useState(false);

  useEffect(() => {
    fetchLessons();
    fetchData();
  }, []);

  const { handleSubmit, control, reset } = useForm<ModulesItem>({
    defaultValues: {
      title: "",
      description: "",
      lessonIds: [],
    },
  });

  const [id] = useWatch({ control, name: ["id"] });

  const onSubmit = async (data: ModulesItem) => {
    await saveModule({
      ...data,
      order: 0,
      difficulty: "BEGINNER",
      languageId: activeLang.id,
      lessonIds: data.lessonIds?.map((item) => Number(item)),
    });

    reset({ title: "" });

    addToast({ title: "Модуль успешно сохранен", color: "success" });

    await Delay();

    setValue("");
    setAdd(false);
  };

  const handleDeleteClick = async () => {
    await deleteModule(id);

    addToast({ title: `Модуль удалён`, color: "success" });

    setValue("");
    setAdd(false);

    await Delay();

    reset({ title: "" });
  };

  return (
    <div className="flex flex-col gap-5">
      <LearningHeader />

      <h1 className="text-3xl font-semibold">Модули</h1>

      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-4 flex-1">
          <Select
            className="min-w-xs flex-1"
            defaultSelectedKeys={[activeLang.code]}
            label="Язык"
            onSelectionChange={(v) => {
              setACtiveLang(langs.find((item) => item.code === v.currentKey)!);
            }}
          >
            {langs.map((lang) => (
              <SelectItem key={lang.code}>{lang.name}</SelectItem>
            ))}
          </Select>

          <Select
            listboxProps={{
              emptyContent: "Нет данных",
            }}
            className="min-w-xs flex-1"
            label="Модули"
            selectedKeys={[value]}
            onSelectionChange={(v) => {
              if (!v.currentKey) return;

              setAdd(true);
              setValue(v.currentKey);

              const mod = data.find((mod) => mod.id === Number(v.currentKey));

              reset({
                ...mod,
                lessonIds: mod?.lessons.map((item) => String(item.id)),
              });
            }}
            isLoading={isLoading}
          >
            {data.map((lesson) => (
              <SelectItem key={lesson.id}>{lesson.title}</SelectItem>
            ))}
          </Select>
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
            reset({ title: "", description: "", lessonIds: [] });
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
          <Controller
            name="title"
            control={control}
            render={({ field, fieldState }) => (
              <Input
                {...field}
                label="Название модуля"
                labelPlacement="inside"
                className="min-w-[250px] flex-1"
                isInvalid={fieldState.invalid}
              />
            )}
            rules={{ required: true }}
          />

          <Controller
            name="description"
            control={control}
            render={({ field, fieldState }) => (
              <Textarea
                {...field}
                label="Описание"
                labelPlacement="inside"
                className="min-w-[250px] flex-1"
                isInvalid={fieldState.invalid}
              />
            )}
            rules={{ required: true }}
          />

          <Controller
            name="lessonIds"
            control={control}
            render={({ field, fieldState }) => (
              <Select
                listboxProps={{
                  emptyContent: "Нет данных",
                }}
                isClearable={true}
                isInvalid={fieldState.invalid}
                className="min-w-xs"
                label="Уроки"
                selectionMode="multiple"
                selectedKeys={field.value}
                onSelectionChange={(v) => {
                  const selectedValues = Array.from(v).map((item) => item);

                  field.onChange(selectedValues);
                }}
              >
                {lessons.map((lesson) => (
                  <SelectItem key={lesson.id}>{lesson.title}</SelectItem>
                ))}
              </Select>
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

export default ModulesRoute;
