"use client";

import { usePathname } from "@/i18n/navigation";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

type HeroIntroContextValue = {
  introComplete: boolean;
  setIntroComplete: (complete: boolean) => void;
};

const HeroIntroContext = createContext<HeroIntroContextValue | null>(null);

export function HeroIntroProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [introComplete, setIntroComplete] = useState(pathname !== "/");

  useEffect(() => {
    setIntroComplete(pathname !== "/");
  }, [pathname]);

  return (
    <HeroIntroContext.Provider value={{ introComplete, setIntroComplete }}>
      {children}
    </HeroIntroContext.Provider>
  );
}

export function useHeroIntro() {
  const context = useContext(HeroIntroContext);
  if (!context) {
    throw new Error("useHeroIntro must be used within HeroIntroProvider");
  }
  return context;
}
