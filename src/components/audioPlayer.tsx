import { addToast } from "@heroui/toast";
import { Play, Square } from "lucide-react";
import { useState, useRef, useCallback } from "react";

interface AudioPlayerProps {
  audioUrl: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(import.meta.env.VITE_API_URL + audioUrl);

      audioRef.current.addEventListener("ended", () => {
        setIsPlaying(false);
      });

      audioRef.current.addEventListener("pause", () => {
        setIsPlaying(false);
      });
    }

    if (isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          addToast({
            title: "Неподдерживаемый формат",
            color: "danger",
          });

          console.error("Error playing audio:", error);
        });
    }
  }, [audioUrl, isPlaying]);

  return (
    <div onClick={togglePlay} className="cursor-pointer">
      {isPlaying ? (
        <Square className="size-6 " />
      ) : (
        <Play className="size-6 " />
      )}
    </div>
  );
};
