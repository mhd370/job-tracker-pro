import * as React from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const SettingsContext = React.createContext(null);

export function SettingsProvider({ children }) {
  const [mode, setMode] = useLocalStorage("app_mode", "dark"); // "dark" | "light"

  const toggleMode = React.useCallback(() => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  }, [setMode]);

  const value = React.useMemo(
    () => ({ mode, setMode, toggleMode }),
    [mode, setMode, toggleMode]
  );

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = React.useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside SettingsProvider");
  return ctx;
}
