import { AudioPlayer } from "@/components/audioPlayer";
import FileUpload from "@/components/fileUploader";
import { useExerciseStore } from "@/store/useExerciseStore";
import { ExerciseItemContent } from "@/types/exercises/model";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Input } from "@heroui/input";
import { Plus, X } from "lucide-react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";

export const VariantsForm = () => {
  const { control } = useFormContext<ExerciseItemContent>();
  const { activeType } = useExerciseStore();

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

  return (
    <>
      <div className="flex flex-col gap-4 items-start">
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
      </div>
    </>
  );
};
