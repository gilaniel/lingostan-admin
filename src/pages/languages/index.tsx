import { LanguageForm } from "./components/languageForm";
import { useLangsStore } from "@/store/useLangsStore";
import { Lang } from "@/types/langs/model";
import { Chip } from "@heroui/chip";
import { useState } from "react";

export default function LanguagesPage() {
  const { langs } = useLangsStore();

  const [activeLang, setACtiveLang] = useState<Lang>({} as Lang);

  return (
    <div className="flex flex-col gap-5 items-start">
      <h1 className="text-3xl font-semibold">Языки</h1>

      <div className="flex gap-3 bg-default-100 p-4 rounded-medium">
        {!!langs.length
          ? langs.map((lang) => (
              <Chip
                key={lang.code}
                className={`bg-black text-white hover:bg-black/60 transition-all cursor-pointer text-[12px] ${activeLang.code === lang.code ? "bg-blue-600 hover:bg-blue-600" : ""}`}
                onClick={() => setACtiveLang(lang)}
              >
                {lang.name}
              </Chip>
            ))
          : "Пока языков нет"}
      </div>

      <LanguageForm activeLang={activeLang} setACtiveLang={setACtiveLang} />
    </div>
  );
}
