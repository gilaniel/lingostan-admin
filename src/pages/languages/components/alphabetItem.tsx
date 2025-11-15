import { AudioPlayer } from "@/components/audioPlayer";
import FileUpload from "@/components/fileUploader";
import { Lang } from "@/types/langs/model";
import { Input } from "@heroui/input";
import { Controller, useFormContext } from "react-hook-form";

export const AlphabetItem = ({ index }: { index: number }) => {
  const { control } = useFormContext<Lang>();

  return (
    <>
      <div className="flex gap-2 flex-1">
        <div className="flex-1">
          <Controller
            control={control}
            name={`alphabet.${index}.letter`}
            render={({
              field: { value, onChange },
              fieldState: { invalid },
            }) => (
              <Input
                isRequired
                isInvalid={invalid}
                label="Буква"
                labelPlacement="outside-top"
                validationBehavior="aria"
                value={value}
                onChange={onChange}
              />
            )}
            rules={{ required: true }}
          />
        </div>

        <div className="flex-1">
          <Controller
            control={control}
            name={`alphabet.${index}.transcription`}
            render={({ field: { value, onChange } }) => (
              <Input
                label="Описание"
                labelPlacement="outside-top"
                validationBehavior="aria"
                value={value}
                onChange={onChange}
              />
            )}
          />
        </div>
      </div>

      <Controller
        control={control}
        name={`alphabet.${index}.audioUrl`}
        render={({ field: { onChange, value }, fieldState: { invalid } }) => (
          <div className="flex items-center gap-2">
            <FileUpload
              onUpload={onChange}
              invalid={invalid}
              name={value || ""}
            />
            {value && <AudioPlayer audioUrl={value} />}
          </div>
        )}
      />
    </>
  );
};
