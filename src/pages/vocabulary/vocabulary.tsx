import { useLangsStore } from "@/store/useLangsStore";
import { useVocabularyStore } from "@/store/useVocabularyStore";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { Create } from "./components/create";
import { VocabularyItem } from "@/types/vocabulary/model";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

const Vocabulary = () => {
  const {
    activeLang,
    setACtiveLang,
    langs,
    isLoading: isLangsLoading,
  } = useLangsStore();
  const { fetchData, delete: deleteItem, data } = useVocabularyStore();

  const [isAdd, setAdd] = useState(false);
  const [selectedWord, setWord] = useState<VocabularyItem>();

  const handleDeleteClick = async (word: string) => {
    await deleteItem(activeLang.id, word);

    setWord(undefined);
    addToast({ title: "Слово удалено", color: "success" });
  };

  useEffect(() => {
    fetchData(activeLang.id);
  }, []);

  return (
    <div className="flex flex-col gap-5 items-start pb-[500px]">
      <h1 className="text-3xl font-semibold">Словарь</h1>

      <div className="flex gap-5">
        <Select
          className="min-w-xs"
          selectedKeys={isLangsLoading ? [] : [activeLang.code]}
          label="Язык"
          onSelectionChange={(v) => {
            const lang = langs.find((item) => item.code === v.currentKey);

            if (!lang) return;

            setACtiveLang(lang);

            fetchData(lang.id);
          }}
        >
          {langs.map((lang) => (
            <SelectItem key={lang.code}>{lang.name}</SelectItem>
          ))}
        </Select>

        <Select
          className="min-w-xs"
          selectedKeys={[selectedWord?.word || ""]}
          label="Слово"
          onSelectionChange={(v) => {
            const item = data.find((word) => word.word === v.currentKey);

            if (!item) return;

            setWord(item);
            setAdd(true);
          }}
        >
          {data.map((item) => (
            <SelectItem key={item.word}>{item.word}</SelectItem>
          ))}
        </Select>
      </div>

      <Button
        onPress={() =>
          setAdd((prev) => {
            if (prev) {
              setWord(undefined);
            }
            return !prev;
          })
        }
      >
        {isAdd ? "Отменить" : "Добавить"}
      </Button>

      {isAdd && (
        <Create
          selected={selectedWord || ({} as VocabularyItem)}
          onDeleteClick={handleDeleteClick}
        />
      )}
    </div>
  );
};

export default Vocabulary;
