import * as React from "react";
import { Box, Card, CardContent, Typography, Stack, Switch } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useSettings } from "../context/SettingsContext";

export default function SettingsPage() {
  const { mode, toggleMode } = useSettings();
  const isDark = mode === "dark";

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Settings
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Stack direction="row" spacing={1.5} alignItems="center">
              {isDark ? <DarkModeIcon /> : <LightModeIcon />}
              <Box>
                <Typography sx={{ fontWeight: 900 }}>Theme</Typography>
                <Typography sx={{ opacity: 0.75 }}>
                  Toggle between Dark and Light mode.
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Typography sx={{ opacity: 0.75 }}>{isDark ? "Dark" : "Light"}</Typography>
              <Switch checked={isDark} onChange={toggleMode} />
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
