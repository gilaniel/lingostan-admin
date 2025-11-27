import { HeroSelect } from "@/components/heroSelect";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import { ExerciseItemContent } from "@/types/exercises/model";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { SelectItem } from "@heroui/select";
import { Plus, X } from "lucide-react";
import { useMemo } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export const VariantsForm = () => {
  const { control, setValue } = useFormContext<ExerciseItemContent>();
  const { data } = useVocabularyStore();

  const {
    fields: variants,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "variants",
  });

  const addVariant = () => {
    append({ word: "", correct: false });
  };

  const vocabularyMap = useMemo(
    () => new Map(data.map((item) => [item.word, item])),
    []
  );

  return (
    <>
      <div className="flex flex-col gap-4 items-center">
        <div className="flex gap-4 flex-wrap">
          {variants.map((item, index) => (
            <div
              className="flex flex-col gap-2 bg-white dark:bg-gray-600 shadow-medium p-3 rounded-medium"
              key={item.id}
            >
              <div className="flex gap-1 items-center">
                <div className="flex flex-col gap-2">
                  <Controller
                    name={`variants.${index}.word`}
                    control={control}
                    render={({ field, fieldState }) => (
                      <HeroSelect
                        label="Слово"
                        className="min-w-[150px] flex-1"
                        isInvalid={fieldState.invalid}
                        onSelectionChange={(v) => {
                          const selected = v.currentKey;

                          if (!selected) return;

                          const selectedItem = vocabularyMap.get(selected);

                          field.onChange(selectedItem?.word);

                          setValue(
                            `variants.${index}.audioUrl`,
                            selectedItem?.audioUrl
                          );
                          setValue(
                            `variants.${index}.imageUrl`,
                            selectedItem?.imageUrl
                          );
                        }}
                        selectedKeys={[field.value || ""]}
                      >
                        {data.map((item) => (
                          <SelectItem key={item.word}>{item.word}</SelectItem>
                        ))}
                      </HeroSelect>
                    )}
                    rules={{ required: true }}
                  />
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
      </div>
    </>
  );
};
