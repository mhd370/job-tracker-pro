import * as React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Button,
  Stack,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const nav = [
  { label: "Jobs", to: "/" },
  { label: "Add Job", to: "/add" },
  { label: "Stats", to: "/stats" },
  { label: "Settings", to: "/settings" },
];

export default function AppLay() {
  const location = useLocation();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <WorkOutlineIcon />
            <Typography variant="h6" sx={{ fontWeight: 900 }}>
              Job Tracker Pro
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            {nav.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  color="inherit"
                  variant={active ? "outlined" : "text"}
                  startIcon={item.to === "/settings" ? <SettingsOutlinedIcon /> : null}
                  sx={{ borderColor: "rgba(255,255,255,0.55)" }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
