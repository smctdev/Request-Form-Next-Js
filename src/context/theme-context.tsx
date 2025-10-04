"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as MyThemeProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState<boolean>(true);
  const userAgent = navigator.userAgent;
  const isNotSupportedDarkMode = [
    "Windows NT 5.1",
    "Windows NT 6.0",
    "Windows NT 6.1",
    "Windows NT 6.2",
    "Windows NT 6.3",
  ].includes(userAgent);

  useEffect(() => {
    setIsMounted(true);
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
