"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as MyThemeProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const [isNotSupportedDarkMode, setIsNotSupportedDarkMode] =
    useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);

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
  }, [isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <MyThemeProvider
      data-theme={isNotSupportedDarkMode ? "mytheme" : "light"}
      defaultTheme={isNotSupportedDarkMode ? "mytheme" : "system"}
      enableSystem={true}
    >
      {children}
    </MyThemeProvider>
  );
};
