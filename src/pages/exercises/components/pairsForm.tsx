import { HeroSelect } from "@/components/heroSelect";
import { useExerciseStore } from "@/store/useExerciseStore";
import { useLangsStore } from "@/store/useLangsStore";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import { ExerciseItemContent, ExerciseType } from "@/types/exercises/model";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { SelectItem } from "@heroui/select";
import { Plus, X } from "lucide-react";
import { useMemo } from "react";
import {
  Controller,
  useFieldArray,
  useFormContext,
  useWatch,
} from "react-hook-form";
import { v4 } from "uuid";

export const PairsForm = () => {
  const { control, setValue } = useFormContext<ExerciseItemContent>();
  const { activeLang } = useLangsStore();
  const { activeType } = useExerciseStore();
  const { data: vocabulary } = useVocabularyStore();

  const isMatchingAudio = activeType.key === ExerciseType.MATCHING_AUDIO;

  const {
    fields: pairs,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "pairs",
  });

  const alphabetMap = useMemo(
    () => new Map(activeLang.alphabet.map((item) => [item.letter, item])),
    [activeLang]
  );

  const vocabularyMap = useMemo(
    () => new Map(vocabulary.map((item) => [item.word, item])),
    [vocabulary]
  );

  const [left, right, pairsData] = useWatch({
    control,
    name: ["left", "right", "pairs"],
  });

  const addVariant = () => {
    append({
      id: v4(),
      left: { value: "" },
      right: { value: "" },
    });
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-start">
        <div className="flex flex-col gap-2 flex-wrap">
          {!!pairs.length && (
            <div className="flex gap-4">
              <div className="flex-1 basis-1/2">
                <div className="w-full flex flex-col gap-2">
                  <Controller
                    control={control}
                    name="left.isLetter"
                    render={({ field }) => (
                      <Checkbox
                        isSelected={left.isLetter}
                        onValueChange={field.onChange}
                        classNames={{
                          label: "text-[12px]",
                        }}
                      >
                        Буква
                      </Checkbox>
                    )}
                  />
                  {left && left.isLetter && (
                    <Controller
                      control={control}
                      name="left.onlyAudio"
                      render={({ field }) => (
                        <Checkbox
                          isSelected={left.onlyAudio}
                          onValueChange={field.onChange}
                          classNames={{
                            label: "text-[12px]",
                          }}
                        >
                          Только звук
                        </Checkbox>
                      )}
                    />
                  )}
                </div>
              </div>
              <div className="flex-1 basis-1/2">
                <div className="w-full flex flex-col gap-2">
                  <Controller
                    control={control}
                    name="right.isLetter"
                    render={({ field }) => (
                      <Checkbox
                        isSelected={right.isLetter}
                        onValueChange={field.onChange}
                        classNames={{
                          label: "text-[12px]",
                        }}
                      >
                        Буква
                      </Checkbox>
                    )}
                  />
                  {right && right.isLetter && (
                    <Controller
                      control={control}
                      name="right.onlyAudio"
                      render={({ field }) => (
                        <Checkbox
                          isSelected={right.onlyAudio}
                          onValueChange={field.onChange}
                          classNames={{
                            label: "text-[12px]",
                          }}
                        >
                          Только звук
                        </Checkbox>
                      )}
                    />
                  )}
                </div>
              </div>

              <div className="p-2 size-9"></div>
            </div>
          )}

          {pairs.map((item, index) => (
            <div className="flex gap-4 items-start" key={item.id}>
              <div className="flex flex-col gap-2 bg-white dark:bg-gray-600 shadow-medium p-3 rounded-medium flex-1 basis-1/2">
                <Controller
                  name={`pairs.${index}.left.value`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="w-[200px]">
                      {left && left.isLetter ? (
                        <HeroSelect
                          isVirtualized={false}
                          label="Буква"
                          className="min-w-[150px] flex-1"
                          isInvalid={fieldState.invalid}
                          onSelectionChange={(v) => {
                            const selectedLetter = v.currentKey;

                            if (!selectedLetter) return;

                            const selectedItem =
                              alphabetMap.get(selectedLetter);

                            field.onChange(selectedItem?.letter);
                            setValue(
                              `pairs.${index}.left.audioUrl`,
                              selectedItem?.audioUrl
                            );
                          }}
                          selectedKeys={[field.value || ""]}
                        >
                          {activeLang.alphabet.map((item) => (
                            <SelectItem key={item.letter}>
                              {item.letter}
                            </SelectItem>
                          ))}
                        </HeroSelect>
                      ) : (
                        <div className="flex flex-col gap-1">
                          {isMatchingAudio ? (
                            <>
                              <HeroSelect
                                isVirtualized={false}
                                label="Слово"
                                className="min-w-[150px] flex-1"
                                isInvalid={fieldState.invalid}
                                onSelectionChange={(v) => {
                                  const selected = v.currentKey;

                                  if (!selected) return;

                                  const selectedItem =
                                    vocabularyMap.get(selected);

                                  field.onChange(selectedItem?.word);
                                  setValue(
                                    `pairs.${index}.left.audioUrl`,
                                    selectedItem?.audioUrl
                                  );
                                  setValue(
                                    `pairs.${index}.left.displayValue`,
                                    selectedItem?.word
                                  );
                                }}
                                selectedKeys={[field.value || ""]}
                              >
                                {vocabulary.map((item) => (
                                  <SelectItem key={item.word}>
                                    {item.word}
                                  </SelectItem>
                                ))}
                              </HeroSelect>

                              <Input
                                value={
                                  pairsData[index]
                                    ? pairsData[index].left.displayValue || ""
                                    : ""
                                }
                                onChange={(e) =>
                                  setValue(
                                    `pairs.${index}.left.displayValue`,
                                    e.target.value
                                  )
                                }
                                label="Слово без буквы"
                                readOnly={!field.value}
                                labelPlacement="inside"
                              />
                            </>
                          ) : (
                            <Input
                              {...field}
                              label="Слово"
                              labelPlacement="inside"
                              isInvalid={fieldState.invalid}
                            />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  rules={{ required: true }}
                />
              </div>

              <div className="flex flex-col gap-2 bg-white dark:bg-gray-600 shadow-medium p-3 rounded-medium flex-1 basis-1/2">
                <Controller
                  name={`pairs.${index}.right.value`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="w-[200px]">
                      {right && right.isLetter ? (
                        <HeroSelect
                          isVirtualized={false}
                          label="Буква"
                          className="min-w-[150px] flex-1"
                          isInvalid={fieldState.invalid}
                          onSelectionChange={(v) => {
                            const selectedLetter = v.currentKey;

                            if (!selectedLetter) return;

                            const selectedItem =
                              alphabetMap.get(selectedLetter);

                            field.onChange(selectedItem?.letter);
                            setValue(
                              `pairs.${index}.right.audioUrl`,
                              selectedItem?.audioUrl
                            );
                          }}
                          selectedKeys={[field.value || ""]}
                        >
                          {activeLang.alphabet.map((item) => (
                            <SelectItem key={item.letter}>
                              {item.letter}
                            </SelectItem>
                          ))}
                        </HeroSelect>
                      ) : (
                        <>
                          <Input
                            {...field}
                            label="Слово"
                            labelPlacement="inside"
                            isInvalid={fieldState.invalid}
                          />
                        </>
                      )}
                    </div>
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
          ))}
        </div>

        <Button onPress={addVariant}>
          <Plus className="size-4" /> Вариант ответа
        </Button>
      </div>
    </>
  );
};
