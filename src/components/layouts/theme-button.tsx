import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { useTheme } from "next-themes";
import { FiMonitor } from "react-icons/fi";

export default function ThemeButton() {
  const { theme, setTheme } = useTheme();

  const toggleDarkMode = (value: string) => () => {
    setTheme(value);
  };
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
