import { useLangsStore } from "@/store/useLangsStore";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Save, Trash } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { Card, CardBody } from "@heroui/card";
import { useExerciseStore } from "@/store/useExerciseStore";
import {
  CreateExercise,
  ExerciseItemContent,
  ExerciseType,
} from "@/types/exercises/model";
import { addToast } from "@heroui/toast";
import { useLessonsStore } from "@/store/useLessonsStore";
import { Delay } from "@/utils/helpers";
import { VariantsForm } from "./variantsForm";
import { PairsForm } from "./pairsForm";

type CreateFormProps<T extends ExerciseType> = {
  onSaveClick: (data: CreateExercise<T>) => Promise<boolean>;
  onDeleteClick: () => Promise<boolean>;
};

function getDefaultValues(type: ExerciseType) {
  const base = {
    name: "",
    word: "",
    letter: undefined,
  } as ExerciseItemContent;

  switch (type) {
    case ExerciseType.LISTENING:
    case ExerciseType.MULTIPLE_CHOICE:
    case ExerciseType.MULTIPLE_CHOICE_IMGS:
      return { ...base, variants: [] };
    case ExerciseType.MATCHING:
      return {
        ...base,
        left: { isLetter: false, onlyAudio: false },
        right: { isLetter: false, onlyAudio: false },
        pairs: [],
      };
  }
}

export const CreateForm = <T extends ExerciseType>({
  onSaveClick,
  onDeleteClick,
}: CreateFormProps<T>) => {
  const { activeLang } = useLangsStore();
  const {
    activeExercise,
    activeType,
    data: exercises,
    isSaving,
  } = useExerciseStore();
  const { data: lessons } = useLessonsStore();

  const methods = useForm<ExerciseItemContent>({
    defaultValues: getDefaultValues(activeType.key),
  });

  const { control, handleSubmit, reset } = methods;

  const [word, letter] = useWatch({ control, name: ["word", "letter"] });

  const alphabetMap = useMemo(
    () => new Map(activeLang.alphabet.map((item) => [item.letter, item])),
    [activeLang]
  );

  const getForm = (type: ExerciseType) => {
    switch (type) {
      case "LISTENING":
      case "MULTIPLE_CHOICE":
      case "MULTIPLE_CHOICE_IMGS":
        return <VariantsForm />;
      case "MATCHING":
        return <PairsForm />;
    }
  };

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
      title: `Упражнение ${data.name} успешно ${activeExercise.id ? "сохранено" : "создано"}`,
      color: "success",
    });
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
        lessonId: String(exercise?.lessonId || ""),
      });
    }
  }, [activeExercise]);

  return (
    <Card className="w-full">
      <CardBody>
        <FormProvider {...methods}>
          <Form
            className="flex flex-col gap-5 mt-5 items-stretch"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-5">
              <div className="flex gap-4">
                <Controller
                  control={control}
                  name="lessonId"
                  render={({ field, fieldState }) => {
                    return (
                      <Select
                        isInvalid={fieldState.invalid}
                        className="flex-1"
                        selectedKeys={[field.value]}
                        label="Урок"
                        onSelectionChange={(v) => {
                          field.onChange(v.currentKey);
                        }}
                      >
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson.id}>
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </Select>
                    );
                  }}
                  rules={{ required: true }}
                />

                <Controller
                  name="name"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Input
                      {...field}
                      label="Название упражнения"
                      labelPlacement="inside"
                      className="flex-1"
                      isInvalid={fieldState.invalid}
                    />
                  )}
                  rules={{ required: true }}
                />
              </div>
              <div className="flex gap-4 items-stretch">
                {activeType.key !== ExerciseType.MATCHING && (
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
                          <SelectItem key={item.letter}>
                            {item.letter}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                    rules={{ required: true }}
                  />
                )}

                {activeType.key === ExerciseType.LISTENING && (
                  <Controller
                    name="word"
                    control={control}
                    render={({ field, fieldState }) => (
                      <Input
                        {...field}
                        className="flex-1"
                        label="Слово"
                        labelPlacement="inside"
                        isInvalid={fieldState.invalid}
                      />
                    )}
                    rules={{ required: true }}
                  />
                )}

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
            </div>

            {word && letter?.letter && (
              <ColoredLetters word={word} targetLetter={letter.letter} />
            )}

            <div className="flex gap-4 flex-wrap w-full justify-center">
              {getForm(activeType.key)}
            </div>
          </Form>
        </FormProvider>
      </CardBody>
    </Card>
  );
};

interface ColoredLettersProps {
  word: string;
  targetLetter: string;
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
