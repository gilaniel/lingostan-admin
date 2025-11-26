import { AudioPlayer } from "@/components/audioPlayer";
import FileUpload from "@/components/fileUploader";
import { useLangsStore } from "@/store/useLangsStore";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import { VocabularyItem } from "@/types/vocabulary/model";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Save, Trash } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

export const Create = ({
  selected,
  onDeleteClick,
}: {
  selected: VocabularyItem;
  onDeleteClick: (word: string) => Promise<void>;
}) => {
  const { save } = useVocabularyStore();
  const { activeLang } = useLangsStore();

  const { handleSubmit, control, reset } = useForm<VocabularyItem>({
    defaultValues: {
      word: "",
      audioUrl: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (data: VocabularyItem) => {
    await save(activeLang.id, data);

    reset({ word: "" });

    addToast({ title: "Словарь успешно пополнен", color: "success" });
  };

  useEffect(() => {
    if (selected.word) {
      reset(selected);
      return;
    }

    reset({ word: "" });
  }, [selected, reset]);

  return (
    <Form className="flex gap-5 mt-5" onSubmit={handleSubmit(onSubmit)}>
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

      <Controller
        name="audioUrl"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex items-center gap-2">
            <FileUpload
              onUpload={field.onChange}
              invalid={fieldState.invalid}
              name={field.value || ""}
            />
            {field.value && <AudioPlayer audioUrl={field.value} />}
          </div>
        )}
        rules={{ required: true }}
      />
      <Controller
        name="imageUrl"
        control={control}
        render={({ field, fieldState }) => (
          <div className="flex flex-col items-center gap-2">
            <FileUpload
              type="img"
              onUpload={field.onChange}
              invalid={fieldState.invalid}
              name={field.value || ""}
            />
            {field.value && (
              <img
                className="w-[200px] object-contain object-center rounded-medium shadow-medium"
                src={import.meta.env.VITE_API_URL + field.value}
              />
            )}
          </div>
        )}
        rules={{ required: true }}
      />

      <div className="flex gap-4">
        <Button type="submit" color="success">
          <Save className="size-4" />
          Сохранить
        </Button>
        {selected.word && (
          <Button
            color="danger"
            onPress={async () => {
              await onDeleteClick(selected.word);
              reset({ word: "" });
            }}
          >
            <Trash className="size-4" />
            Удалить
          </Button>
        )}
      </div>
    </Form>
  );
};
