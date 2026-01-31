import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Button,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import { useJobs } from "../context/JobsContext";
import { v4 as uuidv4 } from "uuid";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "interview", label: "Interview" },
  { value: "offer", label: "Offer" },
  { value: "rejected", label: "Rejected" },
];

export default function AddJobPage() {
  const { addJob } = useJobs();
  const navigate = useNavigate();

  const [snack, setSnack] = React.useState({
    open: false,
    message: "",
  });

  const [form, setForm] = React.useState({
    company: "",
    role: "",
    location: "",
    link: "",
    status: "applied",
    appliedDate: "",
    followUpDate: "",
    notes: "",
  });

  const onChange = (key) => (e) => {
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const closeSnack = () => {
    setSnack({ open: false, message: "" });
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (!form.company.trim() || !form.role.trim()) return;

    addJob({
      id: uuidv4(),
      ...form,
      createdAt: new Date().toISOString(),
    });

    setSnack({ open: true, message: "Application added successfully" });

    setTimeout(() => {
      navigate("/");
    }, 800);
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 900, mb: 2 }}>
        Add Application
      </Typography>

      <Card variant="outlined" sx={{ borderRadius: 3 }}>
        <CardContent>
          <Box component="form" onSubmit={onSubmit}>
            <Stack spacing={1.5}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  label="Company *"
                  value={form.company}
                  onChange={onChange("company")}
                  fullWidth
                />
                <TextField
                  label="Role *"
                  value={form.role}
                  onChange={onChange("role")}
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  label="Location"
                  value={form.location}
                  onChange={onChange("location")}
                  fullWidth
                />
                <TextField
                  label="Link"
                  value={form.link}
                  onChange={onChange("link")}
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  select
                  label="Status"
                  value={form.status}
                  onChange={onChange("status")}
                  fullWidth
                >
                  {STATUS_OPTIONS.map((s) => (
                    <MenuItem key={s.value} value={s.value}>
                      {s.label}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  type="date"
                  label="Applied Date"
                  value={form.appliedDate}
                  onChange={onChange("appliedDate")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />

                <TextField
                  type="date"
                  label="Follow-up Date"
                  value={form.followUpDate}
                  onChange={onChange("followUpDate")}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>

              <TextField
                label="Notes"
                value={form.notes}
                onChange={onChange("notes")}
                multiline
                minRows={3}
              />

              <Stack direction="row" justifyContent="flex-end" spacing={1}>
                <Button variant="outlined" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button type="submit" variant="contained">
                  Save
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/*  Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={1500}
        onClose={closeSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="success" variant="filled" onClose={closeSnack}>
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
