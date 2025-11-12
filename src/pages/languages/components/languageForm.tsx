import { Lang } from "@/types/langs/model";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Plus, Save, Trash, X } from "lucide-react";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useForm,
} from "react-hook-form";
import { AlphabetItem } from "./alphabetItem";
import { transliterateCyrillicToLatin } from "@/utils/translite";
import { apiClient } from "@/services/https";
import { useLangsStore } from "@/store/useLangsStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { addToast } from "@heroui/toast";
import { Delay } from "@/utils/helpers";
import { Button } from "@heroui/button";

export const LanguageForm = ({
  activeLang,
  setACtiveLang,
}: {
  activeLang: Lang;
  setACtiveLang: (lang: Lang) => void;
}) => {
  const { fetchLangs } = useLangsStore();

  const [isAdd, setAdd] = useState(false);

  const methods = useForm<Lang>({
    defaultValues: {
      code: "",
      name: "",
      alphabet: [],
    },
  });

  const { control, handleSubmit, reset } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "alphabet",
  });

  const resetLang = async () => {
    reset({ name: "" });
    remove();

    await Delay();

    setACtiveLang({} as Lang);
    setAdd(false);
  };

  const addAlphabetItem = () => {
    append({
      letter: "",
      transcription: "",
      audioUrl: "",
      order: fields.length + 1,
    });
  };

  const handleDeleteClick = async () => {
    const confirm = window.confirm(`Удалить ${activeLang.name}?`);

    if (!confirm) return;

    await apiClient.delete(`/languages/${activeLang.id}`);

    fetchLangs();

    resetLang();
  };

  const onSubmit = async (data: Lang) => {
    if (!data.alphabet.length) {
      addToast({
        title: "Алфавит не может быть пустым!",
        color: "danger",
      });

      return;
    }

    if (data.id) {
      await apiClient.patch(`/languages/${data.id}`, data);
    } else {
      await apiClient.post("/languages", {
        ...data,
        code: transliterateCyrillicToLatin(
          data.name.toLowerCase().substring(0, 2)
        ),
      });
    }

    fetchLangs();

    resetLang();
  };

  useEffect(() => {
    if (activeLang.code) {
      setAdd(true);
      reset(activeLang);
    }
  }, [activeLang]);

  return (
    <>
      <div className="flex gap-4">
        {isAdd && activeLang.code && (
          <Button color="danger" onPress={handleDeleteClick}>
            <Trash className="size-4" />
            Удалить
          </Button>
        )}

        <Button
          className="w-auto mb-5"
          onPress={() => {
            if (isAdd) {
              setACtiveLang({} as Lang);
              reset({ name: undefined });
              remove();
            } else {
              addAlphabetItem();
            }

            setAdd((prev) => !prev);
          }}
        >
          {isAdd ? (
            "Отменить"
          ) : (
            <>
              <Plus className="size-4" />
              Добавить язык
            </>
          )}
        </Button>
      </div>

      {isAdd && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <FormProvider {...methods}>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex items-end gap-4 mb-5">
                <div className="flex-1">
                  <Controller
                    control={control}
                    name="name"
                    render={({
                      field: { onChange, value },
                      fieldState: { error, invalid },
                    }) => (
                      <Input
                        isRequired
                        errorMessage={error?.message}
                        isInvalid={invalid}
                        label="Название"
                        labelPlacement="outside-top"
                        validationBehavior="aria"
                        value={value}
                        onChange={onChange}
                      />
                    )}
                    rules={{ required: true }}
                  />
                </div>

                <Button type="submit" color="success">
                  <Save className="size-4" /> Сохранить
                </Button>
              </div>

              <div className="flex gap-4 flex-wrap mb-5 items-end">
                {fields.map((field, index) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 bg-blue-200 dark:bg-gray-600 p-3 rounded-2xl shadow-medium"
                    key={field.id}
                  >
                    <div className="flex flex-col gap-2 max-w-[200px]">
                      <AlphabetItem index={index} />
                    </div>

                    <div
                      className="p-2 rounded-full hover:bg-default-100 cursor-pointer transition-colors"
                      onClick={() => remove(index)}
                    >
                      <X className="size-4 text-red-400" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button onPress={addAlphabetItem}>
                <Plus className="size-4" /> Добавить букву
              </Button>
            </Form>
          </FormProvider>
        </motion.div>
      )}
    </>
  );
};
