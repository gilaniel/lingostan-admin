import { Select, SelectProps } from "@heroui/select";
import { ReactNode, useRef } from "react";

type HeroSelectProps = {
  emptyMessage?: string;
  children?: ReactNode;
} & SelectProps;

export const HeroSelect = ({
  emptyMessage = "Нет данных",
  listboxProps,
  className = "min-w-xs",
  children,
  selectedKeys,
  onSelectionChange,
  onOpenChange,
  ...props
}: HeroSelectProps) => {
  const scrollPositionRef = useRef<number>(0);
  const listboxRef = useRef<HTMLUListElement>(null);

  const handleSelectionChange = (keys: any) => {
    if (listboxRef.current) {
      scrollPositionRef.current = listboxRef.current.scrollTop;
    }

    if (onSelectionChange) {
      onSelectionChange(keys);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setTimeout(() => {
        if (listboxRef.current && scrollPositionRef.current > 0) {
          if (listboxRef.current) {
            listboxRef.current.scrollTop = scrollPositionRef.current;
          }
        }
      }, 10);
    }
  };

  return (
    <Select
      className={className}
      scrollRef={listboxRef}
      listboxProps={{
        emptyContent: emptyMessage,
        ...listboxProps,
      }}
      selectedKeys={selectedKeys}
      onSelectionChange={handleSelectionChange}
      onOpenChange={handleOpenChange}
      {...props}
    >
      {children}
    </Select>
  );
};
