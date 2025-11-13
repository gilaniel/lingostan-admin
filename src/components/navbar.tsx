import { Link } from "@heroui/link";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
import clsx from "clsx";

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo } from "@/components/icons";
import { LogOut, Menu, X } from "lucide-react";
import { addToast } from "@heroui/toast";
import { apiClient } from "@/services/https";
import { useAuthStore } from "@/store/useAuthStore";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const menuItems = [
  {
    name: "Языки",
    path: "/languages",
  },
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

export const Navbar = () => {
  const { user, resetUser } = useAuthStore();

  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    try {
      await apiClient.post("/auth/logout");

      resetUser();

      navigate("/auth");
    } catch (error) {
      console.log(error);
      addToast({ title: "Что-то пошло не так" });
    }
  };

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      disableAnimation
      isMenuOpen={isMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        {user.email && (
          <div
            className="cursor-pointer"
            onClick={() => {
              setIsMenuOpen((prev) => !prev);
            }}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </div>
        )}
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/"
          >
            <Logo />
          </Link>
          <div className="uppercase font-bold">Lingostan admin panel</div>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </Link>
            </NavbarItem>
          ))}
        </div>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full gap-6"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>

        {user.email && (
          <div className="flex items-center gap-4">
            <span className="font-semibold">{user.email}</span>

            <NavbarItem className="hidden sm:flex gap-2 cursor-pointer">
              <LogOut className="size-5" onClick={handleLogoutClick} />
            </NavbarItem>
          </div>
        )}
      </NavbarContent>

      <NavbarMenu className="max-w-full px-0">
        <div className="mx-auto max-w-7xl w-full px-6 flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <NavbarMenuItem
              key={`${item}-${index}`}
              onClick={() => setIsMenuOpen(false)}
              className="font-semibold"
            >
              <NavLink
                className={({ isActive }) => (isActive ? "text-blue-500" : "")}
                to={item.path}
              >
                {item.name}
              </NavLink>
            </NavbarMenuItem>
          ))}
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
