import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  {
    name: "Модули",
    path: "/modules",
  },
  {
    name: "Уроки",
    path: "/lessons",
  },
  {
    name: "Упражнения",
    path: "/exercises",
  },
];

export const LearningHeader = () => {
  return (
    <div className="flex gap-2 items-center justify-between w-full mb-5">
      {items.map((item, i, array) => (
        <React.Fragment key={i}>
          <NavLink
            to={item.path}
            className={({ isActive }) =>
              `${isActive ? "text-blue-600 dark:text-yellow-500" : "text-black dark:text-white"} font-semibold text-[14px]`
            }
          >
            <span
              className={`flex-1 p-2 rounded-medium bg-gray-300 dark:bg-gray-500`}
            >
              {item.name}
            </span>
          </NavLink>
          {i < array.length - 1 && (
            <div className="h-[2px] bg-blue-500 dark:bg-yellow-500 w-full"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};
