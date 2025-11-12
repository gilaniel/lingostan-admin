import { useLangsStore } from "@/store/useLangsStore";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Plus, Save, X } from "lucide-react";
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
import { ExerciseItemContent, ExerciseType } from "@/types/exercises/model";
import { addToast } from "@heroui/toast";

export const CreateChoiceForm = () => {
  const { activeLang } = useLangsStore();
  const { saveExercise, activeExercise } = useExerciseStore();

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
    await saveExercise({
      type: ExerciseType.LISTENING,
      title: data.name,
      order: 0,
      content: data,
      languageId: activeLang.id,
    });

    reset();
    addToast({ title: `${data.name} успешно создан`, color: "success" });
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

  useEffect(() => {
    if (activeExercise.id) {
      reset(activeExercise.content);
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
                <Button type="submit" className="h-14 " color="success">
                  <Save className="size-4" />
                  Сохранить
                </Button>
              </div>

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
