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
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const nav = [
  { label: "Jobs", to: "/" },
  { label: "Add Job", to: "/add" },
  { label: "Stats", to: "/stats" },
  { label: "Settings", to: "/settings" },
];

export default function AppLay() {
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const closeDrawer = () => setOpen(false);
  const openDrawer = () => setOpen(true);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 1 }}>
          {/* Left: brand */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1 }}>
            <WorkOutlineIcon />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                lineHeight: 1,
              }}
            >
              Job Tracker Pro
            </Typography>
          </Stack>

          {/* Desktop nav */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", md: "flex" } }}
          >
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
                  sx={{
                    borderColor: "rgba(255,255,255,0.55)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Stack>

          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            onClick={openDrawer}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
            aria-label="open menu"
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={open}
        onClose={closeDrawer}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 1.5, display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontWeight: 900, flexGrow: 1 }}>
            Menu
          </Typography>
          <IconButton onClick={closeDrawer} aria-label="close menu">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider />

        <List sx={{ p: 1 }}>
          {nav.map((item) => {
            const active = location.pathname === item.to;
            return (
              <ListItemButton
                key={item.to}
                component={Link}
                to={item.to}
                selected={active}
                onClick={closeDrawer}
                sx={{ borderRadius: 2, mb: 0.5 }}
              >
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: active ? 900 : 700 }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Drawer>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}
