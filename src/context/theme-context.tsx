"use client";

import { ReactNode, useEffect, useState } from "react";
import { ThemeProvider as MyThemeProvider } from "next-themes";

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isMounted, setIsMounted] = useState<boolean>(true);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <MyThemeProvider
      data-theme="light"
      defaultTheme="system"
      enableSystem={true}
    >
      {children}
    </MyThemeProvider>
  );
};
