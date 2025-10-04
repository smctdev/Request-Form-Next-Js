import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiMonitor } from "react-icons/fi";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();
  const [isNotSupportedDarkMode, setIsNotSupportedDarkMode] =
    useState<boolean>(false);

  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const userAgent = navigator.userAgent;
      const unsupportedOS = [
        "Windows NT 5.1",
        "Windows NT 6.0",
        "Windows NT 6.1",
        "Windows NT 6.2",
        "Windows NT 6.3",
      ];
      const isUnsupported = unsupportedOS.some((os) => userAgent.includes(os));
      setIsNotSupportedDarkMode(isUnsupported);
    }
  }, []);

  const toggleDarkMode = (value: string) => () => {
    setTheme(value);
  };

  if (isNotSupportedDarkMode) return null;

  return (
    <>
      {theme === "system" ? (
        <div className="tooltip tooltip-bottom" data-tip="Turn on light mode">
          <SunIcon
            className="size-[27px] cursor-pointer"
            onClick={toggleDarkMode("light")}
          />
        </div>
      ) : theme === "light" ? (
        <div className="tooltip tooltip-bottom" data-tip="Turn on dark mode">
          <MoonIcon
            className="size-[27px] cursor-pointer"
            onClick={toggleDarkMode("dark")}
          />
        </div>
      ) : (
        <div className="tooltip tooltip-bottom" data-tip="Turn on system mode">
          <FiMonitor
            className="size-[27px] cursor-pointer"
            onClick={toggleDarkMode("system")}
          />
        </div>
      )}
    </>
  );
}
