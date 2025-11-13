import { useLangsStore } from "@/store/useLangsStore";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Plus, Save, Trash, X } from "lucide-react";
import { useEffect, useMemo } from "react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";
import { Checkbox } from "@heroui/checkbox";
import { Card, CardBody } from "@heroui/card";
import { useExerciseStore } from "@/store/useExerciseStore";
import {
  CreateExercise,
  ExerciseItemContent,
  ExerciseType,
} from "@/types/exercises/model";
import { addToast } from "@heroui/toast";
import FileUpload from "@/components/fileUploader";
import { AudioPlayer } from "@/components/audioPlayer";
import { useLessonsStore } from "@/store/useLessonsStore";
import { Delay } from "@/utils/helpers";

type CreateListenFormProps<T extends ExerciseType> = {
  onSaveClick: (data: CreateExercise<T>) => Promise<boolean>;
  onDeleteClick: () => Promise<boolean>;
};

export const CreateListenForm = <T extends ExerciseType>({
  onSaveClick,
  onDeleteClick,
}: CreateListenFormProps<T>) => {
  const { activeLang } = useLangsStore();
  const {
    activeExercise,
    activeType,
    data: exercises,
    isSaving,
  } = useExerciseStore();
  const { data: lessons } = useLessonsStore();

  const methods = useForm<ExerciseItemContent>({
    defaultValues: {
      name: "",
      word: "",
      letter: undefined,
      variants: [],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const [word, letter] = useWatch({ control, name: ["word", "letter"] });

  const alphabetMap = useMemo(
    () => new Map(activeLang.alphabet.map((item) => [item.letter, item])),
    [activeLang]
  );

  const onSubmit = async (data: ExerciseItemContent) => {
    await onSaveClick({
      type: activeType.key as T,
      title: data.name,
      order: 0,
      content: data,
      languageId: activeLang.id,
      lessonId: Number(data.lessonId),
      id: activeExercise.id || undefined,
    });

    await Delay();

    reset({ name: undefined });

    addToast({
      title: `${data.name} успешно ${activeExercise.id ? "сохранен" : "создан"}`,
      color: "success",
    });
  };

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () => {
    append({ name: "", correct: false });
  };

  const handleDeleteClick = async () => {
    await onDeleteClick();
    await Delay();

    reset({ name: undefined });
  };

  useEffect(() => {
    if (activeExercise.id) {
      const exercise = exercises.find((item) => item.id === activeExercise.id);

      reset({
        ...activeExercise.content,
        lessonId: String(exercise?.lesson?.id || ""),
      });
    }
  }, [activeExercise]);

  return (
    <Card>
      <CardBody>
        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-5 mt-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5">
              <Controller
                control={control}
                name="lessonId"
                render={({ field, fieldState }) => {
                  return (
                    <Select
                      isInvalid={fieldState.invalid}
                      className="min-w-xs"
                      selectedKeys={[field.value]}
                      label="Урок"
                      onSelectionChange={(v) => {
                        field.onChange(v.currentKey);
                      }}
                    >
                      {lessons.map((lesson) => (
                        <SelectItem key={lesson.id}>{lesson.title}</SelectItem>
                      ))}
                    </Select>
                  );
                }}
                rules={{ required: true }}
              />
              <div className="flex gap-4 items-stretch">
                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Название упражнения"
                      labelPlacement="inside"
                      className="min-w-[250px] flex-1"
                      isInvalid={fieldState.invalid}
                    />
                  )}
                  rules={{ required: true }}
                />

                <Controller
                  name="letter"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Select
                      label="Буква"
                      className="min-w-[150px] flex-1"
                      isInvalid={fieldState.invalid}
                      onSelectionChange={(v) => {
                        const selectedLetter = v.currentKey;

                        if (!selectedLetter) return;

                        const selectedItem = alphabetMap.get(selectedLetter);

                        field.onChange(selectedItem);
                      }}
                      selectedKeys={[field.value ? field.value.letter : ""]}
                    >
                      {activeLang.alphabet.map((item) => (
                        <SelectItem key={item.letter}>{item.letter}</SelectItem>
                      ))}
                    </Select>
                  )}
                  rules={{ required: true }}
                />
                <Button
                  type="submit"
                  className="h-14 "
                  color="success"
                  isLoading={isSaving}
                >
                  <Save className="size-4" />
                  Сохранить
                </Button>

                {activeExercise.id && (
                  <Button
                    className="h-14 "
                    color="danger"
                    onPress={handleDeleteClick}
                  >
                    <Trash className="size-4" />
                    Удалить
                  </Button>
                )}
              </div>

              {activeType.key === "LISTENING" && (
                <Controller
                  name="word"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Слово"
                      labelPlacement="inside"
                      isInvalid={fieldState.invalid}
                    />
                  )}
                  rules={{ required: true }}
                />
              )}
            </div>

            {word && letter.letter && (
              <ColoredLetters word={word} targetLetter={letter.letter} />
            )}

            <div className="flex gap-4 flex-wrap">
              {variants.map((item, index) => (
                <div
                  className="flex flex-col gap-2 bg-white dark:bg-gray-600 shadow-medium p-3 rounded-medium"
                  key={item.id}
                >
                  <div className="flex gap-1 items-center">
                    <div className="flex flex-col gap-2">
                      <Controller
                        name={`variants.${index}.name`}
                        control={control}
                        render={({ field, fieldState }) => (
                          <Input
                            {...field}
                            label="Вариант ответа"
                            labelPlacement="inside"
                            isInvalid={fieldState.invalid}
                          />
                        )}
                        rules={{ required: true }}
                      />

                      {activeType.key === "MULTIPLE_CHOICE" && (
                        <Controller
                          name={`variants.${index}.audioUrl`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <div className="flex items-center gap-2">
                              <FileUpload
                                onUpload={field.onChange}
                                invalid={fieldState.invalid}
                                name={field.value || ""}
                              />
                              {field.value && (
                                <AudioPlayer audioUrl={field.value} />
                              )}
                            </div>
                          )}
                          rules={{ required: true }}
                        />
                      )}
                    </div>

                    <div
                      className="p-2 rounded-full hover:bg-default-100 cursor-pointer transition-colors"
                      onClick={() => remove(index)}
                    >
                      <X className="size-5 text-red-400" />
                    </div>
                  </div>

                  <Controller
                    name={`variants.${index}.correct`}
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        size="sm"
                        radius="full"
                        isSelected={field.value}
                        onValueChange={field.onChange}
                      >
                        Правильно
                      </Checkbox>
                    )}
                  />
                </div>
              ))}
            </div>

            <Button onPress={addVariant}>
              <Plus className="size-4" /> Вариант ответа
            </Button>
          </Form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

interface ColoredLettersProps {
  word: string;
  targetLetter: string; // буква которая должна подсвечиваться (например "Аь")
  color?: string;
  className?: string;
}

const ColoredLetters: React.FC<ColoredLettersProps> = ({
  word,
  targetLetter,
  color = "#ff0000",
  className = "",
}) => {
  const { activeLang } = useLangsStore();

  const letters = useMemo(() => {
    const alphabetLetters = activeLang.alphabet.map((item) => item.letter);
    const sortedLetters = [...alphabetLetters].sort(
      (a, b) => b.length - a.length
    );

    const regexPattern = sortedLetters
      .map((letter) => letter.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    const regex = new RegExp(`(${regexPattern})`, "gi");

    const letters = word.split(regex).filter(Boolean);

    return letters;
  }, [word, activeLang.alphabet]);

  return (
    <span className={className}>
      {letters.map((letter, index) => (
        <span
          key={index}
          style={{
            color:
              letter.toLowerCase() === targetLetter.toLowerCase()
                ? color
                : "inherit",
            fontWeight:
              letter.toLowerCase() === targetLetter.toLowerCase()
                ? "bold"
                : "normal",
          }}
        >
          {letter}
        </span>
      ))}
    </span>
  );
};
