import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type Difficult = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
