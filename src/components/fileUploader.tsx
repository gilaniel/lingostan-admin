import { useState } from "react";
import { apiClient } from "@/services/https";
import { ImageIcon, Music } from "lucide-react";

interface FileUploadProps {
  onUpload: (url: string) => void;
  invalid: boolean;
  name: string;
  type?: "img" | "audio";
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  invalid,
  name,
  type = "audio",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    setError(null);

    try {
      const response = await apiClient.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      onUpload(response.data.url);
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка загрузки");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      className={`relative max-w-[200px] bg-default-100 hover:bg-default-200 transition-colors rounded-medium ${invalid ? "!bg-danger-50 hover:!bg-danger-100" : ""} flex-1`}
    >
      <div className="overflow-hidden">
        <input
          type="file"
          onChange={handleFileChange}
          disabled={isUploading}
          accept="audio/*,image/*"
          className="opacity-0 w-[400px] h-10 cursor-pointer translate-x-[-150px]"
        />
      </div>
      <div className="absolute w-full h-10 left-0 top-0 pointer-events-none flex gap-2 items-center justify-center text-[14px] px-2">
        {name ? (
          <div className="flex items-center gap-2 w-full justify-center">
            {type === "img" ? (
              <ImageIcon className="size-4 flex-shrink-0" />
            ) : (
              <Music className="size-4 flex-shrink-0" />
            )}
            <div className="truncate">
              {name.replace("/api/files/", "").split("-5423-")[0]}
            </div>
          </div>
        ) : (
          <div className="flex gap-2 items-center justify-center">
            {type === "img" ? (
              <ImageIcon className="size-4" />
            ) : (
              <Music className="size-4" />
            )}
            <div className="flex items-start gap-1">
              {type === "audio" ? "Дорожка" : "Изображение"}
            </div>
          </div>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    </div>
  );
};

export default FileUpload;
