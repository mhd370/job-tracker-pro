import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import AppLay from "./components/AppLay"; // انت مسمّيه AppLay
import JobsPage from "./pages/JobsPage";
import AddJobPage from "./pages/AddJobPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import StatsPage from "./pages/StatsPage";
import SettingsPage from "./pages/SettingsPage";

import { JobsProvider } from "./context/JobsContext";
import { SettingsProvider, useSettings } from "./context/SettingsContext";

function ThemedApp() {
  const { mode } = useSettings();

  const theme = React.useMemo(() => {
    return createTheme({
      palette: { mode },
      shape: { borderRadius: 14 },
      typography: {
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      },
    });
  }, [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route element={<AppLay />}>
          <Route path="/" element={<JobsPage />} />
          <Route path="/add" element={<AddJobPage />} />
          <Route path="/jobs/:id" element={<JobDetailsPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <JobsProvider>
          <ThemedApp />
        </JobsProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
